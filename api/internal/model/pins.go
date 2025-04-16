package model

import "time"

type PinErrorResponse struct {
	Error string `json:"error"`
}

type PinCategory struct {
	ID        int32     `json:"id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type CreatePinCategoryRequest struct {
	Name string `json:"name" validate:"required"`
}

type CreatePinCategoryResponse struct {
	Category PinCategory `json:"category"`
}
