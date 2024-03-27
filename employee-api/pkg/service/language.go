package service

import (
	"context"
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

type LanguageService interface {
	List(ctx context.Context) ([]repository.Language, error)
	Create(ctx context.Context, name string) (*repository.Language, error)
	Get(ctx context.Context, id int) (*repository.Language, error)
}

type languageService struct {
	q *repository.Queries
}

// Get implements LanguageService.
func (s *languageService) Get(ctx context.Context, id int) (*repository.Language, error) {
	lang, err := s.q.GetLanguage(ctx, int32(id))

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, pkg.Errorf(pkg.ErrNotFound, "Resource %d not found", id)
		}
		return nil, err
	}

	return &lang, err
}

// Create implements LanguageService.
func (s *languageService) Create(ctx context.Context, name string) (*repository.Language, error) {
	n := sanitiseValue(name)

	if len(n) == 0 {
		return nil, pkg.Errorf(pkg.ErrNotValid, "Cannot create empty resource")
	}

	language, err := s.q.CreateLanguage(ctx, n)

	if err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) {
			return nil, pkg.Errorf(pkg.ErrConflict, "Resource %q already exists", n)
		}
		return nil, err
	}

	return &language, nil
}

func (s *languageService) List(ctx context.Context) ([]repository.Language, error) {
	languages, err := s.q.ListLanguages(ctx)

	if err != nil {
		return nil, err
	}

	return languages, nil
}

func NewLanguageService(q *repository.Queries) LanguageService {
	return &languageService{q}
}
