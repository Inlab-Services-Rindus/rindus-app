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

func isProductionEnv(env string) bool {
	return env == envProduction
}

func isStagingEnv(env string) bool {
	return env == envStaging
}

func IsDevEnv(env string) bool {
	return IsLocalEnv(env) || IsDockerEnv(env)
}

func IsLiveEnv(env string) bool {
	return isProductionEnv(env) || isStagingEnv(env)
}
