package pkg

import (
	"errors"
	"fmt"
)

// Application error codes.
// These are intended to be returned to the consumer and be meaningful
// Should be mapped to the corresponding layer (e.g. http)
const (
	ErrInternal       = "internal_error"  // Error which details that should not be transmitted to the user
	ErrNotValid       = "invalid"         // Request was not valid
	ErrConflict       = "conflict"        // Resource already existing or conflicting
	ErrNotFound       = "not_found"       // Resource not found
	ErrNotImplemented = "not_implemented" // Not implemented yet
	ErrUnauthorized   = "unauthorized"    // Request not authorized
)

type Error struct {
	// Machine-readable error code.
	Code string

	// Human-readable error message.
	Message string
}

// Error implements the error interface. Not used by the application otherwise.
func (e *Error) Error() string {
	return fmt.Sprintf("[employee-api] error: code=%s message=%s", e.Code, e.Message)
}

// ErrorCode unwraps an application error and returns its code.
// Non-application errors always return ErrInternal.
func ErrorCode(err error) string {
	var e *Error
	if err == nil {
		return ""
	} else if errors.As(err, &e) {
		return e.Code
	}
	return ErrInternal
}

// ErrorMessage unwraps an application error and returns its message.
// Non-application errors always return "Internal error".
func ErrorMessage(err error) string {
	var e *Error
	if err == nil {
		return ""
	} else if errors.As(err, &e) {
		return e.Message
	}
	return "Internal error"
}

// Errorf is a helper function to return an Error with a given code and formatted message.
func Errorf(code string, format string, args ...interface{}) *Error {
	return &Error{
		Code:    code,
		Message: fmt.Sprintf(format, args...),
	}
}
