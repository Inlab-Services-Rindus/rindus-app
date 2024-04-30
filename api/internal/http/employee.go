package http

import (
	"api/internal"
	"api/internal/model"
	"api/internal/service"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type employeeHandler struct {
	service service.EmployeeService
}

func (h *employeeHandler) Routes(r chi.Router) {
	r.Route("/employees", func(r chi.Router) {
		r.Route("/import", func(r chi.Router) {
			r.Post("/personio", h.importPersonio)
		})
		r.Route("/{employeeUID}", func(r chi.Router) {
			r.Get("/", h.get)
		})
	})
}

func (h *employeeHandler) get(w http.ResponseWriter, r *http.Request) {
	uid := chi.URLParam(r, "employeeUID")

	employee, err := h.service.FindByUID(r.Context(), uid)

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, employee)
}

func (h *employeeHandler) importPersonio(w http.ResponseWriter, r *http.Request) {
	var importReq model.PersonioEmployee
	if err := json.NewDecoder(r.Body).Decode(&importReq); err != nil {
		Error(w, r, internal.Errorf(internal.CodeErrNotValid, "Could not decode incoming request \"err\"=%s", err))
		return
	}

	err := importReq.Validate()

	if err != nil {
		Error(w, r, err)
		return
	}

	employee, err := h.service.PersonioImport(r.Context(), importReq)

	if err != nil {
		Error(w, r, err)
		return
	}

	JSONResponse(w, r, employee)
}

func NewEmployeeHandler(s service.EmployeeService) Handler {
	return &employeeHandler{s}
}
