package task

import (
	"time"

	"github.com/google/uuid"
)

type CreateTaskRequest struct {
	Title       string     `json:"title"`
	Description *string    `json:"description,omitempty"`
	Priority    Priority   `json:"priority"`
	Domain      Domain     `json:"domain"`
	Deadline    *time.Time `json:"deadline,omitempty"`
	IsBacklog   bool       `json:"is_backlog"`
	Completed   bool       `json:"completed"`
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
	TaskSvc TaskService
}

func NewTaskHandler(TaskService TaskService) *TaskHandler {
	return &TaskHandler{
		TaskSvc: TaskService,
	}
}

func (h *TaskHandler) createTask() error {
	panic("Implement me")
}

func (h *TaskHandler) updateTask() error {
	panic("Implement me")
}

func (h *TaskHandler) getTaskById() error {
	panic("Implement me")
}

func (h *TaskHandler) getAllTasks() error {
	panic("Implement me")
}

func (h *TaskHandler) deleteTask() error {
	panic("Implement me")
}

func (h *TaskHandler) toggleTaskStatus() error {
	panic("Implement me")
}
