package main

import (
	"bytes"
	"employee-api/pkg/model"
	"encoding/json"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
)

type PersonioUsers struct {
	Data PersonioItems `json:"data"`
}

type PersonioItems struct {
	Items []model.PersonioEmployee `json:"items"`
}

func run() error {
	logFile, _ := os.Create("cmd/import/resources/import.log")
	logger := slog.New(slog.NewTextHandler(io.MultiWriter(os.Stdout, logFile), nil))
	file, err := os.Open("cmd/import/resources/users.json")

	if err != nil {
		return err
	}
	defer file.Close()

	data, err := io.ReadAll(file)

	if err != nil {
		return err
	}

	var personioUsers *PersonioUsers
	json.Unmarshal(data, &personioUsers)

	for _, v := range personioUsers.Data.Items {
		x, _ := json.Marshal(v)
		resp, _ := http.Post("http://127.0.0.1:8080/api/v1/employees/import/personio", "application/json", bytes.NewBuffer(x))

		b, _ := io.ReadAll(resp.Body)
		logger.Info("Processing", "email", v.Data.Email, "resp", b)
	}

	return nil
}

func main() {
	if err := run(); err != nil {
		log.Fatalf("Error while executing %s", err)
	}
}
