package http

import (
	"api/internal/model"
	"api/internal/service"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5"
)

type PinsHandler struct {
	service   service.PinsService
}

func NewPinsHandler(service service.PinsService) *PinsHandler {
	return &PinsHandler{
		service:   service,
	}
}

func (h *PinsHandler) Routes(r chi.Router) {
	r.Route("/pins", func(r chi.Router) {
		r.Get("/", h.GetPins)
		r.Get("/{id}", h.GetPin)
		r.Post("/", h.CreatePin)
		r.Put("/{id}", h.UpdatePin)
		r.Delete("/{id}", h.DeletePin)

		r.Route("/categories", func(r chi.Router) {
			r.Get("/", h.GetPinCategories)
			r.Post("/", h.CreatePinCategory)
			r.Delete("/{id}", h.SoftDeletePinCategory)
		})
	})
}



func (h *PinsHandler) CreatePinCategory(w http.ResponseWriter, r *http.Request) {
	var req model.CreatePinCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid request format"})
		return
	}

	category, err := h.service.CreatePinCategory(r.Context(), req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		if strings.Contains(err.Error(), "name cannot be empty") {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Name field is required"})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		}
		return
	}

	response := model.CreatePinCategoryResponse{
		Category: *category,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

func (h *PinsHandler) GetPinCategories(w http.ResponseWriter, r *http.Request) {
	categories, err := h.service.GetPinCategories(r.Context())
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(categories)
}

func (h *PinsHandler) SoftDeletePinCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	
	id, err := strconv.Atoi(idStr)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	err = h.service.SoftDeletePinCategory(r.Context(), int32(id))
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *PinsHandler) GetPins(w http.ResponseWriter, r *http.Request) {
	pins, err := h.service.GetPins(r.Context())
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pins)
}

func (h *PinsHandler) GetPin(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	pin, err := h.service.GetPinByID(r.Context(), int32(id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusNotFound)
            json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Pin not found"})
            return
        }
		
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pin)
}


func (h *PinsHandler) CreatePin(w http.ResponseWriter, r *http.Request) {
	var req model.CreatePinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid request format"})
		return
	}

	pin, err := h.service.CreatePin(r.Context(), req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: err.Error()})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(pin)
}

func (h *PinsHandler) UpdatePin(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	var req model.UpdatePinRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid request format"})
		return
	}

	pin, err := h.service.UpdatePin(r.Context(), int32(id), req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		if strings.Contains(err.Error(), "required") || strings.Contains(err.Error(), "invalid") {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: err.Error()})
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pin)
}

func (h *PinsHandler) DeletePin(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	err = h.service.SoftDeletePin(r.Context(), int32(id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Pin not found"})
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.WriteHeader(http.StatusOK)
}