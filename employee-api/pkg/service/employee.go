package service

import (
	"context"
	"employee-api/pkg"
	"employee-api/pkg/helpers"
	"employee-api/pkg/model"
	"employee-api/pkg/repository"
	"errors"
	"log/slog"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EmployeeService struct {
	conn *pgxpool.Pool
	q    *repository.Queries
}

// FindByUID implements EmployeeService.
func (e *EmployeeService) FindByUID(ctx context.Context, uid string) (*model.Employee, error) {
	// Parse string into pg UUID
	uuid := &pgtype.UUID{}
	uuid.Scan(uid)

	repoEmployee, err := e.q.GetEmployeeByUID(ctx, *uuid)

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
			slog.Warn("Err while querying employee languages", "employeeID", employeeID, "err", err)
		}
		languages = make([]string, 0)
	}

	employee := parseEmployee(repoEmployee, languages)

	return &employee, nil
}

func parseEmployee(repoEmployee repository.GetEmployeeByUIDRow, languages []string) model.Employee {
	return model.Employee{
		UID:        string(repoEmployee.Uid.Bytes[:]),
		FirstName:  repoEmployee.FirstName,
		LastName:   repoEmployee.LastName.String,
		Email:      repoEmployee.Email,
		PictureUrl: repoEmployee.PictureUrl.String,
		Partner: model.Partner{
			ID:      int(repoEmployee.PID),
			Name:    repoEmployee.PName,
			LogoUrl: repoEmployee.PLogoUrl,
		},
		Position:  repoEmployee.Position,
		Birthday:  repoEmployee.Birthday.String,
		Languages: languages,
		Slack:     nil,
	}
}

// List implements EmployeeService.
func (e *EmployeeService) List(ctx context.Context) ([]*model.Employee, error) {
	panic("unimplemented")
}

// PersonioImport implements EmployeeService.
func (e *EmployeeService) PersonioImport(ctx context.Context, personioEmpl model.PersonioEmployee) (*model.Employee, error) {
	personioID := personioEmpl.ID
	email := personioEmpl.Data.Email
	_, err := e.q.GetEmployeeByPersonioID(ctx, int32(personioID))

	if err == nil {
		return nil, pkg.ErrConflict(personioID)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	slog.Debug("Employee not existing. Creating", "email", email)
	slog.Debug("Starting transaction")

	tx, err := e.conn.Begin(ctx)
	if err != nil {
		slog.Warn("Not possible to create transaction", "err", err)
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := e.q.WithTx(tx)

	departmentID := personioEmpl.Data.DepartmentID
	partnerID, err := processPartner(ctx, qtx, departmentID)
	if err != nil {
		slog.Warn("Partner was not processed due to", "partner", departmentID, "err", err)
		return nil, err
	}

	createdEmployeeID, err := processEmployeeData(ctx, qtx, personioEmpl, partnerID)
	if err != nil {
		slog.Warn("Employee was not processed due to", "email", email, "err", err)
		return nil, err
	}

	if err := processLanguages(ctx, qtx, createdEmployeeID, personioEmpl.Data.Languages); err != nil {
		slog.Warn("Employee's languages were not processed due to", "email", email, "err", err)
		return nil, err
	}

	slog.Debug("Finishing transaction for employee", "email", email)
	tx.Commit(ctx)

	return nil, nil
}

func processLanguages(ctx context.Context, qtx *repository.Queries, createdEmployeeID int32, languages string) error {
	personioLanguages := strings.Split(languages, ",")

	for _, rawLanguage := range personioLanguages {
		if err := assignOrCreate(ctx, qtx, createdEmployeeID, rawLanguage); err != nil {
			return err
		}
	}

	return nil
}

func assignOrCreate(ctx context.Context, qtx *repository.Queries, createdEmployeeID int32, rawLanguage string) error {
	languageEnum := helpers.SanitiseEnumValue(rawLanguage)

	language, err := qtx.GetLanguageByName(ctx, languageEnum)

	if err != nil {
		if !errors.Is(err, pgx.ErrNoRows) {
			return err
		}

		language, err = qtx.CreateLanguage(ctx, languageEnum)

		if err != nil {
			slog.Warn("Language was not created due to", "lang", languageEnum, "err", err)
			return err
		}

		slog.Debug("Language newly created", "lang", languageEnum)

	}

	slog.Debug("Language already existing. Assigning", "lang", languageEnum)

	qtx.AssignEmployeeLanguages(ctx, repository.AssignEmployeeLanguagesParams{EmployeeID: createdEmployeeID, LanguageID: language.ID})

	return nil
}

func processEmployeeData(ctx context.Context, qtx *repository.Queries, personioEmployee model.PersonioEmployee, partnerID int) (int32, error) {
	employee, err := qtx.CreateEmployee(ctx, repository.CreateEmployeeParams{
		PersonioID: int32(personioEmployee.ID),
		FirstName:  personioEmployee.Data.FirstName,
		LastName:   parseString(personioEmployee.Data.LastName),
		Email:      personioEmployee.Data.Email,
		PictureUrl: pgtype.Text{},
		Position:   personioEmployee.Data.Position,
		Birthday:   parseString(personioEmployee.Data.Birthday),
		PartnerID:  int32(partnerID),
	})

	if err != nil {
		return -1, err
	}

	return employee.ID, nil
}

func parseString(s string) pgtype.Text {
	sanitised := strings.TrimSpace(s)
	if len(sanitised) == 0 {
		return pgtype.Text{}
	}

	return pgtype.Text{String: sanitised, Valid: true}
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
		partner, err = qtx.CreatePartner(ctx, repository.CreatePartnerParams{Name: newPartner.Name, Description: newPartner.Description, LogoUrl: newPartner.LogoUrl})

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
