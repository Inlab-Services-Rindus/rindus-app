package service

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
)

type PersonioService struct {
	personioUrl  string
	clientID     string
	clientSecret string
	authToken    string
}

func NewPersonioService(personioUrl,clientID, clientSecret string) *PersonioService {
	return &PersonioService{
		personioUrl: personioUrl,
		clientID:     clientID,
		clientSecret: clientSecret,
	}
}

func (p *PersonioService) authenticate() error {
	data := url.Values{}
	data.Set("grant_type", "client_credentials")
	data.Set("client_id", p.clientID)
	data.Set("client_secret", p.clientSecret)

	payload := strings.NewReader(data.Encode())

	req, err := http.NewRequest("POST", p.personioUrl, payload)
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

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		slog.Error("Error reading response body", "error", err)
		return err
	}

	var response map[string]interface{}
	if err := json.Unmarshal(bodyBytes, &response); err != nil {
		slog.Error("Error unmarshalling response", "error", err)
		return err
	}

	if token, ok := response["access_token"].(string); ok {
		p.authToken = token
		slog.Info("Authentication token received and stored", "authToken", p.authToken)
		return nil
	} else {
		slog.Error("Failed to obtain authentication token")
		return fmt.Errorf("access token not found in response")
	}
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