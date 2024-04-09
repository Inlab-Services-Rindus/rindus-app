package config

import "log/slog"

const (
	envLocal      = "local"
	envDocker     = "docker"
	envProduction = "production"
)

func getEnvFiles(logger *slog.Logger, env string) []string {
	envFiles := []string{".env"}

	switch env {
	case envDocker:
		envFiles = append(envFiles, ".env.docker")
	case envProduction:
		envFiles = append(envFiles, ".env.production")
	default:
		logger.Warn("ENV information not provided, default to .env value")
	}

	return envFiles
}
