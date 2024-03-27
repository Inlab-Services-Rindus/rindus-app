package app

import (
	"context"
	"employee-api/pkg/repository"
	"log/slog"

	"github.com/IBM/pgxpoolprometheus"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus"
)

const MigrationsPathUrl = "file://pkg/repository/migrations"

type Storage interface {
	NewRepository() *repository.Queries
	RunMigrations() error
	RegisterPrometheusCollector(dbName string)
	Close()
}

type storage struct {
	conn *pgxpool.Pool
}

func (s *storage) RunMigrations() error {
	slog.Debug("Starting database migration")

	m, err := migrate.New(MigrationsPathUrl, s.conn.Config().ConnString())

	if err != nil {
		return err
	}

	err = m.Up()

	if err != nil && err.Error() != "no change" {
		return err
	}

	slog.Info("Database migrated succesfully")

	return nil
}

func (s *storage) NewRepository() *repository.Queries {
	return repository.New(s.conn)
}

func (s *storage) Close() {
	s.conn.Close()
}

func (s *storage) RegisterPrometheusCollector(dbName string) {
	collector := pgxpoolprometheus.NewCollector(s.conn, map[string]string{"db_name": dbName})
	prometheus.MustRegister(collector)
}

func ConnectStorage(connUrl string) (Storage, error) {
	conn, err := pgxpool.New(context.Background(), connUrl)

	if err != nil {
		return nil, err
	}

	return NewStorage(conn), nil
}

func NewStorage(conn *pgxpool.Pool) Storage {
	return &storage{conn}
}
