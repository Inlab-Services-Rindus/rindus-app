package importer

import (
	"api/helper"
	"api/internal"
	"api/internal/repository"
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"strings"
)

type SlackImporter interface {
	ImportSlackMembers(context.Context, SlackMembers) error
	ImportSlackMember(context.Context, SlackMember) error
	UpdateSlackMembers(context.Context, SlackMembers) error
	UpdateSlackMember(context.Context, SlackMember) error
}

type slackImporter struct {
	l *slog.Logger
	q *repository.Queries
}

// UpdateSlackMember implements SlackImporter.
func (s *slackImporter) UpdateSlackMember(ctx context.Context, member SlackMember) error {
	if err := member.Profile.Validate(); err != nil {
		return err
	}
	id := member.Id
	name := member.Name
	email := member.Profile.Email
	s.l.Info("Updating slack member", "email", email)

	indexOfDomain := strings.LastIndex(*email, ".")
	emailPattern := fmt.Sprintf("%s.%s", (*email)[:indexOfDomain], "%")
	employee, err := s.q.GetEmployeeByEmail(ctx, emailPattern)
	if err != nil {
		return internal.ErrNotFound(*email)
	}

	if err := s.q.UpdateSlackInfo(ctx, repository.UpdateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
		AvatarUrl:  helper.ParseString(*member.Profile.Image192),
	}); err != nil {
		if !helper.IsUniqueViolation(err, "employee_id") {
			return err
		}
	}

	return nil
}

// UpdateSlackMembers implements SlackImporter.
func (s *slackImporter) UpdateSlackMembers(ctx context.Context, members SlackMembers) error {
	for _, member := range members.Members {
		s.UpdateSlackMember(ctx, member)
	}

	return nil
}

// ImportSlackMember implements SlackImporter.
func (s *slackImporter) ImportSlackMember(ctx context.Context, member SlackMember) error {
	if err := member.Profile.Validate(); err != nil {
		return err
	}
	id := member.Id
	name := member.Name
	email := member.Profile.Email
	s.l.Info("Importing slack member", "email", email)

	employee, err := s.q.GetEmployeeByEmail(ctx, *email)
	if err != nil {
		return internal.ErrNotFound(*email)
	}

	if _, err := s.q.CreateSlackInfo(ctx, repository.CreateSlackInfoParams{
		EmployeeID: employee.ID,
		Name:       name,
		SlackID:    id,
		AvatarUrl:  helper.ParseString(*member.Profile.Image192),
	}); err != nil {
		if !helper.IsUniqueViolation(err, "employee_id") {
			return err
		}
	}

	return nil
}

// ImportSlackInfo implements SlackImporter.
func (s *slackImporter) ImportSlackMembers(ctx context.Context, members SlackMembers) error {
	for _, member := range members.Members {
		s.ImportSlackMember(ctx, member)
	}

	return nil
}

func NewSlackImporter(l *slog.Logger, q *repository.Queries) SlackImporter {
	return &slackImporter{l, q}
}

type slackService struct {
	logger   *slog.Logger
	slackUrl string
	token    string
}

func (s *slackService) UsersList() (*SlackMembers, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/users.list", s.slackUrl), nil)
	if err != nil {
		s.logger.Error("Error creating request", "error", err)
		return nil, err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", s.token))
	s.logger.Debug("Creating request", "method", req.Method, "url", req.URL, "headers", req.Header)

	s.logger.Debug("Executing GET request")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		s.logger.Error("HTTP request error", "error", err)
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		s.logger.Error("HTTP status code error", "status", res.Status)
		return nil, fmt.Errorf("received HTTP status code %s", res.Status)
	}

	response, err := helper.JSONDecode[SlackMembers](res.Body)
	if err != nil {
		s.logger.Error("Error unmarshalling response", "error", err)
		return nil, err
	}

	return response, nil
}

func NewSlackService(logger *slog.Logger, slackUrl, token string) *slackService {
	return &slackService{logger, slackUrl, token}
}

type SlackSeeder struct {
	slackService *slackService
	importer     SlackImporter
}

func (s *SlackSeeder) Seed(ctx context.Context) error {
	slackMemebers, err := s.slackService.UsersList()
	if err != nil {
		return err
	}

	if err := s.importer.ImportSlackMembers(ctx, *slackMemebers); err != nil {
		return err
	}

	if err := s.importer.UpdateSlackMembers(ctx, *slackMemebers); err != nil {
		return err
	}

	return nil
}

func NewSlackSeeder(slackService *slackService, importer SlackImporter) *SlackSeeder {
	return &SlackSeeder{slackService, importer}
}
