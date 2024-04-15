package database

import (
	"log/slog"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

const migrationsPathURL = "file://internal/repository/migrations"

type Migrator interface {
	Up() error
}

type migrator struct {
	databaseURL string
}

// Run implements Migrator.
func (m *migrator) Up() error {
	slog.Debug("Starting database migration")

	migrate, err := migrate.New(migrationsPathURL, m.databaseURL)

	if err != nil {
		return err
	}

	err = migrate.Up()

	if err != nil && err.Error() != "no change" {
		return err
	}

	slog.Info("Database migrated succesfully")

	return nil
}

func NewMigrator(dbURL string) Migrator {
	return &migrator{databaseURL: dbURL}
}
