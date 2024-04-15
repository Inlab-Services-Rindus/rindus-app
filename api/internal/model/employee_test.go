package model

import (
	"testing"
)

func Test_initials(t *testing.T) {
	type args struct {
		firstName string
		lastName  string
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		{"should work with first name and second name", args{"First", "Name"}, "FN"},
		{"should work only with first name", args{"First", ""}, "F"},
		{"should work with lower case names", args{"first", "name"}, "FN"},
		{"should work with compose first name", args{"first middle", "name"}, "FN"},
		{"should work with compose last name", args{"first", "middle name"}, "FM"},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := initials(tt.args.firstName, tt.args.lastName); got != tt.want {
				t.Errorf("initials() = %v, want %v", got, tt.want)
			}
		})
	}
}
