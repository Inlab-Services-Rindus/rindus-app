package app

import (
	"employee-api/pkg/handler"

	"github.com/go-chi/chi/v5"
)

const API_PREFIX = "/api/v1"

func (s *Server) MountRoutes() chi.Router {
	router := s.router

	router.Route(API_PREFIX, func(r chi.Router) {
		handler.NewLanguageHandler(s.languageService).Routes(r)
		handler.NewMetricHandler().Routes(r)
	})

	return router
}

func CreateRouter(addRoutes func(chi.Router)) chi.Router {
	r := chi.NewRouter()

	addRoutes(r)

	return r
}
