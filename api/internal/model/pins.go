package model

import "time"


type Pin struct {
	ID           int32      `json:"id"`
	EventDate    string     `json:"event_date"` 
	ImagePin     string     `json:"image_pin"`
	PinTitle     string     `json:"pin_title"`
	PinDescription string   `json:"pin_description"`
	AutoAssigned bool       `json:"auto_assigned"`
	CategoryID   int32      `json:"category_id"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

type CreatePinRequest struct {
	EventDate      string `json:"event_date" validate:"required"`
	ImagePin       string `json:"image_pin" validate:"required"`
	PinTitle       string `json:"pin_title" validate:"required"`
	PinDescription string `json:"pin_description" validate:"required"`
	AutoAssigned   bool   `json:"auto_assigned"`
	CategoryID     int32  `json:"category_id" validate:"required"`
}


type UpdatePinRequest struct {
    EventDate      string `json:"event_date"`
    ImagePin       string `json:"image_pin"`
    PinTitle       string `json:"pin_title"`
    PinDescription string `json:"pin_description"`
    AutoAssigned   bool   `json:"auto_assigned"`
    CategoryID     int32  `json:"category_id"`
}

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

type UpdatePinCategoryRequest struct {
	Name string `json:"name"`
}

type CreatePinCategoryResponse struct {
	Category PinCategory `json:"category"`
}

type EmployeePin struct {
	EmployeeID  int32      `json:"employee_id"`
	PinID       int32      `json:"pin_id"`
	CategoryID  int32      `json:"category_id"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}


type CreateEmployeePinRequest struct {
	EmployeeID int32 `json:"employee_id" validate:"required"`
	PinID      int32 `json:"pin_id" validate:"required"`
}


type UpdateEmployeePinRequest struct {
	EmployeeID int32 `json:"employee_id"`
	PinID      int32 `json:"pin_id"`
}