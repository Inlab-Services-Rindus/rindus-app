package personioapi

import (
	"api/helper"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
)

type personioService struct {
	logger       *slog.Logger
	personioUrl  string
	clientID     string
	clientSecret string
	authToken    *string
}

func NewPersonioService(logger *slog.Logger, personioUrl, clientID, clientSecret string) *personioService {
	return &personioService{
		logger:       logger,
		personioUrl:  personioUrl,
		clientID:     clientID,
		clientSecret: clientSecret,
	}
}

func (p *personioService) authenticate() error {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", p.clientID)
	data.Set("client_secret", p.clientSecret)

	url := p.buildPersonioAPIEndpoint("/auth")
	p.logger.Debug("Creating POST request", "url", url)
	req, err := http.NewRequest("POST", url, strings.NewReader(data.Encode()))
	if err != nil {
		p.logger.Error("Error creating request", "error", err)
		return err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	p.logger.Debug("Executing POST request")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		p.logger.Error("HTTP request error", "error", err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		p.logger.Error("HTTP status code error", "status", res.Status)
		return fmt.Errorf("received HTTP status code %s", res.Status)
	}

	response, err := helper.JSONDecode[PersonioTokenResponse](res.Body)
	if err != nil {
		p.logger.Error("Error unmarshalling response", "error", err)
		return err
	}

	token := helper.TrimSpace(response.Data.AccessToken)
	if len(token) > 0 {
		p.authToken = &token
		p.logger.Info("Authentication token received and stored", "authToken", *p.authToken)
		return nil
	}

	p.logger.Error("Failed to obtain authentication token")
	return fmt.Errorf("access token not found in response")
}

func (p *personioService) CompanyEmployees() ([]Employee, error) {
	if p.authToken == nil {
		if err := p.authenticate(); err != nil {
			return nil, err
		}
	}

	var offset = 0
	var currentPage = 0
	var totalPages int
	var employees []Employee
	for ok := true; ok; ok = (currentPage < totalPages) {
		req, err := p.newCompanyEmployeesRequest(offset)
		if err != nil {
			return nil, err
		}

		res, err := http.DefaultClient.Do(req)
		if err != nil {
			p.logger.Error("HTTP request error", "error", err)
			return nil, err
		}
		defer res.Body.Close()

		if res.StatusCode != http.StatusOK {
			p.logger.Error("HTTP status code error", "status", res.Status)
			return nil, fmt.Errorf("received HTTP status code %s", res.Status)
		}

		response, err := helper.JSONDecode[CompanyEmployeesResponse](res.Body)
		if err != nil {
			p.logger.Error("Error unmarshalling response", "error", err)
			return nil, err
		}

		offset += 200
		currentPage = response.Metadata.CurrentPage + 1
		totalPages = response.Metadata.TotalPages
		employees = append(employees, response.Data...)
	}

	return employees, nil
}

func (p *personioService) newCompanyEmployeesRequest(offset int) (*http.Request, error) {
	req, err := http.NewRequest("GET", p.buildPersonioAPIEndpoint("/company/employees"), nil)
	if err != nil {
		p.logger.Error("Error creating request", "error", err)
		return nil, err
	}

	q := req.URL.Query()
	q.Add("limit", "200")
	q.Add("offset", fmt.Sprint(offset))
	req.URL.RawQuery = q.Encode()
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", *p.authToken))

	p.logger.Debug("Creating request", "method", req.Method, "url", req.URL, "query", req.URL.Query(), "headers", req.Header)
	return req, nil
}

func (p *personioService) buildPersonioAPIEndpoint(path string) string {
	return fmt.Sprintf("%s%s", p.personioUrl, path)
}
