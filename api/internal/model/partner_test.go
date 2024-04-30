package model

import (
	"testing"
)

func TestParsePersonioPartnerID(t *testing.T) {
	tests := []struct {
		name    string
		arg     string
		want    string
		wantErr bool
	}{
		{"should parse it prefixed departments", "IT Douglas", "Douglas", false},
		{"should not parse it prefixed departments without spaces", "ITDouglas", "", true},
		{"should parse 'People and Culture'", "People and Culture", "rindus", false},
		{"should parse 'People And Culture'", "People And Culture", "rindus", false},
		{"should parse 'people and culture'", "people and culture", "rindus", false},
		{"should parse 'Management'", "Management", "rindus", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := ParsePersonioPartnerID(tt.arg)
			if (err != nil) != tt.wantErr {
				t.Errorf("ParsePersonioPartnerID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("ParsePersonioPartnerID() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_partnerNameAsMapKey(t *testing.T) {
	tests := []struct {
		name string
		arg  string
		want string
	}{
		{"should parse 'C&A'", "C&A", "canda"},
		{"should parse 'Ströer'", "Ströer", "stroer"},
		{"should parse spaces", "Partner With Spaces", "partner-with-spaces"},
		{"should parse 'Loyalty Partner Solutions'", "Loyalty Partner Solutions", "lps"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := partnerNameAsMapKey(tt.arg); got != tt.want {
				t.Errorf("partnerNameAsMapKey() = %v, want %v", got, tt.want)
			}
		})
	}
}
