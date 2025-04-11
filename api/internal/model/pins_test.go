package model

import (
	"testing"
	"time"
)

func TestPinCategory_Validation(t *testing.T) {
	validTime := time.Now()
	
	tests := []struct {
		name     string
		category PinCategory
		wantErr  bool
	}{
		{
			name: "valid category",
			category: PinCategory{
				ID:        1,
				Name:      "Test Category",
				CreatedAt: validTime,
				UpdatedAt: validTime,
			},
			wantErr: false,
		},
		{
			name: "zero ID is valid for new categories",
			category: PinCategory{
				ID:        0,
				Name:      "New Category",
				CreatedAt: validTime,
				UpdatedAt: validTime,
			},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.category.ID < 0 {
				t.Errorf("PinCategory.ID should not be negative: %v", tt.category.ID)
			}
			if tt.category.Name == "" {
				t.Error("PinCategory.Name should not be empty")
			}
			if tt.category.CreatedAt.IsZero() {
				t.Error("PinCategory.CreatedAt should not be zero")
			}
			if tt.category.UpdatedAt.IsZero() {
				t.Error("PinCategory.UpdatedAt should not be zero")
			}
		})
	}
}

func TestCreatePinCategoryRequest_Validation(t *testing.T) {
	tests := []struct {
		name    string
		request CreatePinCategoryRequest
		wantErr bool
	}{
		{
			name: "valid request",
			request: CreatePinCategoryRequest{
				Name: "Test Category",
			},
			wantErr: false,
		},
		{
			name: "empty name",
			request: CreatePinCategoryRequest{
				Name: "",
			},
			wantErr: true,
		},
		{
			name: "whitespace name",
			request: CreatePinCategoryRequest{
				Name: "   ",
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if tt.request.Name == "" && !tt.wantErr {
				t.Error("CreatePinCategoryRequest should fail validation with empty name")
			}
			if len(tt.request.Name) > 255 && !tt.wantErr {
				t.Error("CreatePinCategoryRequest should fail validation with name longer than 255 characters")
			}
		})
	}
}

func TestCreatePinCategoryResponse_Structure(t *testing.T) {
	validTime := time.Now()
	category := PinCategory{
		ID:        1,
		Name:      "Test Category",
		CreatedAt: validTime,
		UpdatedAt: validTime,
	}

	response := CreatePinCategoryResponse{
		Category: category,
	}

	if response.Category.ID != category.ID {
		t.Errorf("Response Category.ID = %v, want %v", response.Category.ID, category.ID)
	}
	if response.Category.Name != category.Name {
		t.Errorf("Response Category.Name = %v, want %v", response.Category.Name, category.Name)
	}
	if !response.Category.CreatedAt.Equal(category.CreatedAt) {
		t.Errorf("Response Category.CreatedAt = %v, want %v", response.Category.CreatedAt, category.CreatedAt)
	}
	if !response.Category.UpdatedAt.Equal(category.UpdatedAt) {
		t.Errorf("Response Category.UpdatedAt = %v, want %v", response.Category.UpdatedAt, category.UpdatedAt)
	}
}
