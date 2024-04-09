package database

import (
	"context"
	"employee-api/internal/repository"

	"github.com/IBM/pgxpoolprometheus"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus"
)

type Database interface {
	Close()
	NewRepository() *repository.Queries
	RegisterPrometheusCollector(dbName string)
}

type database struct {
	Conn *pgxpool.Pool
}

func (d *database) NewRepository() *repository.Queries {
	return repository.New(d.Conn)
}

func (d *database) Close() {
	d.Conn.Close()
}

func (d *database) RegisterPrometheusCollector(dbName string) {
	collector := pgxpoolprometheus.NewCollector(d.Conn, map[string]string{"db_name": dbName})
	prometheus.MustRegister(collector)
}

func NewDatabase(connUrl string) (Database, error) {
	conn, err := pgxpool.New(context.Background(), connUrl)

	if err != nil {
		return nil, err
	}

	return &database{conn}, nil
}
