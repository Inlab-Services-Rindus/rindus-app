package service

import (
	"api/helper"
	"encoding/json"
	"fmt"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
)

type PersonioTokenResponse struct {
	AccessToken string `json:"access_token,omitempty"`
}

type PersonioService struct {
	personioUrl  string
	clientID     string
	clientSecret string
	authToken    string
}

func NewPersonioService(personioUrl, clientID, clientSecret string) *PersonioService {
	return &PersonioService{
		personioUrl:  personioUrl,
		clientID:     clientID,
		clientSecret: clientSecret,
	}
}


func (p *PersonioService) authenticate() error {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", p.clientID)
	data.Set("client_secret", p.clientSecret)

	req, err := http.NewRequest("POST", p.personioUrl, strings.NewReader(data.Encode()))
	if err != nil {
		slog.Error("Error creating request", "error", err)
		return err
	}

	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		slog.Error("HTTP request error", "error", err)
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		slog.Error("HTTP status code error", "status", res.Status)
		return fmt.Errorf("received HTTP status code %s", res.Status)
	}

	var response PersonioTokenResponse
	if err := json.NewDecoder(res.Body).Decode(&response); err != nil {
		slog.Error("Error unmarshalling response", "error", err)
		return err
	}


	token := helper.TrimSpace(response.AccessToken)
	if len(token) > 0 {
		p.authToken = token
		slog.Info("Authentication token received and stored", "authToken", p.authToken)
		return nil
	}

	slog.Error("Failed to obtain authentication token")
	return fmt.Errorf("access token not found in response")
}

func (p *PersonioService) AuthPersonioHandler(w http.ResponseWriter, r *http.Request) {
	if err := p.authenticate(); err != nil {
		http.Error(w, "Failed to authenticate with Personio", http.StatusInternalServerError)
		return
	}
	slog.Info("Authentication successful")

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Authentication successful"))
}
