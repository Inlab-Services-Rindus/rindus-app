package service

import (
	"context"
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"errors"

	"github.com/jackc/pgx/v5"
)

type PartnerService interface {
	Get(ctx context.Context, id int) (*repository.Partner, error)
	List(ctx context.Context) ([]repository.Partner, error)
	Create(ctx context.Context, params repository.CreatePartnerParams) (*repository.Partner, error)
}

type partnerService struct {
	q *repository.Queries
}

// Get implements LanguageService.
func (s *partnerService) Get(ctx context.Context, id int) (*repository.Partner, error) {
	partner, err := s.q.GetPartner(ctx, int32(id))

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, pkg.Errorf(pkg.ErrNotFound, "Resource %d not found", id)
		}
		return nil, err
	}

	return &partner, err
}

// Create implements PartnerService.
func (s *partnerService) Create(ctx context.Context, params repository.CreatePartnerParams) (*repository.Partner, error) {
	partner, err := s.q.CreatePartner(ctx, params)

	if err != nil {
		return nil, err
	}

	return &partner, nil
}

func (s *partnerService) List(ctx context.Context) ([]repository.Partner, error) {
	partners, err := s.q.ListPartners(ctx)

	if err != nil {
		return nil, err
	}

	return partners, nil
}

func NewPartnerService(q *repository.Queries) PartnerService {
	return &partnerService{q}
}
