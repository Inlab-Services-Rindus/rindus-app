package http

import (
	"employee-api/pkg"
	"employee-api/pkg/repository"
	"employee-api/pkg/service"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/go-chi/chi/v5"
)

type partnerHandler struct {
	service service.PartnerService
}

func (h *partnerHandler) Routes(r chi.Router) {
	r.Route("/partners", func(r chi.Router) {
		r.Get("/", h.list)
		r.Post("/", h.create)

		r.Route("/{partnerID}", func(r chi.Router) {
			r.Get("/", h.get)
		})
	})
}

type CreatePartnerReq struct {
	Name        string `json:"name"`
	LogoUrl     string `json:"logo_url"`
	Description string `json:"description"`
}

type PartnerResponse struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	LogoUrl     string `json:"logo_url"`
	Description string `json:"description,omitempty"`
}

type PartnerListResponse = []PartnerResponse

func (h *partnerHandler) list(w http.ResponseWriter, r *http.Request) {
	partnerRows, _ := h.service.List(r.Context())

	JSONResponse(w, r, NewPartnerListResponse(partnerRows))
}

func (h *partnerHandler) create(w http.ResponseWriter, r *http.Request) {
	var newPartnerReq CreatePartnerReq
	if err := json.NewDecoder(r.Body).Decode(&newPartnerReq); err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Could not decode incoming request \"err\"=%s", err))
		return
	}

	params, err := newPartnerReq.validate()

	if err != nil {
		Error(w, r, err)
		return
	}

	partner, err := h.service.Create(r.Context(), *params)

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewPartnerResponse(*partner))
}

func (params *CreatePartnerReq) validate() (*repository.CreatePartnerParams, error) {
	params.Name = strings.TrimSpace(params.Name)

	if len(params.Name) == 0 {
		return nil, pkg.Errorf(pkg.ErrNotValid, "Attribute \"name\" cannot be empty")
	}

	return &repository.CreatePartnerParams{Name: params.Name, LogoUrl: params.LogoUrl, Description: params.Description}, nil
}

func (h *partnerHandler) get(w http.ResponseWriter, r *http.Request) {
	param := chi.URLParam(r, "partnerID")

	id, err := parseID(param)

	if err != nil {
		Error(w, r, pkg.Errorf(pkg.ErrNotValid, "Provided ID %q not valid", param))
		return
	}

	partner, err := h.service.Get(r.Context(), int(id))

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, NewPartnerResponse(*partner))
}

func NewPartnerResponse(partner repository.Partner) PartnerResponse {
	return PartnerResponse{int(partner.ID), partner.Name, partner.LogoUrl, partner.Description}
}

func NewPartnerListResponse(partners []repository.Partner) PartnerListResponse {
	list := PartnerListResponse{}
	for _, partner := range partners {
		list = append(list, NewPartnerResponse(partner))
	}
	return list
}

func NewPartnerHandler(s service.PartnerService) Handler {
	return &partnerHandler{s}
}
