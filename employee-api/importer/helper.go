package importer

import (
	"employee-api/helper"
	"employee-api/internal/model"
)

const (
	defaultFilePath  = "cmd/import/resources/"
	PersonioFileName = "employees.json"
	SlackFileName    = "slack.json"
)

func ReadPersonioEmployeesFromFile() (*model.PersonioEmployees, error) {
	return helper.ReadJSONFile[model.PersonioEmployees](defaultFilePath + PersonioFileName)
}

func ReadSlackMembersFromFile() (*SlackMembers, error) {
	return helper.ReadJSONFile[SlackMembers](defaultFilePath + SlackFileName)
}
