package main

import (
	"api/config"
	"api/database"
	"api/importer"
	"api/internal/app"
	"api/internal/repository"
	"api/internal/service"
	"api/logger"
	"api/personioapi"
	"context"
	"log/slog"
	"os"

	"github.com/robfig/cron/v3"
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

	db.RegisterPrometheusCollector(cfg.DB.Name)
	err = database.NewMigrator(cfg.DB.Url).Up()
	if err != nil {
		return err
	}

	conn := db.Conn()
	// sqlc queries
	q := repository.New(conn)
	// if config.IsDevEnv(cfg.Env) {
	// 	if err := database.NewSeeder(slog.Default(), cfg, q, conn).Seed(ctx); err != nil {
	// 		slog.Warn("An error happened while seeding database. Skipping", "err", err)
	// 	}
	// }

	// Services
	personioImporter := importer.NewPersonioImporter(logger, q, conn)
	employeeService := service.NewEmployeeService(q, personioImporter)
	apiImporter := personioapi.NewImporter(logger, personioImporter, q)
	service := personioapi.NewPersonioService(logger, cfg.Personio.APIUrl, cfg.Personio.ClientID, cfg.Personio.ClientSecret)
	personioApiSeeder := personioapi.NewSeeder(service, apiImporter)
	imp := importer.NewSlackImporter(logger, q)
	slackService := importer.NewSlackService(logger, cfg.Slack.APIUrl, cfg.Slack.AuthToken)
	slackSeeder := importer.NewSlackSeeder(slackService, imp)

	server := app.NewServer(cfg, employeeService)
	server.Setup()

	setupCrons(slackSeeder, personioApiSeeder, ctx)
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

func setupCrons(slackSeeder *importer.SlackSeeder, personioApiSeeder personioapi.Seeder, ctx context.Context) {
	c := cron.New()
	slog.Info("Setting up cron jobs")
	_, err := c.AddFunc("19 11 * * *", func() {
		if err := apiImporter(slackSeeder, personioApiSeeder, ctx); err != nil {
			slog.Error("Error while executing cronjob", "err", err.Error())
		}
		slog.Info("Cronjob executed succesfully")
	})
	if err != nil {
		slog.Error("Error setting cronjob", "err", err.Error())
	}
	c.Start()
}

func apiImporter(slackSeeder *importer.SlackSeeder, personioApiSeeder personioapi.Seeder, ctx context.Context) error {
	if err := personioApiSeeder.Seed(ctx); err != nil {
		return err
	}

	if err := slackSeeder.Seed(ctx); err != nil {
		return err
	}

	return nil
}

func main() {
	initLogger()

	logger := slog.Default().With("module", "main")
	if err := run(); err != nil {
		logger.Error("Startup error", "message", err)
		os.Exit(1)
	}
}
