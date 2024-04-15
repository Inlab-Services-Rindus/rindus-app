package main

import (
	"context"
	"employee-api/config"
	"employee-api/database"
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
	if err != nil {
		return err
	}
	conn := db.Conn()
	queries := repository.New(db.Conn())

	if err := database.NewSeeder(logger, config, queries, conn).Seed(ctx); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
