package task

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TaskRepo struct {
	db *pgxpool.Pool
}

func NewTaskRepo(db *pgxpool.Pool) *TaskRepo {
	return &TaskRepo{db: db}
}

func (r *TaskRepo) Create(ctx context.Context, task *Task) error {
	panic("implement me")
}

func (r *TaskRepo) Update(ctx context.Context, task *Task) error {
	panic("implement me")
}

func (r *TaskRepo) GetById(ctx context.Context, taskid uuid.UUID) (*Task, error) {
	panic("implement me")
}

func (r *TaskRepo) GetAll(ctx context.Context) ([]*Task, error) {
	panic("implement me")
}

func (r *TaskRepo) GetByFilter(ctx context.Context, filter TaskFilter) ([]*Task, error) {
	panic("implement me")
}

func (r *TaskRepo) Search(ctx context.Context, query string) ([]*Task, error) {
	panic("implement me")
}

func (r *TaskRepo) Delete(ctx context.Context, taskid uuid.UUID) error {
	panic("implement me")
}

func (r *TaskRepo) BulkDelete(ctx context.Context, taskids []uuid.UUID) error {
	panic("implement me")
}

func (r *TaskRepo) ToggleStatus(ctx context.Context, taskid uuid.UUID) error {
	panic("implement me")
}
