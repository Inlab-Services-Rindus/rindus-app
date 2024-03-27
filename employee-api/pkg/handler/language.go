package handler

import (
	"employee-api/pkg/repository"
	"employee-api/pkg/service"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/render"
)

type LanguageHandler interface {
	Routes(r chi.Router)
	List(w http.ResponseWriter, r *http.Request)
}

type languageHandler struct {
	service service.LanguageService
}

func (l *languageHandler) Routes(r chi.Router) {
	r.Route("/languages", func(r chi.Router) {
		r.Get("/", l.List)
	})
}

type LanguageResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func (l *LanguageResponse) Render(w http.ResponseWriter, r *http.Request) error {
	return nil
}

func NewLanguageResponse(id int, name string) *LanguageResponse {
	return &LanguageResponse{id, name}
}

// Render implements render.Renderer.
func (l *languageHandler) List(w http.ResponseWriter, r *http.Request) {
	languageRows, _ := l.service.List(r.Context())

	render.RenderList(w, r, NewLanguageListResponse(languageRows))
}

func NewLanguageListResponse(languages []repository.ListLanguagesRow) []render.Renderer {
	list := []render.Renderer{}
	for _, language := range languages {
		list = append(list, NewLanguageResponse(int(language.ID), language.Name))
	}
	return list
}

func NewLanguageHandler(s service.LanguageService) LanguageHandler {
	return &languageHandler{s}
}
