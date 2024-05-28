package importer

import (
	"api/helper"
	"api/internal/model"
)

const (
	defaultFilePath  = "cmd/resources/"
	PersonioFileName = "employees.json"
	SlackFileName    = "slack.json"
)

func ReadPersonioEmployeesFromFile() (*model.PersonioEmployees, error) {
	return helper.ReadJSONFile[model.PersonioEmployees](defaultFilePath + PersonioFileName)
}

func ReadSlackMembersFromFile() (*SlackMembers, error) {
	return helper.ReadJSONFile[SlackMembers](defaultFilePath + SlackFileName)
}
