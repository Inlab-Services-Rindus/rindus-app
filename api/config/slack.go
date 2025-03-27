package config

type Slack struct {
	APIUrl    string
	AuthToken string
}

func parseSlack() Slack {
	apiUrl := getEnv("SLACK_API_URL")
	authToken := getEnv("SLACK_AUTH_TOKEN")

	return Slack{
		APIUrl:    apiUrl,
		AuthToken: authToken,
	}
}
