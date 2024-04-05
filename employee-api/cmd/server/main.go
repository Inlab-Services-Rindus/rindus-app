package main

import (
	"employee-api/config"
	"employee-api/internal/app"
	"employee-api/internal/service"
	"employee-api/logger"
	"log/slog"
	"os"

	"github.com/go-chi/chi/v5"
)

func run() error {
	config, err := config.LoadConfig()

	if err != nil {
		return err
	}

	initLogger(config.LogLevel)

	storage, err := app.ConnectStorage(config.DB.Url)

	if err != nil {
		return err
	}

	defer storage.Close()

	storage.RegisterPrometheusCollector(config.DB.Name)

	err = storage.RunMigrations()

	if err != nil {
		return err
	}

	// sqlc queries
	queries := storage.NewRepository()

	// Services
	employeeService := service.NewEmployeeService(storage.Conn(), queries)

	server := app.NewServer(chi.NewRouter(), config, employeeService)

	server.Setup()

	err = server.Run()

	if err != nil {
		return err
	}

	return nil
}

func initLogger(logLevel slog.Level) {
	slog.SetDefault(logger.NewLogger("server", &slog.HandlerOptions{
		Level: logLevel,
	}))
}

func main() {
	if err := run(); err != nil {
		slog.Error("Startup error", "message", err)
		os.Exit(1)
	}
}
