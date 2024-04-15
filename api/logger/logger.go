package logger

import (
	"api/config"
	"fmt"
	"log/slog"
	"os"

	"github.com/grafana/loki-client-go/loki"
	slogloki "github.com/samber/slog-loki/v3"
)

func NewLogger(module string, cfg config.Config) *slog.Logger {
	logLevel := cfg.Logging.LogLevel
	var handler slog.Handler
	if config.IsLiveEnv(cfg.Env) {
		var err error
		handler, err = createLokiHandler(cfg.Logging)

		if err != nil {
			// loki
			slog.Warn("Imposible to create loki config. Defaulting to stdout", "err", err)
			handler = createTextHandler(logLevel)
		}
	} else {
		handler = createTextHandler(logLevel)
	}

	logger := slog.New(handler).With("module", module)

	return logger
}

func createTextHandler(logLevel slog.Level) slog.Handler {
	return slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{Level: logLevel})
}

func createLokiHandler(logging config.Logging) (slog.Handler, error) {
	config, err := loki.NewDefaultConfig(fmt.Sprintf("%s/loki/api/v1/push", logging.LokiURL))
	if err != nil {
		slog.Warn("Imposible to create loki config", "err", err)
		return nil, err
	}

	client, err := loki.New(config)
	if err != nil {
		slog.Warn("Imposible to create loki client", "err", err)
		return nil, err
	}

	return slogloki.Option{Level: logging.LogLevel, Client: client}.NewLokiHandler(), nil
}
