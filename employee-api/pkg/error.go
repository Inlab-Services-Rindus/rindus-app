package pkg

import (
	"errors"
	"fmt"
)

// Application error codes.
// These are intended to be returned to the consumer and be meaningful
// Should be mapped to the corresponding layer (e.g. http)
const (
	CodeErrInternal       = "internal_error"  // Error which details that should not be transmitted to the user
	CodeErrNotValid       = "invalid"         // Request was not valid
	CodeErrConflict       = "conflict"        // Resource already existing or conflicting
	CodeErrNotFound       = "not_found"       // Resource not found
	CodeErrNotImplemented = "not_implemented" // Not implemented yet
	CodeErrUnauthorized   = "unauthorized"    // Request not authorized
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
	return CodeErrInternal
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
func Errorf(code string, format string, args ...any) *Error {
	return &Error{
		Code:    code,
		Message: fmt.Sprintf(format, args...),
	}
}

func ErrNotFound(resourceID any) *Error {
	return Errorf(CodeErrNotFound, "Resource %q not found", resourceID)
}

func ErrConflict(resourceID any) *Error {
	return Errorf(CodeErrConflict, "Resource %q already existing", resourceID)
}

func ErrNotValid(attrName string, msg string) *Error {
	return Errorf(CodeErrNotValid, "Attribute %q not valid: %s", attrName, msg)
}
