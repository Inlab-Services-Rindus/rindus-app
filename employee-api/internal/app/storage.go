package app

import (
	"context"
	"employee-api/internal/repository"

	"github.com/IBM/pgxpoolprometheus"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/prometheus/client_golang/prometheus"
)

type Storage interface {
	NewRepository() *repository.Queries
	Conn() *pgxpool.Pool
	RegisterPrometheusCollector(dbName string)
	Close()
}

type storage struct {
	conn *pgxpool.Pool
}

// Conn implements Storage.
func (s *storage) Conn() *pgxpool.Pool {
	return s.conn
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
