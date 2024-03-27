package app

import (
	"fmt"
	"log/slog"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

const (
	EnvLocal  = "local"
	EnvDocker = "docker"
)

type Config struct {
	Env      string
	LogLevel slog.Level
	Port     int
	DB       DBConfig
}

type DBConfig struct {
	Name string
	Url  string
}

func LoadConfig() (*Config, error) {
	// We check first if we are in env that provides this value out of the box
	env := os.Getenv("ENV")

	envFiles := getEnvFiles(env)
	err := godotenv.Load(envFiles...)

	if err != nil {
		return nil, err
	}

	logLevel := parseLogLevel(os.Getenv("LOG_LEVEL"))

	port, err := parsePort(os.Getenv("PORT"))

	if err != nil {
		return nil, err
	}

	return &Config{Env: os.Getenv("ENV"), LogLevel: logLevel, Port: port, DB: dbConfig()}, nil
}

func getEnvFiles(env string) []string {
	envFiles := []string{".env"}
	switch env {
	case EnvDocker:
		envFiles = append(envFiles, ".env.docker")
	}

	return envFiles
}

func dbConfig() DBConfig {
	host := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")

	return DBConfig{Name: dbName, Url: buildDbUrl(user, pass, host, dbName)}
}

func buildDbUrl(user string, pass string, host string, dbName string) string {
	return fmt.Sprintf("postgres://%s:%s@%s:5432/%s?sslmode=disable", user, pass, host, dbName)
}

func parseLogLevel(osLogLevel string) slog.Level {
	var logLevel slog.Level

	switch strings.ToUpper(osLogLevel) {
	case "DEBUG":
		logLevel = slog.LevelDebug
	case "INFO":
		logLevel = slog.LevelInfo
	case "WARN":
		logLevel = slog.LevelWarn
	case "ERROR":
		logLevel = slog.LevelError
	default:
		logLevel = slog.LevelInfo
	}

	return logLevel
}

func parsePort(envPort string) (int, error) {
	return strconv.Atoi(envPort)
}
