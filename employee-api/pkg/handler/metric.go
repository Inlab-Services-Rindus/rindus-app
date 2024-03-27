package handler

import (
	"github.com/go-chi/chi/v5"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type MetricHandler interface {
	Routes(r chi.Router)
}

type metricHandler struct{}

func (m metricHandler) Routes(r chi.Router) {
	r.Handle("/metrics", promhttp.Handler())
}

func NewMetricHandler() MetricHandler {
	return &metricHandler{}
}
