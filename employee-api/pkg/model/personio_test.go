package model

import (
	"testing"
)

func TestPersonioEmployee_Validate(t *testing.T) {
	tests := []struct {
		name     string
		modifier func(e *PersonioEmployee)
		wantErr  bool
	}{
		{"should validate proper employee", func(e *PersonioEmployee) {}, false},
		{"should not validate missing firstName", func(e *PersonioEmployee) { e.Data.FirstName = "" }, true},
		{"should validate missing lastName", func(e *PersonioEmployee) { e.Data.LastName = "" }, false},
		{"should not validate email outside domain", func(e *PersonioEmployee) { e.Data.Email = "first.name@gmail.com" }, true},
		{"should not validate missing department", func(e *PersonioEmployee) { e.Data.DepartmentID = "" }, true},
		{"should not validate missing position", func(e *PersonioEmployee) { e.Data.Position = "" }, true},
		{"should validate missing birthday", func(e *PersonioEmployee) { e.Data.Birthday = "" }, false},
		{"should not validate missing team captain", func(e *PersonioEmployee) { e.Data.TeamCaptain = "" }, true},
		{"should validate missing languages", func(e *PersonioEmployee) { e.Data.Languages = "" }, false},
		{"should not validate nagative IDs", func(e *PersonioEmployee) { e.ID = -5 }, true},
		{"should not validate zero IDs", func(e *PersonioEmployee) { e.ID = 0 }, true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			e := &PersonioEmployee{
				ID: 1,
				Data: PersonioEmployeeData{
					FirstName:    "First",
					LastName:     "Name",
					Email:        "first.name@rindus.de",
					DepartmentID: "IT Home",
					Position:     "Developer",
					Birthday:     "Apr 02",
					TeamCaptain:  "Somebody",
					Languages:    "Spanish, English",
				},
			}
			tt.modifier(e)
			if err := e.Validate(); (err != nil) != tt.wantErr {
				t.Errorf("PersonioEmployee.Validate() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestParseTeamCaptain(t *testing.T) {
	tests := []struct {
		name    string
		arg     string
		want    string
		wantErr bool
	}{
		{"should parse proper team captain string", "Team Captain  | team.captain@rindus.de  |  +XX XXX XXXXXXXX", "team.captain@rindus.de", false},
		{"should not parse empty team captain string", "", "", true},
		{"should not parse incorrect team captain", "Team Captain", "", true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParseTeamCaptain(tt.arg)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParseTeamCaptain() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("ParseTeamCaptain() = %v, want %v", got, tt.want)
			}
		})
	}
}
