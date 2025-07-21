package main

import (
	"api/config"
	"api/database"
	"api/importer"
	"api/internal/repository"
	"api/logger"
	"api/personioapi"
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
	logger := slog.Default()

	ctx := context.Background()
	db, err := database.NewDatabase(ctx, cfg.DB.Url)
	if err != nil {
		return err
	}

	defer db.Close()

	conn := db.Conn()
	q := repository.New(conn)

	// Services
	personioImporter := importer.NewPersonioImporter(logger, q, conn)
	apiImporter := personioapi.NewImporter(logger, personioImporter, q)
	service := personioapi.NewPersonioService(logger, cfg.Personio.APIUrl, cfg.Personio.ClientID, cfg.Personio.ClientSecret)
	personioApiSeeder := personioapi.NewSeeder(service, apiImporter)
	imp := importer.NewSlackImporter(logger, q)
	slackService := importer.NewSlackService(logger, cfg.Slack.APIUrl, cfg.Slack.AuthToken)
	slackSeeder := importer.NewSlackSeeder(slackService, imp)

	// Run the import process
	if err := importData(slackSeeder, personioApiSeeder, ctx); err != nil {
		return err
	}

	return nil
}

func initLogger() {
	slog.SetDefault(logger.NewLogger("importer", nil))
}

func setLogLevel(logLevel slog.Level) {
	slog.SetLogLoggerLevel(logLevel)
}

func importData(slackSeeder *importer.SlackSeeder, personioApiSeeder personioapi.Seeder, ctx context.Context) error {
	slog.Info("Starting data import process")
	
	if err := personioApiSeeder.Seed(ctx); err != nil {
		slog.Error("Error importing from Personio API", "err", err.Error())
		return err
	}
	slog.Info("Personio API import completed successfully")

	if err := slackSeeder.Seed(ctx); err != nil {
		slog.Error("Error importing from Slack", "err", err.Error())
		return err
	}
	slog.Info("Slack import completed successfully")

	slog.Info("Data import process completed successfully")
	return nil
}

func main() {
	initLogger()

	logger := slog.Default().With("module", "importer")
	if err := run(); err != nil {
		logger.Error("Import error", "message", err)
		os.Exit(1)
	}
}
