package task

import (
	"context"
	"fmt"
	"strings"

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
	return err
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
	return err
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
		return nil, err
	}
	return &task, nil
}

func (r *TaskRepo) GetAll(ctx context.Context) ([]*Task, error) {
	query := `SELECT task_id, title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed, created_at, updated_at FROM tasks`
	rows, err := r.db.Query(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tasks []*Task
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
			return nil, err
		}
		tasks = append(tasks, &task)
	}
	return tasks, nil
}

func (r *TaskRepo) GetByFilter(ctx context.Context, filter TaskFilter) ([]*Task, error) {
	query := `SELECT task_id, title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed, created_at, updated_at FROM tasks WHERE 1=1`

	args := []interface{}{}
	argPos := 1

	if filter.Priority != nil {
		query += fmt.Sprintf(" AND priority=$%d", argPos)
		args = append(args, *filter.Priority)
		argPos++
	}

	if filter.Domain != nil {
		query += fmt.Sprintf(" AND domain=$%d", argPos)
		args = append(args, *filter.Domain)
		argPos++
	}

	if filter.IsBacklog != nil {
		query += fmt.Sprintf(" AND is_backlog=$%d", argPos)
		args = append(args, *filter.IsBacklog)
		argPos++
	}

	if filter.Completed != nil {
		query += fmt.Sprintf(" AND completed=$%d", argPos)
		args = append(args, *filter.Completed)
		argPos++
	}

	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []*Task
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
			return nil, err
		}
		tasks = append(tasks, &task)
	}

	return tasks, nil
}

func (r *TaskRepo) Search(ctx context.Context, query string) ([]*Task, error) {
	db_query := `SELECT task_id, title, description, priority, domain, project_id, uni_module_id, deadline, is_backlog, completed, created_at, updated_at FROM tasks WHERE title ILIKE $1`
	search_param := "%" + query + "%"
	rows, err := r.db.Query(ctx, db_query, search_param)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tasks []*Task
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
			return nil, err
		}
		tasks = append(tasks, &task)
	}
	return tasks, nil
}

func (r *TaskRepo) Delete(ctx context.Context, taskid uuid.UUID) error {
	query := `DELETE FROM tasks WHERE task_id=$1`
	_, err := r.db.Exec(ctx, query, taskid)
	return err
}

func (r *TaskRepo) BulkDelete(ctx context.Context, taskids []uuid.UUID) error {
	if len(taskids) == 0 {
		return nil // Nichts zu löschen
	}

	// Baue Platzhalter: $1, $2, $3, ...
	placeholders := make([]string, len(taskids))
	for i := range taskids {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
	}

	// Query zusammenbauen
	query := fmt.Sprintf(
		"DELETE FROM tasks WHERE task_id IN (%s)",
		strings.Join(placeholders, ", "),
	)

	// []uuid.UUID → []interface{} konvertieren
	args := make([]interface{}, len(taskids))
	for i, id := range taskids {
		args[i] = id
	}

	// Ausführen
	_, err := r.db.Exec(ctx, query, args...)
	return err
}

func (r *TaskRepo) ToggleStatus(ctx context.Context, taskid uuid.UUID) error {
	query := `UPDATE tasks SET completed = NOT completed, updated_at=NOW() WHERE task_id=$1`
	_, err := r.db.Exec(ctx, query, taskid)
	return err
}
