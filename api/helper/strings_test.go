package helper

import "testing"

func TestIsEmpty(t *testing.T) {
	tests := []struct {
		name string
		arg  string
		want bool
	}{
		{"should return false if non empty string", "something", false},
		{"should return false if non empty string with spaces", "  something ", false},
		{"should return true if empty string", "", true},
		{"should return true if empty string with spaces", "  ", true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsEmpty(tt.arg); got != tt.want {
				t.Errorf("IsEmpty() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestMaskEmail(t *testing.T) {
	tests := []struct {
		name  string
		email string
		want  string
	}{
		{"should mask standard email", "john.doe@example.com", "jo****oe@ex*****.com"},
		{"should mask email with short local part", "jo@example.com", "jo@ex*****.com"},
		{"should mask email with short domain", "john.doe@ex.com", "jo****oe@ex.com"},
		{"should mask email with subdomain", "john.doe@sub.example.com", "jo****oe@su*********.com"},
		{"should handle empty email", "", ""},
		{"should handle invalid email", "invalid-email", "invalid-email"},
		{"should handle email with multiple @", "john@doe@example.com", "invalid-email"},
		{"should handle email with no domain extension", "john.doe@localhost", "jo****oe@lo*******"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := MaskEmail(tt.email); got != tt.want {
				t.Errorf("MaskEmail() = %v, want %v", got, tt.want)
			}
		})
	}
}
