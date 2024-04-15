package config

import (
	"log/slog"
	"reflect"
	"testing"
)

func Test_parseLogLevel(t *testing.T) {
	tests := []struct {
		name       string
		osLogLevel string
		want       slog.Level
	}{
		{"should parse INFO log level succesfully", "INFO", slog.LevelInfo},
		{"should parse DEBUG log level succesfully", "DEBUG", slog.LevelDebug},
		{"should parse WARN log level succesfully", "WARN", slog.LevelWarn},
		{"should parse ERROR log level succesfully", "ERROR", slog.LevelError},
		{"should parse log level in lowercase", "error", slog.LevelError},
		{"should default to INFO", "foo", slog.LevelInfo},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := parseLogLevel(slog.Default(), tt.osLogLevel); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("parseLogLevel() = %v, want %v", got, tt.want)
			}
		})
	}
}
