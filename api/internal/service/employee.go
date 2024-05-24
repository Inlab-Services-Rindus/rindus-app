package service

import (
	"api/helper"
	"api/importer"
	"api/internal"
	"api/internal/model"
	"api/internal/repository"
	"context"
	"errors"
	"log/slog"

	"github.com/jackc/pgx/v5"
)

type EmployeeService struct {
	q        *repository.Queries
	importer importer.PersonioImporter
}

// FindByUID implements EmployeeService.
func (e *EmployeeService) FindByUID(ctx context.Context, uid string) (*model.Employee, error) {
	logger := slog.With("employeeUID", uid)
	uuid := helper.ParseUUID(uid)
	repoEmployee, err := e.q.GetEmployeeByUID(ctx, uuid)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, internal.ErrNotFound(uid)
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

// PersonioImport implements EmployeeService.
func (e *EmployeeService) PersonioImport(ctx context.Context, personioEmpl model.PersonioEmployee) (*model.Employee, error) {
	uid, err := e.importer.ImportEmployee(ctx, personioEmpl)
	if err != nil {
		return nil, err
	}

	return e.FindByUID(ctx, helper.UUIDToString(*uid))
}

func (e *EmployeeService) PersonioUpdate(ctx context.Context, personioEmpl model.PersonioEmployee) (*model.Employee, error) {
	uid, err := e.importer.UpdateEmployee(ctx, personioEmpl)
	if err != nil {
		return nil, err
	}

	return e.FindByUID(ctx, helper.UUIDToString(*uid))
}

func (e *EmployeeService) SlackInfoImport(ctx context.Context, slackInfo importer.SlackMember) (*importer.SlackMember, error) {
	if err := importer.NewSlackImporter(slog.Default(), e.q).ImportSlackMember(ctx, slackInfo); err != nil {
		return nil, err
	}

	return &slackInfo, nil
}

func NewEmployeeService(q *repository.Queries, i importer.PersonioImporter) EmployeeService {
	return EmployeeService{q, i}
}
