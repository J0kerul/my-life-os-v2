package task

import (
	"context"

	"github.com/google/uuid"
)

type TaskFilter struct {
	Priority  *Priority
	Domain    *Domain
	IsBacklog *bool
	Completed *bool
}

type TaskRepository interface {
	CreateTask(ctx context.Context, task *Task) error
	UpdateTask(ctx context.Context, task *Task) error
	GetTaskById(ctx context.Context, taskid uuid.UUID) (*Task, error)
	GetAllTasks(ctx context.Context) ([]*Task, error)
	GetTaskByFilter(ctx context.Context, filter TaskFilter) ([]*Task, error)
	SearchTasks(ctx context.Context, query string) ([]*Task, error)
	DeleteTask(ctx context.Context, taskid uuid.UUID) error
	BulkDeleteTasks(ctx context.Context, taskids []uuid.UUID) error
	ToggleStatus(ctx context.Context, taskid uuid.UUID) error
}

type TaskService interface {
	CreateTask(ctx context.Context, task *Task) error
	UpdateTask(ctx context.Context, task *Task) error
	GetTaskById(ctx context.Context, taskid uuid.UUID) (*Task, error)
	GetAllTasks(ctx context.Context) ([]*Task, error)
	GetTaskByFilter(ctx context.Context, filter TaskFilter) ([]*Task, error)
	SearchTasks(ctx context.Context, query string) ([]*Task, error)
	DeleteTask(ctx context.Context, taskid uuid.UUID) error
	BulkDeleteTasks(ctx context.Context, taskids []uuid.UUID) error
	ToggleStatus(ctx context.Context, taskid uuid.UUID) error
}
