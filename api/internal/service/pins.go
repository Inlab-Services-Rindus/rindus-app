package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"
	"strings"
)

type PinsService interface {
	CreatePinCategory(ctx context.Context, req model.CreatePinCategoryRequest) (*model.PinCategory, error)
}

type pinsService struct {
	queries *repository.Queries
}

func NewPinsService(queries *repository.Queries) PinsService {
	return &pinsService{
		queries: queries,
	}
}

func (s *pinsService) CreatePinCategory(ctx context.Context, req model.CreatePinCategoryRequest) (*model.PinCategory, error) {
	if req.Name == "" || len(strings.TrimSpace(req.Name)) == 0 {
		return nil, fmt.Errorf("name cannot be empty")
	}

	category, err := s.queries.CreatePinCategory(ctx, strings.TrimSpace(req.Name))
	if err != nil {
		return nil, err
	}

	return &model.PinCategory{
		ID:        category.ID,
		Name:      category.Name,
		CreatedAt: category.CreatedAt.Time,
		UpdatedAt: category.UpdatedAt.Time,
	}, nil
}
