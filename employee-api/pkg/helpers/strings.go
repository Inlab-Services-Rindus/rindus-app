package helpers

import "strings"

// sanitiseEnumValue lowercases and trims string so it can be uniquely inserted
func SanitiseEnumValue(v string) string {
	lowerCased := strings.ToLower(v)
	return strings.TrimSpace(lowerCased)
}
