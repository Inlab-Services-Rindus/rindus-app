package main

import (
	"api/config"
	"api/database"
	"api/internal/repository"
	"api/logger"
	"context"
	"log"
)

func run() error {
	logger := logger.NewLogger("updater", nil)

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

	if err := database.NewUpdater(logger, config, queries, conn).Update(ctx); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
