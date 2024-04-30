package config

import "log/slog"

const (
	envLocal      = "local"
	envDocker     = "docker"
	envStaging    = "staging"
	envProduction = "production"
)

func getEnvFiles(logger *slog.Logger, env string) []string {
	envFiles := []string{".env"}

	switch env {
	case envDocker:
		envFiles = append(envFiles, ".env.docker")
	default:
		logger.Warn("ENV information not provided, default to .env value")
	}

	return envFiles
}

func IsLocalEnv(env string) bool {
	return env == envLocal
}

func IsDockerEnv(env string) bool {
	return env == envDocker
}

func IsDevEnv(env string) bool {
	return IsLocalEnv(env) || IsDockerEnv(env)
}
