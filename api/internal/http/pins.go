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
		r.Route("/categories", func(r chi.Router) {
			r.Get("/", h.GetPinCategories)
			r.Get("/{id}", h.GetPinCategory)
			r.Post("/", h.CreatePinCategory)
			r.Put("/{id}", h.UpdatePinCategory)
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

func (h *PinsHandler) GetPinCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	pinCategory, err := h.service.GetPinCategory(r.Context(), int32(id))
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Pin category not found"})
			return
		}
		
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pinCategory)
}

func (h *PinsHandler) UpdatePinCategory(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	
	id, err := strconv.Atoi(idStr)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid ID format"})
		return
	}

	var req model.UpdatePinCategoryRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Invalid request format"})
		return
	}

	pinCategory, err := h.service.UpdatePinCategory(r.Context(), int32(id), req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		if strings.Contains(err.Error(), "name cannot be empty") {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Name field is required"})
			return
		}
		if errors.Is(err, pgx.ErrNoRows) {
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Pin category not found"})
			return
		}
		
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.PinErrorResponse{Error: "Internal server error"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(pinCategory)
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
