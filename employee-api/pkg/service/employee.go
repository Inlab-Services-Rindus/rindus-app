package service

import (
	"context"
	"employee-api/pkg"
	"employee-api/pkg/helper"
	"employee-api/pkg/model"
	"employee-api/pkg/repository"
	"errors"
	"log/slog"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EmployeeService struct {
	conn *pgxpool.Pool
	q    *repository.Queries
}

// FindByUID implements EmployeeService.
func (e *EmployeeService) FindByUID(ctx context.Context, uid string) (*model.Employee, error) {
	logger := slog.With("employeeUID", uid)
	uuid := helper.ParseUUID(uid)
	repoEmployee, err := e.q.GetEmployeeByUID(ctx, uuid)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, pkg.ErrNotFound(uid)
		}
		return nil, err
	}

	employeeID := repoEmployee.EmployeeID
	languages, err := e.q.GetEmployeeLanguages(ctx, employeeID)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			logger.Warn("Err while querying employee languages", "err", err)
		}
		slog.Debug("No languages found")
		languages = make([]string, 0)
	}

	employee := model.BuildEmployee(repoEmployee, languages)

	return &employee, nil
}

// List implements EmployeeService.
func (e *EmployeeService) List(ctx context.Context) ([]*model.Employee, error) {
	panic("unimplemented")
}

// PersonioImport implements EmployeeService.
func (e *EmployeeService) PersonioImport(ctx context.Context, personioEmpl model.PersonioEmployee) (*model.Employee, error) {
	personioID := personioEmpl.ID
	logger := slog.With("personioID", personioID)
	_, err := e.q.GetEmployeeByPersonioID(ctx, int32(personioID))

	if err == nil {
		logger.Debug("Employee already exists. Aborting")

		return nil, pkg.ErrConflict(strconv.FormatInt(int64(personioID), 10))
	}

	// Other error
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	// Partner and employee basic data (transactional)
	createdEmployee, err := e.importTransacting(ctx, logger, personioEmpl)

	if err != nil {
		return nil, err
	}

	// Following processes do not abort employee creation
	if err := processLanguages(ctx, e.q, createdEmployee.ID, personioEmpl.Data.Languages); err != nil {
		logger.Warn("Employee's languages were not processed due to", "err", err)
	}
	if err := processTeamCaptain(ctx, e.q, createdEmployee.PartnerID, personioEmpl.Data.TeamCaptain); err != nil {
		logger.Warn("Employee's team captain was not processed due to", "err", err)
	}

	return e.FindByUID(ctx, helper.UUIDToString(createdEmployee.Uid))
}

func (e *EmployeeService) importTransacting(ctx context.Context, logger *slog.Logger, personioEmpl model.PersonioEmployee) (*repository.Employee, error) {
	logger.Debug("Employee not existing. Creating")
	logger.Debug("Starting transaction")

	tx, err := e.conn.Begin(ctx)
	if err != nil {
		logger.Warn("Not possible to create transaction", "err", err)
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := e.q.WithTx(tx)

	departmentID := personioEmpl.Data.DepartmentID
	partnerID, err := processPartner(ctx, qtx, departmentID)
	if err != nil {
		logger.Warn("Partner was not processed due to", "partner", departmentID, "err", err)
		return nil, err
	}

	createdEmployee, err := processEmployeeData(ctx, qtx, personioEmpl, partnerID)
	if err != nil {
		if helper.IsUniqueViolation(err, "email") {
			return nil, pkg.ErrConflict(personioEmpl.Data.Email)
		}
		logger.Warn("Employee was not processed due to", "err", err)
		return nil, err
	}

	logger.Debug("Finishing transaction for employee")
	return createdEmployee, tx.Commit(ctx)
}

func processLanguages(ctx context.Context, q *repository.Queries, createdEmployeeID int32, languages string) error {
	personioLanguages := strings.Split(languages, ",")

	for _, rawLanguage := range personioLanguages {
		if err := assignOrCreate(ctx, q, createdEmployeeID, rawLanguage); err != nil {
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

func assignOrCreate(ctx context.Context, q *repository.Queries, createdEmployeeID int32, rawLanguage string) error {
	languageEnum := helper.SanitiseEnum(rawLanguage)

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

func NewEmployeeService(conn *pgxpool.Pool, q *repository.Queries) EmployeeService {
	return EmployeeService{conn, q}
}
