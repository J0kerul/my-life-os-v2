package task

import (
	"encoding/json"
	"net/http"
	"time"

	errorutils "github.com/J0kerul/my-life-os-v2/pkg/errors"
	"github.com/J0kerul/my-life-os-v2/pkg/utils"
	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type CreateTaskRequest struct {
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	Priority    Priority   `json:"priority"`
	Domain      Domain     `json:"domain"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	IsBacklog   bool       `json:"is_backlog"`
}

type UpdateTaskRequest struct {
	Title       *string    `json:"title,omitempty"`
	Description *string    `json:"description,omitempty"`
	Priority    *Priority  `json:"priority,omitempty"`
	Domain      *Domain    `json:"domain,omitempty"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	IsBacklog   *bool      `json:"is_backlog,omitempty"`
	Completed   *bool      `json:"completed,omitempty"`
}

type TaskResponse struct {
	TaskId      uuid.UUID  `json:"task_id"`
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	Priority    Priority   `json:"priority"`
	Domain      Domain     `json:"domain"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	IsBacklog   bool       `json:"is_backlog"`
	Completed   bool       `json:"completed"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
type TaskHandler struct {
	service TaskServiceInterface
}

func NewTaskHandler(service TaskServiceInterface) *TaskHandler {
	return &TaskHandler{
		service: service,
	}
}

// createTask handles POST /tasks
func (h *TaskHandler) createTask(w http.ResponseWriter, r *http.Request) {
	// 1. Parse Request Body
	var req CreateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithBadRequest(w, "Invalid request body")
		return
	}

	// 2. DTO → Entity
	task := &Task{
		Title:       req.Title,
		Description: req.Description,
		Priority:    req.Priority,
		Domain:      req.Domain,
		Deadline:    req.Deadline,
		IsBacklog:   req.IsBacklog,
		Completed:   false,
	}

	// 3. Call Service Layer
	err := h.service.CreateTask(r.Context(), task)
	if err != nil {
		if isBusinessError(err) {
			utils.RespondWithBadRequest(w, err.Error())
			return
		}
		utils.RespondWithInternalError(w, "Failed to create task")
		return
	}

	// 4. Entity → Response DTO
	response := taskToResponse(task)

	// 5. Send Response
	utils.RespondWithJSON(w, http.StatusCreated, response)
}

// updateTask handles PUT /tasks/:id
func (h *TaskHandler) updateTask(w http.ResponseWriter, r *http.Request) {
	// 1. Parse ID from URL
	taskIDStr := chi.URLParam(r, "id")
	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		utils.RespondWithBadRequest(w, "Invalid task ID")
		return
	}

	// 2. Parse Request Body
	var req UpdateTaskRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithBadRequest(w, "Invalid request body")
		return
	}

	// 3. Get Existing Task
	task, err := h.service.GetTaskById(r.Context(), taskID)
	if err != nil {
		utils.RespondWithRecordNotFound(w, "task")
		return
	}

	// 4. Update Fields
	if req.Title != nil {
		task.Title = *req.Title
	}
	if req.Description != nil {
		task.Description = req.Description
	}
	if req.Priority != nil {
		task.Priority = *req.Priority
	}
	if req.Domain != nil {
		task.Domain = *req.Domain
	}
	if req.Deadline != nil {
		task.Deadline = req.Deadline
	}
	if req.IsBacklog != nil {
		task.IsBacklog = *req.IsBacklog
	}
	if req.Completed != nil {
		task.Completed = *req.Completed
	}

	// 5. Call Service Layer to Update
	err = h.service.UpdateTask(r.Context(), task)
	if err != nil {
		if isBusinessError(err) {
			utils.RespondWithBadRequest(w, err.Error())
			return
		}
		utils.RespondWithInternalError(w, "Failed to update task")
		return
	}

	// 6. Entity → Response DTO
	response := taskToResponse(task)

	// 7. Send Response
	utils.RespondWithJSON(w, http.StatusOK, response)
}

// getTaskById handles GET /tasks/:id
func (h *TaskHandler) getTaskById(w http.ResponseWriter, r *http.Request) {
	// 1. Parse ID from URL
	taskIDStr := chi.URLParam(r, "id")
	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		utils.RespondWithBadRequest(w, "Invalid task ID")
		return
	}

	// 2. Call Service Layer to Get Task
	task, err := h.service.GetTaskById(r.Context(), taskID)
	if err != nil {
		utils.RespondWithRecordNotFound(w, "task")
		return
	}

	// 3. Entity → Response DTO
	response := taskToResponse(task)

	// 4. Send Response
	utils.RespondWithJSON(w, http.StatusOK, response)
}

// getAllTasks handles GET /tasks
func (h *TaskHandler) getAllTasks(w http.ResponseWriter, r *http.Request) {
	// 1. Call Service Layer to Get All Tasks
	tasks, err := h.service.GetAllTasks(r.Context())
	if err != nil {
		utils.RespondWithInternalError(w, "Failed to retrieve tasks")
		return
	}

	// 2. Entity → Response DTOs
	responses := make([]TaskResponse, len(tasks))
	for i, task := range tasks {
		responses[i] = taskToResponse(task)
	}

	// 3. Send Response
	utils.RespondWithJSON(w, http.StatusOK, responses)
}

// deleteTask handles DELETE /tasks/:id
func (h *TaskHandler) deleteTask(w http.ResponseWriter, r *http.Request) {
	// 1. Parse ID from URL
	taskIDStr := chi.URLParam(r, "id")
	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		utils.RespondWithBadRequest(w, "Invalid task ID")
		return
	}

	// 2. Call Service Layer to Delete Task
	err = h.service.DeleteTask(r.Context(), taskID)
	if err != nil {
		utils.RespondWithInternalError(w, "Failed to delete task")
		return
	}

	// 3. Send No Content Response
	utils.RespondWithNoContent(w)
}

// toggleTaskStatus handles PATCH /tasks/:id/toggle
func (h *TaskHandler) toggleTaskStatus(w http.ResponseWriter, r *http.Request) {
	// 1. Parse ID from URL
	taskIDStr := chi.URLParam(r, "id")
	taskID, err := uuid.Parse(taskIDStr)
	if err != nil {
		utils.RespondWithBadRequest(w, "Invalid task ID")
		return
	}

	// 2. Call Service Layer to Toggle Status
	err = h.service.ToggleStatus(r.Context(), taskID)
	if err != nil {
		utils.RespondWithInternalError(w, "Failed to toggle task status")
		return
	}

	// 3. Get Updated Task
	task, err := h.service.GetTaskById(r.Context(), taskID)
	if err != nil {
		utils.RespondWithInternalError(w, "Failed to fetch updated task")
		return
	}

	// 4. Entity → Response DTO
	response := taskToResponse(task)

	// 5. Send Response
	utils.RespondWithJSON(w, http.StatusOK, response)
}

// isBusinessError checks if error is a validation/business logic error
func isBusinessError(err error) bool {
	switch err {
	case errorutils.ErrMissingId,
		errorutils.ErrTitleRequired,
		errorutils.ErrInvalidPriority,
		errorutils.ErrInvalidDomain,
		errorutils.ErrNoDeadlineForNonBacklog,
		errorutils.ErrBacklogDeadlineConflict:
		return true
	default:
		return false
	}
}

// taskToResponse converts Task entity to response DTO
func taskToResponse(task *Task) TaskResponse {
	return TaskResponse{
		TaskId:      task.TaskId,
		Title:       task.Title,
		Description: task.Description,
		Priority:    task.Priority,
		Domain:      task.Domain,
		Deadline:    task.Deadline,
		IsBacklog:   task.IsBacklog,
		Completed:   task.Completed,
		CreatedAt:   task.CreatedAt,
		UpdatedAt:   task.UpdatedAt,
	}
}

// RegisterRoutes registers all task-related routes
func RegisterRoutes(r chi.Router, handler *TaskHandler) {
	r.Route("/tasks", func(r chi.Router) {
		// Create
		r.Post("/", handler.createTask) // POST /tasks

		// Read
		r.Get("/", handler.getAllTasks)     // GET /tasks
		r.Get("/{id}", handler.getTaskById) // GET /tasks/:id

		// Update
		r.Put("/{id}", handler.updateTask) // PUT /tasks/:id

		// Delete
		r.Delete("/{id}", handler.deleteTask) // DELETE /tasks/:id

		// Special operations
		r.Patch("/{id}/toggle", handler.toggleTaskStatus) // PATCH /tasks/:id/toggle
	})
}
