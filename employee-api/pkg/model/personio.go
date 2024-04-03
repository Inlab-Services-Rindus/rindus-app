package model

import (
	"employee-api/pkg"
	"fmt"
	"strings"
)

const (
	rindusDomain = "rindus.de"
)

type PersonioEmployee struct {
	ID   int                  `json:"id"`
	Data PersonioEmployeeData `json:"data"`
}

type PersonioEmployeeData struct {
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	Email        string `json:"email"`
	DepartmentID string `json:"department_id"`
	Position     string `json:"position"`
	Birthday     string `json:"dynamic_87778"`
	TeamCaptain  string `json:"dynamic_129867"`
	Languages    string `json:"dynamic_1300584"`
}

func (e *PersonioEmployee) Validate() error {
	email := e.Data.Email
	if e.ID <= 0 {
		return pkg.ErrNotValid("personio_id", "Has to be positive integer")
	}
	if len(e.Data.FirstName) == 0 {
		return pkg.ErrNotValid("name", "Cannot be empty")
	}
	if len(email) == 0 {
		return pkg.ErrNotValid("email", "Cannot be empty")
	}
	if !strings.Contains(email, rindusDomain) {
		return pkg.ErrNotValid("email", fmt.Sprintf("Cannot be outside %q domain", rindusDomain))
	}
	if len(e.Data.DepartmentID) == 0 {
		return pkg.ErrNotValid("department_id", "Cannot be empty")
	}
	if len(e.Data.Position) == 0 {
		return pkg.ErrNotValid("position", "Cannot be empty")
	}
	if len(e.Data.TeamCaptain) == 0 {
		return pkg.ErrNotValid("dynamic_129867", "Cannot be empty")
	}

	return nil
}
