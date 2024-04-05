package http

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"strconv"

	"employee-api/internal"

	"github.com/go-chi/chi/v5"
)

// Represent HTTP handlers than can register routes
type Handler interface {
	Routes(r chi.Router)
}

// Encodes response and sets appropiate content header
func JSONResponse(w http.ResponseWriter, r *http.Request, v any) {
	w.Header().Set("Content-type", "application/json")
	if err := json.NewEncoder(w).Encode(v); err != nil {
		LogError(r, internal.Errorf(internal.CodeErrInternal, "Error while encoding response %s=%s %s=%s", "value", v, "err", err))
	}
}

type ErrorResponse struct {
	Error string `json:"error"`
}

func Error(w http.ResponseWriter, r *http.Request, err error) {
	// Extract error code & message.
	code, message := internal.ErrorCode(err), internal.ErrorMessage(err)

	// Log error
	if code == internal.CodeErrInternal {
		LogError(r, err)
	}

	w.WriteHeader(ErrorStatusCode(code))
	JSONResponse(w, r, &ErrorResponse{Error: message})
}

// Appends header indentifying module to the slog.Error
func LogError(r *http.Request, err error) {
	slog.Error(fmt.Sprintf("[http] error in %s %s: %s", r.Method, r.URL.Path, err))
}

// lookup of application error codes to HTTP status codes.
var codes = map[string]int{
	internal.CodeErrInternal:       http.StatusInternalServerError,
	internal.CodeErrNotValid:       http.StatusBadRequest,
	internal.CodeErrNotFound:       http.StatusNotFound,
	internal.CodeErrNotImplemented: http.StatusNotImplemented,
	internal.CodeErrUnauthorized:   http.StatusUnauthorized,
	internal.CodeErrConflict:       http.StatusConflict,
}

// ErrorStatusCode returns the associated HTTP status code for an app error code.
func ErrorStatusCode(code string) int {
	if v, ok := codes[code]; ok {
		return v
	}

	return http.StatusInternalServerError
}

func parseID(param string) (int64, error) {
	id, err := strconv.ParseInt(param, 10, 32)

	if err != nil {
		return 0, err
	}

	return id, nil
}
