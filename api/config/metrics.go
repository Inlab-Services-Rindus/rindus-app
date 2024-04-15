package config

type Metrics struct {
	BasicAuth BasicAuth
}

type BasicAuth struct {
	User string
	Pass string
}

func parseMetrics() Metrics {
	return Metrics{
		BasicAuth: BasicAuth{
			User: getEnv("METRICS_AUTH_USER"),
			Pass: getEnv("METRICS_AUTH_PASS"),
		},
	}
}
