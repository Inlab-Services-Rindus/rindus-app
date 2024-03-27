package service

import (
	"context"
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type OfficeService interface {
	Get(ctx context.Context, id int) (*repository.Office, error)
	List(ctx context.Context) ([]repository.Office, error)
	Create(ctx context.Context, name string) (*repository.Office, error)
}

type officeService struct {
	q *repository.Queries
}

// Get implements LanguageService.
func (s *officeService) Get(ctx context.Context, id int) (*repository.Office, error) {
	office, err := s.q.GetOffice(ctx, int32(id))

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, pkg.Errorf(pkg.ErrNotFound, "Resource %d not found", id)
		}
		return nil, err
	}

	return &office, err
}

// Create implements OfficeService.
func (s *officeService) Create(ctx context.Context, name string) (*repository.Office, error) {
	n := sanitiseValue(name)

	if len(n) == 0 {
		return nil, pkg.Errorf(pkg.ErrNotValid, "Cannot create empty resource")
	}

	office, err := s.q.CreateOffice(ctx, n)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			return nil, pkg.Errorf(pkg.ErrConflict, "Resource %q already exists", n)
		}
		return nil, err
	}

	return &office, nil
}

func (s *officeService) List(ctx context.Context) ([]repository.Office, error) {
	offices, err := s.q.ListOffices(ctx)

	if err != nil {
		return nil, err
	}

	return offices, nil
}

func NewOfficeService(q *repository.Queries) OfficeService {
	return &officeService{q}
}
