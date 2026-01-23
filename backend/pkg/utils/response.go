package utils

import (
	"encoding/json"
	"net/http"
)

type ErrorResponse struct {
	Error string `json:"error"`
}

// RespondWithError sends a JSON error response with the given status code and message.
func RespondWithError(w http.ResponseWriter, code int, message string) {
	RespondWithJSON(w, code, ErrorResponse{Error: message})
}

// RespondWithNoContent sends a 204 No Content response.
func RespondWithNoContent(w http.ResponseWriter) {
	w.WriteHeader(http.StatusNoContent)
}

// RespondWithJSON sends a JSON response with the given status code and payload.
func RespondWithJSON(w http.ResponseWriter, code int, payload any) {
	response, err := json.Marshal(payload)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(`{"error":"Failed to encode JSON response"}`))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

// RespondWithBadRequest sends a 400 Bad Request response with the given error message.
func RespondWithBadRequest(w http.ResponseWriter, message string) {
	RespondWithError(w, http.StatusBadRequest, message)
}

// RespondWithNotFound sends a 404 Not Found response with the given error message.
func RespondWithNotFound(w http.ResponseWriter, message string) {
	RespondWithError(w, http.StatusNotFound, message)
}

// RespondWithInternalError sends a 500 Internal Server Error response with the given error message.
func RespondWithInternalError(w http.ResponseWriter, message string) {
	RespondWithError(w, http.StatusInternalServerError, message)
}

// RespondWithUnauthorized sends a 401 Unauthorized response with the given error message.
func RespondWithUnauthorized(w http.ResponseWriter, message string) {
	RespondWithError(w, http.StatusUnauthorized, message)
}

// RespondWithRecordNotFound sends a 404 Not Found response for a missing record.
func RespondWithRecordNotFound(w http.ResponseWriter, record string) {
	RespondWithError(w, http.StatusNotFound, record+" not found")
}
