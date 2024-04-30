package config

import (
	"log/slog"
	"testing"
)

func Test_parsePort(t *testing.T) {
	tests := []struct {
		name    string
		envPort string
		want    int
	}{
		{name: "should parse port successfully", envPort: "3000", want: 3000},
		{name: "should default if incorrect port", envPort: "foo", want: 8080},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := parsePort(slog.Default(), tt.envPort)
			if got != tt.want {
				t.Errorf("parsePort() = %v, want %v", got, tt.want)
			}
		})
	}
}
