package app

import (
	"log/slog"
	"reflect"
	"testing"
)

func Test_parsePort(t *testing.T) {
	tests := []struct {
		name    string
		envPort string
		want    int
		wantErr bool
	}{
		{name: "should parse port successfully", envPort: "3000", want: 3000, wantErr: false},
		{name: "should err if incorrect port", envPort: "foo", want: 0, wantErr: true},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parsePort(tt.envPort)
			if (err != nil) != tt.wantErr {
				t.Errorf("parsePort() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("parsePort() = %v, want %v", got, tt.want)
			}
		})
	}
}

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
			if got := parseLogLevel(tt.osLogLevel); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("parseLogLevel() = %v, want %v", got, tt.want)
			}
		})
	}
}
