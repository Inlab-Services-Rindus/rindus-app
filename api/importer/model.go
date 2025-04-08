package importer

import (
	"api/internal"
	"fmt"
	"strings"
)

const (
	rindusDomain = "rindus."
)

type SlackMembers struct {
	Members []SlackMember `json:"members,omitempty"`
}

type SlackMember struct {
	Id      string       `json:"id,omitempty"`
	Name    string       `json:"name,omitempty"`
	Profile SlackProfile `json:"profile,omitempty"`
}

type SlackProfile struct {
	Email    *string `json:"email,omitempty"`
	Image192 *string `json:"image_192,omitempty"`
}

func (p *SlackProfile) Validate() error {
	email := p.Email
	if email == nil || len(*email) == 0 {
		return internal.ErrNotValid("email", "Cannot be empty")
	}
	if !strings.Contains(*email, rindusDomain) {
		return internal.ErrNotValid("email", fmt.Sprintf("Cannot be outside %q domain", rindusDomain))
	}

	return nil
}
