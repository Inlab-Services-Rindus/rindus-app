package app

import (
	"api/internal/repository"
	"context"

	"github.com/IBM/pgxpoolprometheus"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus"
)

type Storage interface {
	Queries() *repository.Queries
	Conn() *pgxpool.Pool
	RegisterPrometheusCollector(dbName string)
}

type storage struct {
	q    *repository.Queries
	conn *pgxpool.Pool
}

// Conn implements Storage.
func (s *storage) Conn() *pgxpool.Pool {
	return s.conn
}

// Queries implements Storage.
func (s *storage) Queries() *repository.Queries {
	return s.q
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
	return &storage{conn: conn, q: repository.New(conn)}
}
