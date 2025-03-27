package main

import (
	"api/config"
	"api/database"
	"api/importer"
	"api/internal/repository"
	"api/logger"
	"api/personioapi"
	"context"
	"log"
	"log/slog"
)

func run() error {
	config, err := config.LoadConfig()
	if err != nil {
		return err
	}

	logger := logger.NewLogger("personioapi", &slog.HandlerOptions{Level: config.LogLevel})

	ctx := context.Background()
	db, err := database.NewDatabase(ctx, config.DB.Url)
	if err != nil {
		return err
	}
	conn := db.Conn()
	queries := repository.New(db.Conn())

	imp := importer.NewPersonioImporter(logger, queries, conn)
	apiImporter := personioapi.NewImporter(logger, imp, queries)
	service := personioapi.NewPersonioService(logger, config.Personio.APIUrl, config.Personio.ClientID, config.Personio.ClientSecret)

	if err := personioapi.NewSeeder(service, apiImporter).Seed(ctx); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
