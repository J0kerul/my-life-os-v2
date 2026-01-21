package task

import (
	"context"

	"github.com/google/uuid"
)

type TaskRepositoryInterface interface {
	Create(ctx context.Context, task *Task) error
	Update(ctx context.Context, task *Task) error
	GetById(ctx context.Context, taskid uuid.UUID) (*Task, error)
	GetAll(ctx context.Context) ([]*Task, error)
	GetByFilter(ctx context.Context, filter TaskFilter) ([]*Task, error)
	Search(ctx context.Context, query string) ([]*Task, error)
	Delete(ctx context.Context, taskid uuid.UUID) error
	BulkDelete(ctx context.Context, taskids []uuid.UUID) error
	ToggleStatus(ctx context.Context, taskid uuid.UUID) error
}

type TaskServiceInterface interface {
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
