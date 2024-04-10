package config

import (
	"employee-api/helper"
	"strings"
)

type CORS struct {
	AllowedOrigins []string
}

func parseCORS() CORS {
	return CORS{parseAllowedOrigins()}
}

func parseAllowedOrigins() []string {
	allowedOrigins := getEnv("CORS_ALLOWED_ORIGINS")

	split := strings.Split(allowedOrigins, ",")

	if len(split) == 0 {
		return []string{"*"}
	}

	result := make([]string, len(split))
	for i, origin := range split {
		result[i] = helper.TrimSpace(origin)
	}

	return result
}
