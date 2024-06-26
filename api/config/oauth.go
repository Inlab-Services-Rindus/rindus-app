package config

import (
	"api/helper"
	"strconv"
	"time"
)

const (
	defaultTokenTTL = time.Second * 120
)

type OAuth struct {
	SecretKey         string
	TokenTTL          time.Duration
	ClientCredentials ClientCredentials
}

type ClientCredentials struct {
	ClientID     string
	ClientSecret string
}

func parseOAuth() OAuth {
	secretKey := getEnv("OAUTH_SECRET_KEY")

	return OAuth{
		SecretKey:         secretKey,
		TokenTTL:          parseTokenTTL(),
		ClientCredentials: parseClientCredentials(),
	}
}

func parseClientCredentials() ClientCredentials {
	clientID := getEnv("OAUTH_CLIENT_ID")
	clientSecret := getEnv("OAUTH_CLIENT_SECRET")

	return ClientCredentials{
		ClientID:     clientID,
		ClientSecret: clientSecret,
	}
}

func parseTokenTTL() time.Duration {
	tokenTTL := getEnv("OAUTH_TOKEN_TTL")

	if helper.IsEmpty(tokenTTL) {
		return defaultTokenTTL
	}

	seconds, err := strconv.Atoi(tokenTTL)

	if err != nil {
		return defaultTokenTTL
	}

	return time.Second * time.Duration(seconds)
}
