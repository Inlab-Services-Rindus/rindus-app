package app

import (
	"employee-api/internal/http"

	"github.com/go-chi/chi/v5"
)

const API_PREFIX = "/api/v1"

func (s *Server) MountRoutes() chi.Router {
	router := s.router

	router.Route(API_PREFIX, func(r chi.Router) {
		http.NewEmployeeHandler(s.employeeService).Routes(r)
		http.NewMetricHandler().Routes(r)
	})

	return router
}
