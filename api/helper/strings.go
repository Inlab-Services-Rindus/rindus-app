package helper

import "strings"

// IsEmpty checks if an string is empty
func IsEmpty(s string) bool {
	return len(TrimSpace(s)) == 0
}

func TrimSpace(s string) string {
	return strings.TrimSpace(s)
}

// sanitiseEnum lowercases and trims string so it can be uniquely inserted
func SanitiseEnum(s string) string {
	lowerCased := strings.ToLower(s)
	return TrimSpace(lowerCased)
}

// MaskEmail masks an email address for privacy while keeping it recognizable.
// Shows first 2 and last 2 chars of local part, and first 2 chars of domain.
// Preserves the domain extension (after the last dot).
// Example: john.doe@example.com -> jo*****oe@ex*****.com
func MaskEmail(email string) string {
	if IsEmpty(email) {
		return ""
	}

	parts := strings.Split(email, "@")
	if len(parts) != 2 {
		return "invalid-email"
	}

	// Mask local part (before @)
	local := parts[0]
	maskedLocal := maskLocalPart(local)

	// Mask domain part (after @)
	domain := parts[1]
	maskedDomain := maskDomain(domain)

	return maskedLocal + "@" + maskedDomain
}


// maskLocalPart shows first 2 chars and last 2 chars, with asterisks in between
func maskLocalPart(s string) string {
	if len(s) <= 4 { // If 4 or fewer chars, just return as is
		return s
	}
	// Show first 2 and last 2 characters
	return s[:2] + strings.Repeat("*", len(s)-4) + s[len(s)-2:]
}

// maskPart shows first 2 chars and replaces the rest with asterisks
func maskPart(s string) string {
	if len(s) <= 2 {
		return s
	}
	return s[:2] + strings.Repeat("*", len(s)-2)
}


func maskDomain(domain string) string {
	// Handle domain with no dots 
	if !strings.Contains(domain, ".") {
		return maskPart(domain)
	}
	
	// Handle domain with extension
	parts := strings.Split(domain, ".")
	extension := parts[len(parts)-1]
	domainName := strings.Join(parts[:len(parts)-1], ".")
	
	return maskPart(domainName) + "." + extension
}
