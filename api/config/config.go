package config

import (
	"api/helper"
	"fmt"
	"log/slog"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

const (
	envKeyPrefix = "API"
	defaultPort  = 8080
)

type Config struct {
	Env      string
	LogLevel slog.Level
	Port     int
	DB       Database
	Personio Personio
	CORS     CORS
	OAuth    OAuth
	Metrics  Metrics
}

func LoadConfig() (*Config, error) {
	logger := slog.Default().With("module", "config")
	// We check first if we are in env that provides this value out of the box
	env := getEnv("ENV")

	// If local environment, load local .env file. Otherwise read env variables.
	if helper.IsEmpty(env) || IsLocalEnv(env) {
		envFiles := getEnvFiles(logger, env)
		err := godotenv.Load(envFiles...)

		if err != nil {
			return nil, err
		}
	}

	env = getEnv("ENV")

	return &Config{
		Env:      env,
		LogLevel: parseLogLevel(logger, getEnv("LOG_LEVEL")),
		Port:     parsePort(logger, getEnv("PORT")),
		DB:       parseDB(env),
		Personio: parsePersonioConfig(),
		CORS:     parseCORS(),
		OAuth:    parseOAuth(),
		Metrics:  parseMetrics(),
	}, nil
}

func parsePort(logger *slog.Logger, envPort string) int {
	if helper.IsEmpty(envPort) {
		logger.Warn("Empty port config. Defaulting to", "default", defaultPort)
		return defaultPort
	}

	port, err := strconv.Atoi(envPort)

	if err != nil {
		logger.Warn("Error while parsing port config. Defaulting to", "default", defaultPort, "err", err)
		return defaultPort
	}

	return port
}

// Prefixes config keys
func getEnv(key string) string {
	return os.Getenv(fmt.Sprintf("%s_%s", envKeyPrefix, key))
}
