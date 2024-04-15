package model

import (
	"api/helper"
	"api/internal/repository"
	"context"
	"fmt"
	"strings"
)

const (
	personioAvatarURL = "https://avatar-service-platform.personio.de/"
)

type Employee struct {
	UID        string     `json:"uid"`
	FirstName  string     `json:"first_name"`
	LastName   string     `json:"last_name,omitempty"`
	Email      string     `json:"email"`
	PictureUrl string     `json:"picture_url"`
	Partner    Partner    `json:"partner"`
	Position   string     `json:"position"`
	Birthday   string     `json:"birthday,omitempty"`
	Languages  []string   `json:"languages,omitempty"`
	Slack      *SlackInfo `json:"slack,omitempty"`
}

type SlackInfo struct {
	ID      int
	Name    string
	SlackID string
}

type EmployeeService interface {
	FindByUID(ctx context.Context, uid string) (*Employee, error)
	List(ctx context.Context) ([]*Employee, error)
	PersonioImport(ctx context.Context, data PersonioEmployee) (*Employee, error)
}

// BuildEmployee constructs a whole model Employee with all the information
func BuildEmployee(repoEmployee repository.GetEmployeeByUIDRow, languages []string) Employee {
	return Employee{
		UID:        helper.UUIDToString(repoEmployee.Uid),
		FirstName:  repoEmployee.FirstName,
		LastName:   repoEmployee.LastName.String,
		Email:      repoEmployee.Email,
		PictureUrl: repoEmployee.PictureUrl.String,
		Partner: Partner{
			ID:      int(repoEmployee.PID),
			Name:    repoEmployee.PName,
			LogoUrl: repoEmployee.PLogoUrl,
		},
		Position:  repoEmployee.Position,
		Birthday:  repoEmployee.Birthday.String,
		Languages: languages,
		Slack:     nil,
	}
}

func EmployeePicture(firstName string, lastName string) string {
	return fmt.Sprintf("%s%s", personioAvatarURL, initials(firstName, lastName))
}

func initials(firstName string, lastName string) string {
	secondLetter := ""
	firstLetter := firstName[0:1]
	if len(lastName) >= 1 {
		secondLetter = lastName[0:1]
	}

	return strings.ToUpper(firstLetter + secondLetter)
}
