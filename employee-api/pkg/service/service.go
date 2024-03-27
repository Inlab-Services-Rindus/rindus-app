package service

import "strings"

// sanitiseValue lowercases and trims string so it can be uniquely inserted
func sanitiseValue(v string) string {
	lowerCased := strings.ToLower(v)
	trimmed := strings.TrimSpace(lowerCased)

	return trimmed
}
