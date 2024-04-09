package main

import (
	"employee-api/config"
	"employee-api/database"
	"employee-api/internal/app"
	"employee-api/internal/service"
	"employee-api/logger"
	"log/slog"
	"os"
)

func run() error {
	config, err := config.LoadConfig()

	if err != nil {
		return err
	}

	setLogLevel(config.LogLevel)

	storage, err := app.ConnectStorage(config.DB.Url)

	if err != nil {
		return err
	}

	defer storage.Close()

	storage.RegisterPrometheusCollector(config.DB.Name)

	err = database.NewMigrator(config.DB.Url).Up()

	if err != nil {
		return err
	}

	// sqlc queries
	queries := storage.NewRepository()

	// Services
	employeeService := service.NewEmployeeService(storage.Conn(), queries)

	server := app.NewServer(config, employeeService)

	server.Setup()

	err = server.Run()

	if err != nil {
		return err
	}

	return nil
}

func initLogger() {
	slog.SetDefault(logger.NewLogger("server", nil))
}

func setLogLevel(logLevel slog.Level) {
	slog.SetLogLoggerLevel(logLevel)
}

func main() {
	initLogger()

	logger := slog.Default().With("module", "main")
	if err := run(); err != nil {
		logger.Error("Startup error", "message", err)
		os.Exit(1)
	}
}
