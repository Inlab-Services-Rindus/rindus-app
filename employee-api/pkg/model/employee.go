package model

import "context"

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
