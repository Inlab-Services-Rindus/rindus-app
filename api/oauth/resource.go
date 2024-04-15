package oauth

import (
	"net/http"

	"github.com/go-chi/oauth"
)

type ResourceServer struct {
	Authorize func(http.Handler) http.Handler
}

func NewResourceServer(secretKey string) *ResourceServer {
	return &ResourceServer{oauth.Authorize(secretKey, nil)}
}
