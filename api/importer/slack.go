package importer

import (
	"api/helper"
	"api/internal"
	"api/internal/repository"
	"context"
	"errors"
	"log/slog"
)

type SlackImporter interface {
	ImportSlackMembers(context.Context, SlackMembers) error
	ImportSlackMember(context.Context, SlackMember) error
	UpdateSlackMembers(context.Context, SlackMembers) error
	UpdateSlackMember(context.Context, SlackMember) error
}

type slackImporter struct {
	l *slog.Logger
	q *repository.Queries
}

// UpdateSlackMember implements SlackImporter.
func (s *slackImporter) UpdateSlackMember(ctx context.Context, member SlackMember) error {
	id := member.Id
	name := member.Name
	email := member.Profile.Email

	if email == nil {
		return errors.New("missing email")
	}

	employee, err := s.q.GetEmployeeByEmail(ctx, *email)

	if err != nil {
		return internal.ErrNotFound(*email)
	}

	if err := s.q.UpdateSlackInfo(ctx, repository.UpdateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
		AvatarUrl:  helper.ParseString(*member.Profile.Image192),
	}); err != nil {
		if !helper.IsUniqueViolation(err, "employee_id") {
			return err
		}
	}

	return nil
}

// UpdateSlackMembers implements SlackImporter.
func (s *slackImporter) UpdateSlackMembers(ctx context.Context, members SlackMembers) error {
	for _, member := range members.Members {
		s.UpdateSlackMember(ctx, member)
	}

	return nil
}

// ImportSlackMember implements SlackImporter.
func (s *slackImporter) ImportSlackMember(ctx context.Context, member SlackMember) error {
	id := member.Id
	name := member.Name
	email := member.Profile.Email

	if email == nil {
		return errors.New("missing email")
	}

	employee, err := s.q.GetEmployeeByEmail(ctx, *email)

	if err != nil {
		return internal.ErrNotFound(*email)
	}

	if _, err := s.q.CreateSlackInfo(ctx, repository.CreateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
		AvatarUrl:  helper.ParseString(*member.Profile.Image192),
	}); err != nil {
		if !helper.IsUniqueViolation(err, "employee_id") {
			return err
		}
	}

	return nil
}

// ImportSlackInfo implements SlackImporter.
func (s *slackImporter) ImportSlackMembers(ctx context.Context, members SlackMembers) error {
	for _, member := range members.Members {
		s.ImportSlackMember(ctx, member)
	}

	return nil
}

func NewSlackImporter(l *slog.Logger, q *repository.Queries) SlackImporter {
	return &slackImporter{l, q}
}
