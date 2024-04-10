package main

import (
	"context"
	"employee-api/config"
	"employee-api/database"
	"employee-api/importer"
	"employee-api/internal/repository"
	"employee-api/logger"
	"log"
)

func run() error {
	logger := logger.NewLogger("importer", nil)

	config, err := config.LoadConfig()
	if err != nil {
		return err
	}

	ctx := context.Background()
	db, err := database.NewDatabase(ctx, config.DB.Url)
	queries := repository.New(db.Conn())

	return importer.NewPersonioImporter(logger, queries, db.Conn()).ImportEmployees(ctx, importer.DefaultFilePath)
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
