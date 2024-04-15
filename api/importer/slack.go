package importer

import (
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

	logger := s.l.With("email", *email)
	employee, err := s.q.GetEmployeeByEmail(ctx, *email)

	if err != nil {
		logger.Warn("Employee could not be found", "err", err)
		return err
	}

	if _, err := s.q.CreateSlackInfo(ctx, repository.CreateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
	}); err != nil {
		logger.Warn("Employee slack info could not be created", "err", err)
		return err
	}

	logger.Info("Employee slack info succesfully created")

	return nil
}

// ImportSlackInfo implements SlackImporter.
func (s *slackImporter) ImportSlackMembers(ctx context.Context, members SlackMembers) error {
	for _, member := range members.Members {
		if !member.Deleted {
			s.ImportSlackMember(ctx, member)
		}
	}

	return nil
}

func NewSlackImporter(l *slog.Logger, q *repository.Queries) SlackImporter {
	return &slackImporter{l, q}
}
