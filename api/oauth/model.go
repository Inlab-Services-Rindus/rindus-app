package oauth

const (
	AuthEndpoint               = "/auth"
	GrantTypeClientCredentials = "client_credentials"
)

type AuthRequestBody struct {
	GrantType    string `json:"grant_type"`
	ClientID     string `json:"client_id"`
	ClientSecret string `json:"client_secret"`
}

type AuthResponse struct {
	AccessToken string `json:"access_token"`
}
