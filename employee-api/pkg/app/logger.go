package app

import (
	"fmt"
	"io"
	"io/fs"
	"log"
	"log/slog"
	"os"

	"gopkg.in/natefinch/lumberjack.v2"
)

const (
	logFilename     = "/go-api-scaffold/app.log"
	defaultLogsPath = "/var/log/"
	localLogsPath   = "logs/"
)

// ConfigureLogger sets logger to the given logLevel. Also,
// it will configure the logger in such a way that lines are logged both
// to os.Stdout and the rotating log files. Location of log files will be either
//   - /var/log/ if write permissions
//   - Project's logs/ folder otherwise
func ConfigureLogger(logLevel slog.Level) {
	slog.SetLogLoggerLevel(logLevel)

	// Log rotation
	rotatedLogFile := &lumberjack.Logger{
		Filename:   buildFullLogFilename(logDirectory()),
		MaxSize:    500, // MB
		MaxBackups: 3,
		MaxAge:     28, //days
		Compress:   true,
	}

	// Log both to Stdout and rotated log files
	log.SetOutput(io.MultiWriter(os.Stdout, rotatedLogFile))
}

func logDirectory() string {
	if !isDefaultLogDirWritable() {
		return defaultLogsPath
	} else {
		slog.Warn("Cannot write to default log directory, using project folder", "path", localLogsPath)
		return localLogsPath
	}

}

func isDefaultLogDirWritable() bool {
	defaultLogDirInfo, err := os.Stat(defaultLogsPath)

	if err != nil {
		slog.Error("Error checking logs directory permissions", "path", defaultLogsPath, "error", err)
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

func buildFullLogFilename(logsPath string) string {
	return fmt.Sprintf("%s%s", logsPath, logFilename)
}
