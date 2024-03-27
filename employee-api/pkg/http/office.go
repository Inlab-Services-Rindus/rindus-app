package http

import (
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"employee-api/pkg/service"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type officeHandler struct {
	service service.OfficeService
}

func (h *officeHandler) Routes(r chi.Router) {
	r.Route("/offices", func(r chi.Router) {
		r.Get("/", h.list)
		r.Post("/", h.create)

		r.Route("/{officeID}", func(r chi.Router) {
			r.Get("/", h.get)
		})
	})
}

type CreateOfficeReq struct {
	Name string `json:"name"`
}

type OfficeResponse struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type OfficeListResponse = []OfficeResponse

func (h *officeHandler) list(w http.ResponseWriter, r *http.Request) {
	officeRows, _ := h.service.List(r.Context())

	JSONResponse(w, r, NewOfficeListResponse(officeRows))
}

func (h *officeHandler) create(w http.ResponseWriter, r *http.Request) {
	var newOfficeReq CreateOfficeReq
	if err := json.NewDecoder(r.Body).Decode(&newOfficeReq); err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Could not decode incoming request \"err\"=%s", err))
		return
	}

	if len(newOfficeReq.Name) == 0 {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Valid attribute \"name\" has to be provided"))
		return
	}

	office, err := h.service.Create(r.Context(), newOfficeReq.Name)

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewOfficeResponse(*office))
}

func (h *officeHandler) get(w http.ResponseWriter, r *http.Request) {
	param := chi.URLParam(r, "officeID")

	id, err := parseID(param)

	if err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Provided ID %q not valid", param))
		return
	}

	office, err := h.service.Get(r.Context(), int(id))

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewOfficeResponse(*office))
}

func NewOfficeResponse(office repository.Office) OfficeResponse {
	return OfficeResponse{int(office.ID), office.Name}
}

func NewOfficeListResponse(offices []repository.Office) OfficeListResponse {
	list := OfficeListResponse{}
	for _, office := range offices {
		list = append(list, NewOfficeResponse(office))
	}
	return list
}

func NewOfficeHandler(s service.OfficeService) Handler {
	return &officeHandler{s}
}
