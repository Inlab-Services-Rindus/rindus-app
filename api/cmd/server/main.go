package main

import (
	"api/config"
	"api/database"
	"api/internal/app"
	"api/internal/repository"
	"api/internal/service"
	"api/logger"
	"context"
	"log/slog"
	"os"
)

func run() error {
	cfg, err := config.LoadConfig()

	if err != nil {
		return err
	}

	setLogLevel(cfg.LogLevel)

	ctx := context.Background()
	db, err := database.NewDatabase(ctx, cfg.DB.Url)

	if err != nil {
		return err
	}

	defer db.Close()

	db.RegisterPrometheusCollector(cfg.DB.Name)

	err = database.NewMigrator(cfg.DB.Url).Up()

	if err != nil {
		return err
	}

	conn := db.Conn()
	// sqlc queries
	q := repository.New(conn)

	if config.IsDevEnv(cfg.Env) {
		if err := database.NewSeeder(slog.Default(), cfg, q, conn).Seed(ctx); err != nil {
			slog.Warn("An error happened while seeding database. Skipping", "err", err)
		}
	}

	// Services
	employeeService := service.NewEmployeeService(conn, q)

	server := app.NewServer(cfg, employeeService)

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
