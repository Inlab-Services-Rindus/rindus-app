package database

import (
	"context"

	"github.com/IBM/pgxpoolprometheus"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus"
)

type Database interface {
	Conn() *pgxpool.Pool
	Close()
	RegisterPrometheusCollector(dbName string)
}

type database struct {
	conn *pgxpool.Pool
}

// Conn implements Database.
func (d *database) Conn() *pgxpool.Pool {
	return d.conn
}

func (d *database) Close() {
	d.conn.Close()
}

func (d *database) RegisterPrometheusCollector(dbName string) {
	collector := pgxpoolprometheus.NewCollector(d.conn, map[string]string{"db_name": dbName})
	prometheus.MustRegister(collector)
}

func NewDatabase(ctx context.Context, connUrl string) (Database, error) {
	conn, err := pgxpool.New(ctx, connUrl)

	if err != nil {
		return nil, err
	}

	return &database{conn}, nil
}
