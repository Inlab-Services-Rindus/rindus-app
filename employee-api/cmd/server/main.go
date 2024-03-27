package main

import (
	"employee-api/pkg/app"
	"employee-api/pkg/service"
	"log/slog"
	"os"

	"github.com/go-chi/chi/v5"
)

func run() error {
	config, err := app.LoadConfig()

	if err != nil {
		return err
	}

	app.ConfigureLogger(config.LogLevel)

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
	languageService := service.NewLanguageService(queries)

	server := app.NewServer(chi.NewRouter(), config, languageService)

	server.Setup()

	err = server.Run()

	if err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		slog.Error("Startup error", "message", err)
		os.Exit(1)
	}
}
