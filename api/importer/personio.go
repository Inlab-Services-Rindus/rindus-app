package importer

import (
	"api/helper"
	"api/internal"
	"api/internal/model"
	"api/internal/repository"
	"context"
	"errors"
	"log/slog"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PersonioImporter interface {
	ImportEmployees(context.Context, model.PersonioEmployees) error
	UpdateEmployees(context.Context, model.PersonioEmployees) error
	ImportEmployee(context.Context, model.PersonioEmployee) (*pgtype.UUID, error)
	UpdateEmployee(context.Context, model.PersonioEmployee) (*pgtype.UUID, error)
}

type personioImporter struct {
	logger *slog.Logger
	q      *repository.Queries
	conn   *pgxpool.Pool
}

// UpdateEmployee implements PersonioImporter.
func (i *personioImporter) UpdateEmployee(ctx context.Context, personioEmpl model.PersonioEmployee) (*pgtype.UUID, error) {
	if err := personioEmpl.Validate(); err != nil {
		return nil, err
	}

	personioID := personioEmpl.ID
	logger := slog.With("personioID", personioID)
	employee, err := i.q.GetEmployeeByPersonioID(ctx, int32(personioID))
	if errors.Is(err, pgx.ErrNoRows) {
		logger.Debug("Employee not found in database")
		return nil, internal.ErrNotFound(strconv.Itoa(personioID))
	}

	if err := i.updateTeamCaptain(ctx, employee.ID, personioEmpl.Data.TeamCaptain); err != nil {
		logger.Warn("Error while updating team captain", "err", err)
	}
	if err := i.updateLanguages(ctx, employee.ID, personioEmpl.Data.Languages); err != nil {
		logger.Warn("Error while updating languages", "err", err)
	}
	partnerID, err := i.obtainUpdatedPartnerID(ctx, employee.ID, personioEmpl.Data.DepartmentID)
	if err != nil {
		logger.Warn("Error while updating partner", "err", err)
	}
	if err := i.updateBasicData(ctx, employee, personioEmpl, partnerID); err != nil {
		logger.Warn("Error while updating basic data", "err", err)
		return nil, err
	}

	return &employee.Uid, nil
}

func (i *personioImporter) updateTeamCaptain(ctx context.Context, employeeID int32, teamCaptain string) error {
	teamCaptainID, err := processTeamCaptain(ctx, i.q, employeeID, teamCaptain)
	if err != nil {
		if helper.IsUniqueViolation(err, "team_captain_id") {
			if err := i.q.UpdateTeamCaptain(ctx, repository.UpdateTeamCaptainParams{EmployeeID: employeeID, TeamCaptainID: *teamCaptainID}); err != nil {
				return err
			}
			return nil
		}
		return err
	}

	return nil
}

func (i *personioImporter) updateLanguages(ctx context.Context, employeeID int32, languages string) error {
	if err := i.q.DeleteEmployeeLanguage(ctx, employeeID); err != nil {
		i.logger.Warn("Unable to delete employee languages, skipping update", "err", err)
		return err
	}

	return i.processLanguages(ctx, employeeID, languages)
}

func (i *personioImporter) obtainUpdatedPartnerID(ctx context.Context, employeeID int32, departmentID string) (*int32, error) {
	tx, err := i.conn.Begin(ctx)
	if err != nil {
		i.logger.Warn("Not possible to create transaction", "err", err)
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := i.q.WithTx(tx)
	partnerID, err := processPartner(ctx, qtx, departmentID)
	if err != nil {
		i.logger.Warn("Partner was not processed due to", "partner", departmentID, "err", err)
		return nil, err
	}

	return &partnerID, nil
}

func (i *personioImporter) updateBasicData(ctx context.Context, employee repository.Employee, personioEmpl model.PersonioEmployee, departmentID *int32) error {
	var partnerID int32
	if departmentID == nil {
		partnerID = employee.PartnerID
	} else {
		partnerID = *departmentID
	}

	if _, err := i.q.UpdateEmployee(ctx, repository.UpdateEmployeeParams{
		PersonioID: employee.PersonioID,
		FirstName:  personioEmpl.Data.FirstName,
		LastName:   helper.ParseString(personioEmpl.Data.LastName),
		Position:   personioEmpl.Data.Position,
		Birthday:   helper.ParseString(personioEmpl.Data.Birthday),
		PartnerID:  partnerID,
	}); err != nil {
		return err
	}

	return nil
}

// UpdateEmployees implements PersonioImporter.
func (i *personioImporter) UpdateEmployees(ctx context.Context, employees model.PersonioEmployees) error {
	for _, empl := range employees.Data.Items {
		i.UpdateEmployee(ctx, empl)

		i.logger.Info("Updating", "email", empl.Data.Email)
	}

	return nil
}

// ImportEmployees implements PersonioImporter.
func (i *personioImporter) ImportEmployees(ctx context.Context, employees model.PersonioEmployees) error {
	for _, empl := range employees.Data.Items {
		i.ImportEmployee(ctx, empl)

		i.logger.Info("Processing", "email", empl.Data.Email)
	}

	return nil
}

func (i *personioImporter) ImportEmployee(ctx context.Context, personioEmpl model.PersonioEmployee) (*pgtype.UUID, error) {
	if err := personioEmpl.Validate(); err != nil {
		return nil, err
	}

	personioID := personioEmpl.ID
	logger := slog.With("personioID", personioID)
	_, err := i.q.GetEmployeeByPersonioID(ctx, int32(personioID))

	if err == nil {
		logger.Debug("Employee already exists. Aborting")

		return nil, internal.ErrConflict(strconv.FormatInt(int64(personioID), 10))
	}

	// Other error
	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	// Partner and employee basic data (transactional)
	createdEmployee, err := i.importTransacting(ctx, logger, personioEmpl)

	if err != nil {
		return nil, err
	}

	// Following processes do not abort employee creation
	if err := i.processLanguages(ctx, createdEmployee.ID, personioEmpl.Data.Languages); err != nil {
		logger.Warn("Employee's languages were not processed due to", "err", err)
	}
	if _, err := processTeamCaptain(ctx, i.q, createdEmployee.ID, personioEmpl.Data.TeamCaptain); err != nil {
		if !helper.IsUniqueViolation(err, "team_captain") {
			logger.Warn("Employee's team captain was not processed due to", "err", err)
		}
	}

	return &createdEmployee.Uid, nil
}

func (i *personioImporter) importTransacting(ctx context.Context, logger *slog.Logger, personioEmpl model.PersonioEmployee) (*repository.Employee, error) {
	logger.Debug("Employee not existing. Creating")
	logger.Debug("Starting transaction")

	tx, err := i.conn.Begin(ctx)
	if err != nil {
		logger.Warn("Not possible to create transaction", "err", err)
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := i.q.WithTx(tx)

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

func (i *personioImporter) processLanguages(ctx context.Context, createdEmployeeID int32, languages string) error {
	personioLanguages := model.ParseLanguages(languages)

	for _, languageEnum := range personioLanguages {
		if err := assignOrCreate(ctx, i.q, createdEmployeeID, languageEnum); err != nil {
			return err
		}
	}

	if len(personioLanguages) == 0 {
		language, err := findOrCreateLanguage(ctx, i.q, "english")
		if err != nil {
			return err
		}

		i.q.AssignEmployeeLanguages(ctx, repository.AssignEmployeeLanguagesParams{EmployeeID: createdEmployeeID, LanguageID: language.ID})

		i.logger.Warn("No languages in personio, assigning 'english'")
	}

	return nil
}

func processTeamCaptain(ctx context.Context, q *repository.Queries, createdEmployeeId int32, teamCaptain string) (*int32, error) {
	email, err := model.ParseTeamCaptain(teamCaptain)
	if err != nil {
		return nil, err
	}

	teamCaptainID, err := q.GetTeamCaptainIDByEmail(ctx, email)
	if err != nil {
		return nil, err
	}

	if err := q.AssignTeamCaptain(ctx, repository.AssignTeamCaptainParams{EmployeeID: createdEmployeeId, TeamCaptainID: teamCaptainID}); err != nil {
		return &teamCaptainID, err
	}

	return &teamCaptainID, nil
}

func assignOrCreate(ctx context.Context, q *repository.Queries, createdEmployeeID int32, languageEnum string) error {
	language, err := findOrCreateLanguage(ctx, q, languageEnum)
	if err != nil {
		return err
	}

	slog.Debug("Language already existing. Assigning", "lang", languageEnum)

	q.AssignEmployeeLanguages(ctx, repository.AssignEmployeeLanguagesParams{EmployeeID: createdEmployeeID, LanguageID: language.ID})

	return nil
}

func findOrCreateLanguage(ctx context.Context, q *repository.Queries, languageEnum string) (*repository.Language, error) {
	language, err := q.GetLanguageByName(ctx, languageEnum)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return nil, err
		}

		language, err = q.CreateLanguage(ctx, languageEnum)

		if err != nil {
			slog.Warn("Language was not created due to", "lang", languageEnum, "err", err)
			return nil, err
		}

		slog.Debug("Language newly created", "lang", languageEnum)

		return &language, nil
	}

	return &language, nil
}

func processEmployeeData(ctx context.Context, qtx *repository.Queries, personioEmployee model.PersonioEmployee, partnerID int32) (*repository.Employee, error) {
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
		PartnerID:  partnerID,
	})

	if err != nil {
		return nil, err
	}

	return &employee, nil
}

func processPartner(ctx context.Context, qtx *repository.Queries, departmentID string) (int32, error) {
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

		return partner.ID, nil
	}

	slog.Debug("Partner already existing. Assigning", "partner", partnerName)

	return partner.ID, nil
}

func NewPersonioImporter(l *slog.Logger, queries *repository.Queries, conn *pgxpool.Pool) PersonioImporter {
	return &personioImporter{l, queries, conn}
}
