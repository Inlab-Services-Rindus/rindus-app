package http

import (
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"employee-api/pkg/service"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type languageHandler struct {
	service service.LanguageService
}

func (h *languageHandler) Routes(r chi.Router) {
	r.Route("/languages", func(r chi.Router) {
		r.Get("/", h.list)
		r.Post("/", h.create)

		r.Route("/{languageID}", func(r chi.Router) {
			r.Get("/", h.get)
		})
	})
}

type CreateLanguageReq struct {
	Name string `json:"name"`
}

type LanguageResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type LanguageListResponse = []LanguageResponse

func (h *languageHandler) list(w http.ResponseWriter, r *http.Request) {
	languageRows, _ := h.service.List(r.Context())

	JSONResponse(w, r, NewLanguageListResponse(languageRows))
}

func (h *languageHandler) create(w http.ResponseWriter, r *http.Request) {
	var newLanguageReq CreateLanguageReq
	if err := json.NewDecoder(r.Body).Decode(&newLanguageReq); err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Could not decode incoming request \"err\"=%s", err))
		return
	}

	if len(newLanguageReq.Name) == 0 {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Valid attribute \"name\" has to be provided"))
		return
	}

	language, err := h.service.Create(r.Context(), newLanguageReq.Name)

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewLanguageResponse(*language))
}

func (h *languageHandler) get(w http.ResponseWriter, r *http.Request) {
	param := chi.URLParam(r, "languageID")

	id, err := parseID(param)

	if err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Provided ID %q not valid", param))
		return
	}

	lang, err := h.service.Get(r.Context(), int(id))

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewLanguageResponse(*lang))
}

func NewLanguageResponse(language repository.Language) LanguageResponse {
	return LanguageResponse{int(language.ID), language.Name}
}

func NewLanguageListResponse(languages []repository.Language) LanguageListResponse {
	list := LanguageListResponse{}
	for _, lang := range languages {
		list = append(list, NewLanguageResponse(lang))
	}
	return list
}

func NewLanguageHandler(s service.LanguageService) Handler {
	return &languageHandler{s}
}
