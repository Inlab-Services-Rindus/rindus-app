package config

import (
	"log/slog"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

const (
	defaultPort = 8080
)

type Config struct {
	Env      string
	LogLevel slog.Level
	Port     int
	DB       Database
	CORS     CORS
	OAuth    OAuth
}

func LoadConfig() (*Config, error) {
	logger := slog.Default().With("module", "config")
	// We check first if we are in env that provides this value out of the box
	env := os.Getenv("ENV")

	envFiles := getEnvFiles(logger, env)
	err := godotenv.Load(envFiles...)

	if err != nil {
		return nil, err
	}

	return &Config{
		Env:      os.Getenv("ENV"),
		LogLevel: parseLogLevel(logger, os.Getenv("LOG_LEVEL")),
		Port:     parsePort(logger, os.Getenv("PORT")),
		DB:       parseDB(),
		CORS:     parseCORS(),
		OAuth:    parseOAuth(),
	}, nil
}

func parsePort(logger *slog.Logger, envPort string) int {
	port, err := strconv.Atoi(envPort)

	if err != nil {
		logger.Warn("Error while parsing port config", "err", err)
		return defaultPort
	}

	return port
}
