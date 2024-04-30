package config

import (
	"log/slog"
	"strings"
)

const (
	levelDebug = "DEBUG"
	levelInfo  = "INFO"
	levelWarn  = "WARN"
	levelError = "ERROR"
)

func parseLogLevel(logger *slog.Logger, osLogLevel string) slog.Level {
	var logLevel slog.Level

	switch strings.ToUpper(osLogLevel) {
	case levelDebug:
		logLevel = slog.LevelDebug
	case levelInfo:
		logLevel = slog.LevelInfo
	case levelWarn:
		logLevel = slog.LevelWarn
	case levelError:
		logLevel = slog.LevelError
	default:
		logger.Warn("Unknown log level config. Defaulting to INFO level", "logLevel", osLogLevel)
		logLevel = slog.LevelInfo
	}

	return logLevel
}
