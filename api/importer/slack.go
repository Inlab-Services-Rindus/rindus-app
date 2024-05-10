package importer

import (
	"api/helper"
	"api/internal/repository"
	"context"
	"errors"
	"log/slog"
)

type SlackImporter interface {
	ImportSlackMembers(context.Context, SlackMembers) error
	ImportSlackMember(context.Context, SlackMember) error
}

type slackImporter struct {
	l *slog.Logger
	q *repository.Queries
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
		return err
	}

	if _, err := s.q.CreateSlackInfo(ctx, repository.CreateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
		AvatarUrl:  helper.ParseString(*member.Profile.Image192),
	}); err != nil {
		return err
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
