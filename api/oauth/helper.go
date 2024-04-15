package oauth

import (
	"api/helper"
	"bytes"
	"fmt"
	"net/http"
	"net/url"
)

func RequestClientCredentialsToken(domain string, credentials Credentials) (string, error) {
	fullURL := fmt.Sprintf("%s%s", domain, AuthEndpoint)

	q := url.Values{}
	q.Add("grant_type", GrantTypeClientCredentials)
	q.Add("client_id", credentials.ClientID)
	q.Add("client_secret", credentials.ClientSecret)

	resp, err := http.Post(fullURL, "application/x-www-form-urlencoded", bytes.NewBuffer([]byte(q.Encode())))

	if err != nil {
		return "", err
	}

	authResponse, err := helper.JSONDecode[AuthResponse](resp.Body)
	if err != nil {
		return "", err
	}

	return authResponse.AccessToken, nil
}
