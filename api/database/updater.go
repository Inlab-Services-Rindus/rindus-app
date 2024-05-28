package database

import (
	"api/config"
	"api/importer"
	"api/internal/repository"
	"context"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Updater interface {
	Update(context.Context) error
}

type updater struct {
	l   *slog.Logger
	cfg *config.Config
	q   *repository.Queries
	c   *pgxpool.Pool
}

func (s *updater) Update(ctx context.Context) error {
	logger := s.l

	count, err := s.q.GetEmployeeCount(context.Background())
	if err != nil {
		return err
	}

	if count == 0 {
		logger.Info("Skipping database update due to non existing employees")
		return nil
	}

	queries := s.q
	conn := s.c

	employees, err := importer.ReadPersonioEmployeesFromFile()
	if err != nil {
		return err
	}

	if err := importer.NewPersonioImporter(logger, queries, conn).UpdateEmployees(ctx, *employees); err != nil {
		return err
	}
	slackMembers, err := importer.ReadSlackMembersFromFile()
	if err != nil {
		return err
	}

	if err := importer.NewSlackImporter(logger, queries).UpdateSlackMembers(ctx, *slackMembers); err != nil {
		return err
	}

	return nil
}

func NewUpdater(l *slog.Logger, cfg *config.Config, q *repository.Queries, c *pgxpool.Pool) Updater {
	return &updater{l, cfg, q, c}
}
