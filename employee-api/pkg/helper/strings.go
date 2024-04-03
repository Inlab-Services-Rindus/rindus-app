package helper

import "strings"

func TrimSpace(s string) string {
	return strings.TrimSpace(s)
}

// sanitiseEnum lowercases and trims string so it can be uniquely inserted
func SanitiseEnum(s string) string {
	lowerCased := strings.ToLower(s)
	return TrimSpace(lowerCased)
}
