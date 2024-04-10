package helper

import (
	"errors"
	"fmt"
	"strings"

	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgtype"
)

const (
	codeUniqueViolation = "23505"
)

// ParseString converts a potentially empty string in a pgtype.Text
func ParseString(s string) pgtype.Text {
	if len(s) == 0 {
		return pgtype.Text{}
	}

	return pgtype.Text{String: s, Valid: true}
}

func ParseUUID(s string) pgtype.UUID {
	uuid := pgtype.UUID{}
	uuid.Scan(s)

	return uuid
}

func UUIDToString(uuid pgtype.UUID) string {
	if !uuid.Valid {
		return ""
	}
	src := uuid.Bytes
	return fmt.Sprintf("%x-%x-%x-%x-%x", src[0:4], src[4:6], src[6:8], src[8:10], src[10:16])
}

func IsUniqueViolation(err error, field string) bool {
	var e *pgconn.PgError
	return errors.As(err, &e) && e.Code == codeUniqueViolation && strings.Contains(e.Message, field)
}
