package app

import (
	"fmt"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"api/config"
	handlers "api/internal/http"
	"api/internal/service"
	"api/oauth"
)

const API_PREFIX = "/api/v1"

type Server struct {
	router          chi.Router
	cfg             *config.Config
	employeeService service.EmployeeService
}

func NewServer(
	cfg *config.Config,
	employeeService service.EmployeeService,
) *Server {
	return &Server{
		chi.NewRouter(),
		cfg,
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
		s.corsHandler(),
	)

	s.MountRoutes()
}

func (s *Server) MountRoutes() chi.Router {
	router := s.router

	authServer := s.createAuthServer()
	resourceServer := oauth.NewResourceServer("secret")

	router.Post(oauth.AuthEndpoint, authServer.ClientCredentialsHandler)

	router.Group(func(r chi.Router) {
		r.Use(middleware.BasicAuth("api", map[string]string{
			s.cfg.Metrics.BasicAuth.User: s.cfg.Metrics.BasicAuth.Pass,
		}))
		handlers.NewMetricHandler().Routes(r)
	})

	router.Route(API_PREFIX, func(r chi.Router) {
		r.Use(resourceServer.Authorize)
		handlers.NewEmployeeHandler(s.employeeService).Routes(r)
	})

	return router
}

func (s *Server) createAuthServer() *oauth.AuthServer {
	cfg := s.cfg.OAuth
	return oauth.NewAuthServer(oauth.AuthServerOpts{
		SecretKey: cfg.SecretKey,
		TTL:       cfg.TokenTTL,
		Credentials: oauth.Credentials{
			ClientID:     cfg.ClientCredentials.ClientID,
			ClientSecret: cfg.ClientCredentials.ClientSecret,
		},
	})
}

func (s *Server) corsHandler() func(http.Handler) http.Handler {
	return cors.Handler(cors.Options{
		AllowedOrigins:   s.cfg.CORS.AllowedOrigins,
		AllowedMethods:   []string{http.MethodGet, http.MethodPut, http.MethodPost, http.MethodDelete, http.MethodHead, http.MethodOptions},
		AllowedHeaders:   []string{"User-Agent", "Content-Type", "Accept", "Accept-Encoding", "Accept-Language", "Cache-Control", "Connection", "DNT", "Host", "Origin", "Pragma", "Referer"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}

func (s *Server) Run() error {
	apiRouter := s.router

	port := s.cfg.Port

	slog.Info("Listening on", "port", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), apiRouter)

	if err != nil {
		return err
	}

	return nil
}
