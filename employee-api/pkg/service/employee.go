package service

import (
	"context"
	"employee-api/pkg"
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
		Slack:     &model.SlackInfo{},
	}
}

// List implements EmployeeService.
func (e *EmployeeService) List(ctx context.Context) ([]*model.Employee, error) {
	panic("unimplemented")
}

// PersonioImport implements EmployeeService.
func (e *EmployeeService) PersonioImport(ctx context.Context, personioEmpl model.PersonioEmployee) (*model.Employee, error) {
	personioID := personioEmpl.ID
	_, err := e.q.GetEmployeeByPersonioID(ctx, int32(personioID))

	if err == nil {
		return nil, pkg.ErrConflict(personioID)
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return nil, err
	}

	slog.Debug("Employee not existing. Creating", "employeeID", personioID)
	slog.Debug("Starting transaction")

	tx, err := e.conn.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	qtx := e.q.WithTx(tx)

	partnerID, err := processPartner(ctx, qtx, personioEmpl.Data.DepartmentID)
	if err != nil {
		return nil, err
	}
	if err := processEmployeeData(ctx, qtx, personioEmpl, partnerID); err != nil {
		return nil, err
	}
	// if err := processLanguages(ctx, qtx, employee, personioEmpl.Data.Languages); err != nil {
	// 	return nil, err
	// }

	slog.Debug("Finishing transaction")
	tx.Commit(ctx)

	return nil, nil
}

func processEmployeeData(ctx context.Context, qtx *repository.Queries, personioEmployee model.PersonioEmployee, partnerID int) error {
	_, err := qtx.CreateEmployee(ctx, repository.CreateEmployeeParams{
		PersonioID: int32(personioEmployee.ID),
		FirstName:  personioEmployee.Data.FirstName,
		LastName:   parseString(personioEmployee.Data.LastName),
		Email:      personioEmployee.Data.Email,
		PictureUrl: pgtype.Text{},
		Position:   personioEmployee.Data.Position,
		Birthday:   parseString(personioEmployee.Data.Birthday),
		PartnerID:  int32(partnerID),
	})

	return err
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
			return -1, err
		}

		slog.Debug("Partner %q newly created", partnerName)

		return int(partner.ID), nil
	}

	slog.Debug("Partner %q already existing. Assigning", partnerName)

	return int(partner.ID), nil
}

func NewEmployeeService(conn *pgxpool.Pool, q *repository.Queries) EmployeeService {
	return EmployeeService{conn, q}
}
