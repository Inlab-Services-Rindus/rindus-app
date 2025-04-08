package personioapi

import (
	"api/internal"
	"fmt"
	"time"
)

const (
	rindusDomain   = "rindus.de"
	statusActive   = "active"
	statusInactive = "inactive"
)

type PersonioTokenResponse struct {
	Data Data `json:"data,omitempty"`
}
type Data struct {
	AccessToken string `json:"token,omitempty"`
}

type CompanyEmployeesResponse struct {
	Data     []Employee `json:"data"`
	Metadata Metadata   `json:"metadata"`
}

type Metadata struct {
	CurrentPage int `json:"current_page"`
	TotalPages  int `json:"total_pages"`
}

type Employee struct {
	Attributes Attributes `json:"attributes"`
}

type Attributes struct {
	ID            FieldValue[int]        `json:"id"`
	FirstName     FieldValue[string]     `json:"first_name"`
	LastName      FieldValue[string]     `json:"last_name"`
	Email         FieldValue[string]     `json:"email"`
	Status        FieldValue[string]     `json:"status"`
	Position      FieldValue[string]     `json:"position"`
	Department    FieldValue[Department] `json:"department"`
	MainLanguages FieldValue[string]     `json:"dynamic_1300584"`
	TeamCaptain   FieldValue[string]     `json:"dynamic_1298673"`
	BirthDate     FieldValue[time.Time]  `json:"dynamic_87778"`
}

type FieldValue[T any] struct {
	Value T `json:"value"`
}

type Department struct {
	Attributes DepartmentAttrs `json:"attributes"`
}

type DepartmentAttrs struct {
	Name string `json:"name"`
}

func (e *Employee) Validate() error {
	if e.Attributes.Status.Value != statusActive && e.Attributes.Status.Value != statusInactive {
		return internal.ErrNotValid("status", fmt.Sprintf("Cannot be different from '%s' or '%s'", statusActive, statusInactive))
	}

	return nil
}
