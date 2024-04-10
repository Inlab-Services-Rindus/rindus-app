package config

import (
	"fmt"
)

type Database struct {
	Name string
	Url  string
}

func parseDB() Database {
	host := getEnv("DB_HOST")
	dbName := getEnv("DB_NAME")
	user := getEnv("DB_USER")
	pass := getEnv("DB_PASS")

	return Database{
		Name: dbName,
		Url:  buildDbUrl(user, pass, host, dbName),
	}
}

func buildDbUrl(user string, pass string, host string, dbName string) string {
	return fmt.Sprintf("postgres://%s:%s@%s:5432/%s?sslmode=disable", user, pass, host, dbName)
}
