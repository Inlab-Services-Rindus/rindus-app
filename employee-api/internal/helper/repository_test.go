package helper

import (
	"reflect"
	"testing"

	"github.com/jackc/pgx/v5/pgtype"
)

func TestParseString(t *testing.T) {
	tests := []struct {
		name string
		arg  string
		want pgtype.Text
	}{
		{"should parse a normal string", "string", pgtype.Text{String: "string", Valid: true}},
		{"should parse an empty string", "", pgtype.Text{Valid: false}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := ParseString(tt.arg); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("ParseString() = %v, want %v", got, tt.want)
			}
		})
	}
}
