package task

import (
	"context"
	"fmt"

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
	query := `INSERT INTO tasks (title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING task_id, created_at, updated_at`
	err := r.db.QueryRow(ctx, query,
		task.Title,
		task.Description,
		task.Priority,
		task.Domain,
		task.ProjectId,
		task.UniModuleId,
		task.Deadline,
		task.IsBacklog,
		task.Completed,
	).Scan(&task.TaskId, &task.CreatedAt, &task.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to create task: %w", err)
	}

	return nil
}

func (r *TaskRepo) Update(ctx context.Context, task *Task) error {
	query := `UPDATE tasks SET title=$1, description=$2, priority=$3, domain=$4, project_id=$5, uni_module_id=$6, deadline=$7, is_backlog=$8, completed=$9, updated_at=NOW() WHERE task_id=$10 RETURNING updated_at`
	err := r.db.QueryRow(ctx, query,
		task.Title,
		task.Description,
		task.Priority,
		task.Domain,
		task.ProjectId,
		task.UniModuleId,
		task.Deadline,
		task.IsBacklog,
		task.Completed,
		task.TaskId,
	).Scan(&task.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	return nil
}

func (r *TaskRepo) GetById(ctx context.Context, taskid uuid.UUID) (*Task, error) {
	query := `SELECT task_id, title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed, created_at, updated_at FROM tasks WHERE task_id=$1`
	t := r.db.QueryRow(ctx, query, taskid)
	var task Task
	err := t.Scan(
		&task.TaskId,
		&task.Title,
		&task.Description,
		&task.Priority,
		&task.Domain,
		&task.ProjectId,
		&task.UniModuleId,
		&task.Deadline,
		&task.IsBacklog,
		&task.Completed,
		&task.CreatedAt,
		&task.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to get task by id: %w", err)
	}
	return &task, nil
}

func (r *TaskRepo) GetAll(ctx context.Context) ([]*Task, error) {
	query := `SELECT task_id, title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed, created_at, updated_at FROM tasks`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to query tasks: %w", err)
	}
	defer rows.Close()
	tasks := make([]*Task, 0)
	for rows.Next() {
		var task Task
		err := rows.Scan(
			&task.TaskId,
			&task.Title,
			&task.Description,
			&task.Priority,
			&task.Domain,
			&task.ProjectId,
			&task.UniModuleId,
			&task.Deadline,
			&task.IsBacklog,
			&task.Completed,
			&task.CreatedAt,
			&task.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan task: %w", err)
		}
		tasks = append(tasks, &task)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows iteration error: %w", err)
	}
	return tasks, nil
}

func (r *TaskRepo) Delete(ctx context.Context, taskid uuid.UUID) error {
	query := `DELETE FROM tasks WHERE task_id=$1`
	_, err := r.db.Exec(ctx, query, taskid)
	if err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	return nil
}

func (r *TaskRepo) ToggleStatus(ctx context.Context, taskid uuid.UUID) error {
	query := `UPDATE tasks SET completed = NOT completed, updated_at=NOW() WHERE task_id=$1`
	_, err := r.db.Exec(ctx, query, taskid)

	if err != nil {
		return fmt.Errorf("failed to toggle task status: %w", err)
	}

	return nil
}
