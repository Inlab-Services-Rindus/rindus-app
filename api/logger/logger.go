package logger

import (
	"fmt"
	"io"
	"log/slog"
	"os"

	"gopkg.in/natefinch/lumberjack.v2"
)

const (
	appFolder = "api/"
	logPath   = "log/"
)

// NewLogger sets logger for the given command with standard opts. Also,
// it will configure the logger in such a way that lines are logged both
// to os.Stdout and the rotating log files.
func NewLogger(cmd string, opts *slog.HandlerOptions) *slog.Logger {
	if opts == nil {
		opts = &slog.HandlerOptions{}
	}

	// Log rotation
	rotatingWritter := newRotatingLogger(cmd)
	// log to both stdout and rotating logger
	teeWritter := io.MultiWriter(os.Stdout, rotatingWritter)

	logger := slog.New(slog.NewJSONHandler(teeWritter, opts))
	return logger
}

func newRotatingLogger(cmd string) *lumberjack.Logger {
	return &lumberjack.Logger{
		Filename:   buildFullFilename(logPath, cmd),
		MaxSize:    500, // MB
		MaxBackups: 3,
		MaxAge:     28, //days
		Compress:   true,
	}

}

func logFilename(cmd string) string {
	return fmt.Sprintf("%s.log", cmd)
}

func buildFullFilename(logPath string, cmd string) string {
	return fmt.Sprintf("%s%s", logPath, logFilename(cmd))
}
