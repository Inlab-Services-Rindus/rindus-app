package main

import (
	"api/config"
	"api/database"
	"api/importer"
	"api/internal/repository"
	"api/logger"
	"context"
	"log"
	"log/slog"
)

func run() error {
	config, err := config.LoadConfig()
	if err != nil {
		return err
	}

	logger := logger.NewLogger("slack", &slog.HandlerOptions{Level: config.LogLevel})

	ctx := context.Background()
	db, err := database.NewDatabase(ctx, config.DB.Url)
	if err != nil {
		return err
	}
	queries := repository.New(db.Conn())

	imp := importer.NewSlackImporter(logger, queries)
	slackService := importer.NewSlackService(logger, config.Slack.APIUrl, config.Slack.AuthToken)

	if err := importer.NewSlackSeeder(slackService, imp).Seed(ctx); err != nil {
		return err
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
