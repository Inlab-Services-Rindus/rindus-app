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
