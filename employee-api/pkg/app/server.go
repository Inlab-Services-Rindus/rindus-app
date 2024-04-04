package app

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"employee-api/logger"
	"employee-api/pkg/service"
)

type Server struct {
	router          chi.Router
	config          *Config
	employeeService service.EmployeeService
}

func NewServer(
	router *chi.Mux,
	config *Config,
	employeeService service.EmployeeService,
) *Server {
	return &Server{
		router,
		config,
		employeeService,
	}
}

func (s *Server) Setup() {
	apiRouter := s.router

	// Middlewares
	apiRouter.Use(
		middleware.RequestID,
		middleware.Logger,
		middleware.Heartbeat("/ping"),
		middleware.Recoverer,
	)

	s.MountRoutes()
	s.initLogger()
}

func (s *Server) initLogger() {
	slog.SetDefault(logger.NewLogger("server", &slog.HandlerOptions{
		Level: s.config.LogLevel,
	}))
}

func (s *Server) Run() error {
	apiRouter := s.router

	port := s.config.Port

	slog.Info("Listening on", "port", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), apiRouter)

	if err != nil {
		return err
	}

	return nil
}
