package personioapi

import (
	"api/helper"
	"api/importer"
	"api/internal/model"
	"api/internal/repository"
	"context"
	"log/slog"

	"github.com/jackc/pgx/v5/pgtype"
)

type PersonioAPIImporter interface {
	ImportEmployees(context.Context, []Employee) error
	UpdateEmployees(context.Context, []Employee) error
	ImportEmployee(context.Context, Employee) (*pgtype.UUID, error)
	UpdateEmployee(context.Context, Employee) (*pgtype.UUID, error)
}

type personioApiImporter struct {
	logger *slog.Logger
	imp    importer.PersonioImporter
	q      *repository.Queries
}

func (i *personioApiImporter) UpdateEmployees(ctx context.Context, employees []Employee) error {
	for _, empl := range employees {
		i.logger.Info("Updating", "email", helper.MaskEmail(empl.Attributes.Email.Value))

		if _, err := i.UpdateEmployee(ctx, empl); err != nil {
			i.logger.Warn("Error while updating employee", "err", err.Error())
		}
	}

	return nil
}

func (i *personioApiImporter) ImportEmployees(ctx context.Context, employees []Employee) error {
	for _, empl := range employees {
		i.logger.Info("Processing", "email", helper.MaskEmail(empl.Attributes.Email.Value))

		if _, err := i.ImportEmployee(ctx, empl); err != nil {
			i.logger.Warn("Error while importing employee", "err", err.Error())
		}
	}

	return nil
}

func (i *personioApiImporter) ImportEmployee(ctx context.Context, employee Employee) (*pgtype.UUID, error) {
	if err := employee.Validate(); err != nil {
		return nil, err
	}

	return i.imp.ImportEmployee(ctx,
		model.PersonioEmployee{
			ID: employee.Attributes.ID.Value,
			Data: model.PersonioEmployeeData{
				FirstName:    employee.Attributes.FirstName.Value,
				LastName:     employee.Attributes.LastName.Value,
				Email:        employee.Attributes.Email.Value,
				DepartmentID: employee.Attributes.Department.Value.Attributes.Name,
				Position:     employee.Attributes.Position.Value,
				Birthday:     employee.Attributes.BirthDate.Value.Format("Jan 02"),
				TeamCaptain:  employee.Attributes.TeamCaptain.Value,
				Languages:    employee.Attributes.MainLanguages.Value,
			},
		})

}

func (i *personioApiImporter) UpdateEmployee(ctx context.Context, employee Employee) (*pgtype.UUID, error) {
	if err := employee.Validate(); err != nil {
		return nil, err
	}

	if err := i.handleEmployeeStatus(ctx, employee); err != nil {
		return nil, err
	}

	return i.imp.UpdateEmployee(ctx,
		model.PersonioEmployee{
			ID: employee.Attributes.ID.Value,
			Data: model.PersonioEmployeeData{
				FirstName:    employee.Attributes.FirstName.Value,
				LastName:     employee.Attributes.LastName.Value,
				Email:        employee.Attributes.Email.Value,
				DepartmentID: employee.Attributes.Department.Value.Attributes.Name,
				Position:     employee.Attributes.Position.Value,
				Birthday:     employee.Attributes.BirthDate.Value.Format("Jan 02"),
				TeamCaptain:  employee.Attributes.TeamCaptain.Value,
				Languages:    employee.Attributes.MainLanguages.Value,
			},
		})

}

func (i *personioApiImporter) handleEmployeeStatus(ctx context.Context, employee Employee) error {
	personioID := employee.Attributes.ID.Value

	empl, err := i.q.GetEmployeeByPersonioID(ctx, int32(personioID))
	if err != nil {
		return err
	}
	if employee.Attributes.Status.Value == statusInactive && !empl.SoftDeleted {
		if err := i.q.UpdateEmployeeSetSoftDeleted(ctx, empl.PersonioID); err != nil {
			return err
		}
	}

	return nil
}

func NewImporter(l *slog.Logger, imp importer.PersonioImporter, q *repository.Queries) *personioApiImporter {
	return &personioApiImporter{l, imp, q}
}
