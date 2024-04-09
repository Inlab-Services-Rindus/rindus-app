package oauth

import (
	"errors"
	"net/http"
	"time"

	"github.com/go-chi/oauth"
)

type AuthServer struct {
	ClientCredentialsHandler func(w http.ResponseWriter, r *http.Request)
}

type AuthServerOpts struct {
	SecretKey   string
	TTL         time.Duration
	Credentials Credentials
}

type Credentials struct {
	ClientID     string
	ClientSecret string
}

func NewAuthServer(opts AuthServerOpts) *AuthServer {
	o := oauth.NewBearerServer(
		opts.SecretKey,
		opts.TTL,
		&oAuthCredentialVerifier{opts.Credentials},
		nil)

	return &AuthServer{o.ClientCredentials}
}

// Implements method require but the full chi aouth server. Bases on provided verifier
type oAuthCredentialVerifier struct {
	c Credentials
}

// ValidateClient relies on provided verifier (only flow we want to use)
func (o *oAuthCredentialVerifier) ValidateClient(clientID, clientSecret, scope string, r *http.Request) error {
	if clientID == o.c.ClientID && clientSecret == o.c.ClientSecret {
		return nil
	}

	return errors.New("wrong client")
}

// Implement the rest of the interface
func (*oAuthCredentialVerifier) ValidateUser(username, password, scope string, r *http.Request) error {
	return errors.New("wrong user")
}

func (*oAuthCredentialVerifier) ValidateCode(clientID, clientSecret, code, redirectURI string, r *http.Request) (string, error) {
	return "", nil
}

func (*oAuthCredentialVerifier) AddClaims(tokenType oauth.TokenType, credential, tokenID, scope string, r *http.Request) (map[string]string, error) {
	return nil, nil
}

func (*oAuthCredentialVerifier) AddProperties(tokenType oauth.TokenType, credential, tokenID, scope string, r *http.Request) (map[string]string, error) {
	return nil, nil
}

// Optional methods for refresh tokens (not in use)
func (*oAuthCredentialVerifier) ValidateTokenID(tokenType oauth.TokenType, credential, tokenID, refreshTokenID string) error {
	return nil
}

func (*oAuthCredentialVerifier) StoreTokenID(tokenType oauth.TokenType, credential, tokenID, refreshTokenID string) error {
	return nil
}
