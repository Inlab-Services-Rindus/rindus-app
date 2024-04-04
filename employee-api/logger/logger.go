package logger

import (
	"fmt"
	"io"
	"io/fs"
	"log/slog"
	"os"

	"gopkg.in/natefinch/lumberjack.v2"
)

const (
	appFolder      = "employee-api/"
	defaultLogPath = "/var/log/"
	localLogPath   = "log/"
)

// NewLogger sets logger for the given command with standard opts. Also,
// it will configure the logger in such a way that lines are logged both
// to os.Stdout and the rotating log files. Location of log files will be either
//   - /var/log/ if write permissions
//   - Project's logs/ folder otherwise
func NewLogger(cmd string, opts *slog.HandlerOptions) *slog.Logger {
	if opts == nil {
		opts = &slog.HandlerOptions{}
	}

	// Log rotation
	rotatingWritter := newRotatingLogger(cmd)
	// log to both stdout and rotating logger
	teeWritter := io.MultiWriter(os.Stdout, rotatingWritter)

	logger := slog.New(slog.NewTextHandler(teeWritter, opts))
	return logger
}

func newRotatingLogger(cmd string) *lumberjack.Logger {
	logPath := logDirectory()

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

func logDirectory() string {
	if isDefaultLogDirWritable() {
		return fmt.Sprintf("%s%s", defaultLogPath, appFolder)
	} else {
		slog.Warn("Cannot write to default log directory, using project folder", "path", localLogPath)
		return localLogPath
	}

}

func isDefaultLogDirWritable() bool {
	defaultLogDirInfo, err := os.Stat(defaultLogPath)

	if err != nil {
		slog.Error("Error checking logs directory permissions", "path", defaultLogPath, "error", err)
		return false
	}

	defaultLogDirPerm := defaultLogDirInfo.Mode().Perm()

	return hasWritePermissions(defaultLogDirPerm)
}

// TODO: check proper permissions
//   - If the user executing the app is the owner of the dir
//   - If belongs to one of the directory owner groups
func hasWritePermissions(perm fs.FileMode) bool {
	// Permissions
	// owner_group_other
	// xxx_xxx_xxx
	return perm&0b000_010_010 > 0
}

func buildFullFilename(logPath string, cmd string) string {
	return fmt.Sprintf("%s%s", logPath, logFilename(cmd))
}
