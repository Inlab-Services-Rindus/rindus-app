package service

import (
	"api/internal/model"
	"api/internal/repository"
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PinsService interface {

	CreatePinCategory(ctx context.Context, req model.CreatePinCategoryRequest) (*model.PinCategory, error)
	GetPinCategories(ctx context.Context) ([]model.PinCategory, error)
	SoftDeletePinCategory(ctx context.Context, id int32) error

	GetPins(ctx context.Context) ([]model.Pin, error)
	GetPinByID(ctx context.Context, id int32) (*model.Pin, error)
	CreatePin(ctx context.Context, req model.CreatePinRequest) (*model.Pin, error)
	UpdatePin(ctx context.Context, id int32, req model.UpdatePinRequest) (*model.Pin, error)
	SoftDeletePin(ctx context.Context, id int32) error

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

	if _, err := qtx.SoftDeletePin(ctx, id); err != nil {
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

func (s *pinsService) GetPins(ctx context.Context) ([]model.Pin, error) {
	pins, err := s.queries.GetPins(ctx)
	if err != nil {
		return nil, err
	}

	pinsList := make([]model.Pin, 0)
	for _, pin := range pins {
		pinsList = append(pinsList, model.Pin{
			ID:           pin.ID,
			EventDate:    pin.EventDate.Time.Format("2006-01-02"),
			ImagePin:     pin.ImagePin,
			PinTitle:     pin.PinTitle,
			PinDescription: pin.PinDescription,
			AutoAssigned: pin.AutoAssigned.Bool,
			CategoryID:   pin.CategoryID,
			CreatedAt:    pin.CreatedAt.Time,
			UpdatedAt:    pin.UpdatedAt.Time,
		})
	}

	return pinsList, nil
}

func (s *pinsService) GetPinByID(ctx context.Context, id int32) (*model.Pin, error) {
	pin, err := s.queries.GetPinByID(ctx, id)
	if err != nil {
		return nil, err
	}

	return &model.Pin{
		ID:           pin.ID,
		EventDate:    pin.EventDate.Time.Format("2006-01-02"),
		ImagePin:     pin.ImagePin,
		PinTitle:     pin.PinTitle,
		PinDescription: pin.PinDescription,
		AutoAssigned: pin.AutoAssigned.Bool,
		CategoryID:   pin.CategoryID,
		CreatedAt:    pin.CreatedAt.Time,
		UpdatedAt:    pin.UpdatedAt.Time,
	}, nil
}
	

// validatePinRequest checks that required fields in the pin request are not empty or invalid.
func validatePinRequest(eventDate, imagePin, pinTitle, pinDescription string, categoryID int32) error {
	if strings.TrimSpace(eventDate) == "" {
		return fmt.Errorf("event_date is required")
	}
	if strings.TrimSpace(imagePin) == "" {
		return fmt.Errorf("image_pin is required")
	}
	if strings.TrimSpace(pinTitle) == "" {
		return fmt.Errorf("pin_title is required")
	}
	if strings.TrimSpace(pinDescription) == "" {
		return fmt.Errorf("pin_description is required")
	}
	if categoryID <= 0 {
		return fmt.Errorf("category_id is required")
	}
	return nil
}

// stringPtrToPgtypeDate converts a *string (YYYY-MM-DD) to pgtype.Date, handling nil as NULL.
func stringPtrToPgtypeDate(dateStr *string) (pgtype.Date, error) {
	var d pgtype.Date
	if dateStr == nil {
		return d, nil
	}
	if err := d.Scan(*dateStr); err != nil {
		return d, fmt.Errorf("invalid event_date: %w", err)
	}
	return d, nil
}

func (s *pinsService) CreatePin(ctx context.Context, req model.CreatePinRequest) (*model.Pin, error) {
	if err := validatePinRequest(req.EventDate, req.ImagePin, req.PinTitle, req.PinDescription, req.CategoryID); err != nil {
		return nil, err
	}

	eventDate, err := stringPtrToPgtypeDate(&req.EventDate)
	if err != nil {
		return nil, err
	}

	repoPin, err := s.queries.CreatePin(ctx, repository.CreatePinParams{
		EventDate:      eventDate,
		ImagePin:       req.ImagePin,
		PinTitle:       req.PinTitle,
		PinDescription: req.PinDescription,
		AutoAssigned:   pgtype.Bool{Bool: req.AutoAssigned, Valid: true},
		CategoryID:     req.CategoryID,
	})
	if err != nil {
		return nil, err
	}

	return &model.Pin{
		ID:             repoPin.ID,
		EventDate:      req.EventDate,
		ImagePin:       repoPin.ImagePin,
		PinTitle:       repoPin.PinTitle,
		PinDescription: repoPin.PinDescription,
		AutoAssigned:   repoPin.AutoAssigned.Bool,
		CategoryID:     repoPin.CategoryID,
		CreatedAt:      repoPin.CreatedAt.Time,
		UpdatedAt:      repoPin.UpdatedAt.Time,
	}, nil
}


func checkText(s *string) pgtype.Text {
	if s != nil {
		return pgtype.Text{String: *s, Valid: true}
	}
	return pgtype.Text{Valid: false}
}

func checkInt4(i *int32) pgtype.Int4 {
	if i != nil && *i != 0 { // Ensure 0 is not passed
		return pgtype.Int4{Int32: *i, Valid: true}
	}
	return pgtype.Int4{Valid: false} // This handles nil or invalid values
}


func checkBool(b *bool) pgtype.Bool {
	if b != nil {
		return pgtype.Bool{Bool: *b, Valid: true}
	}
	return pgtype.Bool{Valid: false}
}

func checkDate(d *string) pgtype.Date {
	if d != nil {
		t, err := time.Parse("2006-01-02", *d)
		if err == nil {
			var date pgtype.Date
			_ = date.Scan(t)
			return date
		}
	}
	return pgtype.Date{Valid: false}
}


func (s *pinsService) UpdatePin(ctx context.Context, id int32, req model.UpdatePinRequest) (*model.Pin, error) {
	newPin := repository.UpdatePinParams{
		ID:             id,
		EventDate:      checkDate(&req.EventDate),       
		ImagePin:       checkText(&req.ImagePin),        
		PinTitle:       checkText(&req.PinTitle),       
		PinDescription: checkText(&req.PinDescription),  
		AutoAssigned:   checkBool(&req.AutoAssigned),   
		CategoryID:     checkInt4(&req.CategoryID),    
	}
	
	repoPin, err := s.queries.UpdatePin(ctx, newPin)
	if err != nil {
		return nil, err
	}

	return &model.Pin{
		ID:             repoPin.ID,
		EventDate:      repoPin.EventDate.Time.Format("2006-01-02"),
		ImagePin:       repoPin.ImagePin,
		PinTitle:       repoPin.PinTitle,
		PinDescription: repoPin.PinDescription,
		AutoAssigned:   repoPin.AutoAssigned.Bool,
		CategoryID:     repoPin.CategoryID,
		CreatedAt:      repoPin.CreatedAt.Time,
		UpdatedAt:      repoPin.UpdatedAt.Time,
	}, nil
}

func (s *pinsService) SoftDeletePin(ctx context.Context, id int32) error {
	_, err := s.queries.SoftDeletePin(ctx, id)
	
	if err != nil {
		return err
	}

	return nil
}
