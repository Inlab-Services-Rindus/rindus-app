package config

import (
	"fmt"
	"os"
)

type Database struct {
	Name string
	Url  string
}

func parseDB() Database {
	host := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")

	return Database{
		Name: dbName,
		Url:  buildDbUrl(user, pass, host, dbName),
	}
}

func buildDbUrl(user string, pass string, host string, dbName string) string {
	return fmt.Sprintf("postgres://%s:%s@%s:5432/%s?sslmode=disable", user, pass, host, dbName)
}
