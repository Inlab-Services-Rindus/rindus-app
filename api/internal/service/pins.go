package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgxpool"
)

type PinsService interface {
	CreatePinCategory(ctx context.Context, req model.CreatePinCategoryRequest) (*model.PinCategory, error)
	GetPinCategories(ctx context.Context) ([]model.PinCategory, error)
	SoftDeletePinCategory(ctx context.Context, id int32) error
}

type pinsService struct {
	queries *repository.Queries
	conn    *pgxpool.Pool
}

func NewPinsService(queries *repository.Queries, conn *pgxpool.Pool) PinsService {
	return &pinsService{
		queries: queries,
		conn:    conn,
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

func (s *pinsService) GetPinCategories(ctx context.Context) ([]model.PinCategory, error) {
	categories, err := s.queries.GetPinCategories(ctx)
	if err != nil {
		return nil, err
	}

	var pinCategories []model.PinCategory
	for _, category := range categories {
		pinCategories = append(pinCategories, model.PinCategory{
			ID:        category.ID,
			Name:      category.Name,
			CreatedAt: category.CreatedAt.Time,
			UpdatedAt: category.UpdatedAt.Time,
		})
	}

	return pinCategories, nil
}

func (s *pinsService) SoftDeletePinCategory(ctx context.Context, id int32) error {
	tx, err := s.conn.Begin(ctx)

	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	qtx := s.queries.WithTx(tx)

	if err := qtx.SoftDeleteEmployeePin(ctx, id); err != nil {
		return fmt.Errorf("failed to soft delete employee pins: %w", err)
	}

	if err := qtx.SoftDeletePin(ctx, id); err != nil {
		return fmt.Errorf("failed to soft delete pins: %w", err)
	}

	if err := qtx.SoftDeletePinCategory(ctx, id); err != nil {
		return fmt.Errorf("failed to soft delete pin category: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
	