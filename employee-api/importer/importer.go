package importer

import (
	"context"
	"employee-api/helper"
	"employee-api/internal"
	"employee-api/internal/model"
	"employee-api/internal/repository"
	"errors"
	"log/slog"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

const (
	DefaultFilePath = "cmd/import/resources/employees.json"
)

type PersonioImporter interface {
	ImportEmployees(context.Context, string) error
	ImportEmployee(context.Context, model.PersonioEmployee) (*pgtype.UUID, error)
}

type personioImporter struct {
	l    *slog.Logger
	q    *repository.Queries
	conn *pgxpool.Pool
}

// ImportEmployees implements PersonioImporter.
func (i *personioImporter) ImportEmployees(ctx context.Context, filePath string) error {
	logger := i.l

	employees, err := readPersonioEmployeesFromFile(filePath)
	if err != nil {
		return err
	}

	for _, empl := range employees.Data.Items {
		i.ImportEmployee(ctx, empl)

		logger.Info("Processing", "email", empl.Data.Email)
	}

	return nil
}

func readPersonioEmployeesFromFile(filePath string) (*model.PersonioEmployees, error) {
	file, err := os.Open(filePath)

	if err != nil {
		return nil, err
	}
	defer file.Close()

	personioUsers, err := helper.JSONDecode[model.PersonioEmployees](file)
	if err != nil {
		return nil, err
	}

	return personioUsers, nil
}

func (p *personioImporter) ImportEmployee(ctx context.Context, personioEmpl model.PersonioEmployee) (*pgtype.UUID, error) {
	personioID := personioEmpl.ID
	logger := slog.With("personioID", personioID)
	_, err := p.q.GetEmployeeByPersonioID(ctx, int32(personioID))

	if err == nil {
		logger.Debug("Employee already exists. Aborting")

		return nil, internal.ErrConflict(strconv.FormatInt(int64(personioID), 10))
	}

	// Other error
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	// Partner and employee basic data (transactional)
	createdEmployee, err := p.importTransacting(ctx, logger, personioEmpl)

	if err != nil {
		return nil, err
	}

	// Following processes do not abort employee creation
	if err := processLanguages(ctx, p.q, createdEmployee.ID, personioEmpl.Data.Languages); err != nil {
		logger.Warn("Employee's languages were not processed due to", "err", err)
	}
	if err := processTeamCaptain(ctx, p.q, createdEmployee.PartnerID, personioEmpl.Data.TeamCaptain); err != nil {
		if !helper.IsUniqueViolation(err, "team_captain") {
			logger.Warn("Employee's team captain was not processed due to", "err", err)
		}
	}

	return &createdEmployee.Uid, nil
}

func (p *personioImporter) importTransacting(ctx context.Context, logger *slog.Logger, personioEmpl model.PersonioEmployee) (*repository.Employee, error) {
	logger.Debug("Employee not existing. Creating")
	logger.Debug("Starting transaction")

	tx, err := p.conn.Begin(ctx)
	if err != nil {
		logger.Warn("Not possible to create transaction", "err", err)
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := p.q.WithTx(tx)

	departmentID := personioEmpl.Data.DepartmentID
	partnerID, err := processPartner(ctx, qtx, departmentID)
	if err != nil {
		logger.Warn("Partner was not processed due to", "partner", departmentID, "err", err)
		return nil, err
	}

	createdEmployee, err := processEmployeeData(ctx, qtx, personioEmpl, partnerID)
	if err != nil {
		if helper.IsUniqueViolation(err, "email") {
			return nil, internal.ErrConflict(personioEmpl.Data.Email)
		}
		logger.Warn("Employee was not processed due to", "err", err)
		return nil, err
	}

	logger.Debug("Finishing transaction for employee")
	return createdEmployee, tx.Commit(ctx)
}

func processLanguages(ctx context.Context, q *repository.Queries, createdEmployeeID int32, languages string) error {
	personioLanguages := model.ParseLanguages(languages)

	for _, languageEnum := range personioLanguages {
		if err := assignOrCreate(ctx, q, createdEmployeeID, languageEnum); err != nil {
			return err
		}
	}

	return nil
}

func processTeamCaptain(ctx context.Context, q *repository.Queries, partnerID int32, teamCaptain string) error {
	email, err := model.ParseTeamCaptain(teamCaptain)

	if err != nil {
		return err
	}

	teamCaptainID, err := q.GetTeamCaptainIDByEmail(ctx, email)

	if err != nil {
		return err
	}

	if err := q.AssignTeamCaptain(ctx, repository.AssignTeamCaptainParams{EmployeeID: teamCaptainID, PartnerID: partnerID}); err != nil {
		return err
	}

	return nil
}

func assignOrCreate(ctx context.Context, q *repository.Queries, createdEmployeeID int32, languageEnum string) error {
	language, err := q.GetLanguageByName(ctx, languageEnum)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return err
		}

		language, err = q.CreateLanguage(ctx, languageEnum)

		if err != nil {
			slog.Warn("Language was not created due to", "lang", languageEnum, "err", err)
			return err
		}

		slog.Debug("Language newly created", "lang", languageEnum)

	}

	slog.Debug("Language already existing. Assigning", "lang", languageEnum)

	q.AssignEmployeeLanguages(ctx, repository.AssignEmployeeLanguagesParams{EmployeeID: createdEmployeeID, LanguageID: language.ID})

	return nil
}

func processEmployeeData(ctx context.Context, qtx *repository.Queries, personioEmployee model.PersonioEmployee, partnerID int) (*repository.Employee, error) {
	firstName := personioEmployee.Data.FirstName
	lastName := personioEmployee.Data.LastName
	pictureURL := model.EmployeePicture(firstName, lastName)

	employee, err := qtx.CreateEmployee(ctx, repository.CreateEmployeeParams{
		PersonioID: int32(personioEmployee.ID),
		FirstName:  firstName,
		LastName:   helper.ParseString(lastName),
		Email:      personioEmployee.Data.Email,
		PictureUrl: helper.ParseString(pictureURL),
		Position:   personioEmployee.Data.Position,
		Birthday:   helper.ParseString(personioEmployee.Data.Birthday),
		PartnerID:  int32(partnerID),
	})

	if err != nil {
		return nil, err
	}

	return &employee, nil
}

func processPartner(ctx context.Context, qtx *repository.Queries, departmentID string) (int, error) {
	partnerName, err := model.ParsePersonioPartnerID(departmentID)

	if err != nil {
		return -1, err
	}

	partner, err := qtx.GetPartnerByName(ctx, partnerName)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return -1, err
		}

		newPartner := model.NewPartner(partnerName)
		partner, err = qtx.CreatePartner(ctx, repository.CreatePartnerParams{Name: newPartner.Name, Description: helper.ParseString(newPartner.Description), LogoUrl: newPartner.LogoUrl})

		if err != nil {
			slog.Warn("Partner was not created due to", "partner", partnerName, "err", err)
			return -1, err
		}

		slog.Debug("Partner newly created", "partner", partnerName)

		return int(partner.ID), nil
	}

	slog.Debug("Partner already existing. Assigning", "partner", partnerName)

	return int(partner.ID), nil
}

func NewPersonioImporter(l *slog.Logger, queries *repository.Queries, conn *pgxpool.Pool) PersonioImporter {
	return &personioImporter{l, queries, conn}
}
