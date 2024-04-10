package database

import (
	"context"
	"employee-api/config"
	"employee-api/importer"
	"employee-api/internal/repository"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Seeder interface {
	Seed(context.Context) error
}

type seeder struct {
	l   *slog.Logger
	cfg *config.Config
	q   *repository.Queries
	c   *pgxpool.Pool
}

// Seed implements Seeder.
func (s *seeder) Seed(ctx context.Context) error {
	logger := s.l

	count, err := s.q.GetEmployeeCount(context.Background())
	if err != nil {
		return err
	}

	if count > 0 {
		logger.Info("Skipping database seeding due to existing employees")
		return nil
	}

	if err := importer.NewPersonioImporter(logger, s.q, s.c).ImportEmployees(ctx, importer.DefaultFilePath); err != nil {
		return err
	}

	return nil
}

func NewSeeder(l *slog.Logger, cfg *config.Config, q *repository.Queries, c *pgxpool.Pool) Seeder {
	return &seeder{l, cfg, q, c}
}
