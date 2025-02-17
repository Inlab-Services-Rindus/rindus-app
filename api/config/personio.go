package config

type Personio struct {
	ClientID     string
	ClientSecret string
	APIUrl       string
}

func parsePersonioConfig() Personio {
	apiUrl := getEnv("PERSONIO_API_URL")
	clientID := getEnv("PERSONIO_CLIENT_ID")
	clientSecret := getEnv("PERSONIO_CLIENT_SECRET")

	return Personio{
		APIUrl:       apiUrl,
		ClientID:     clientID,
		ClientSecret: clientSecret,
	}
}

