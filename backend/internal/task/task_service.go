package task

import (
	"context"
	"fmt"

	errorutils "github.com/J0kerul/jokers-hub/pkg/errors"
	"github.com/google/uuid"
)

type TaskService struct {
	repo TaskRepositoryInterface
}

func NewTaskService(repo TaskRepositoryInterface) *TaskService {
	return &TaskService{
		repo: repo,
	}
}

func (s *TaskService) CreateTask(ctx context.Context, task *Task) error {
	// Check for required fields
	err := checkFields(*task)
	if err != nil {
		return err
	}

	// Create Task
	err = s.repo.Create(ctx, task)
	if err != nil {
		return fmt.Errorf("failed to create task: %w", err)
	}

	return nil
}

func (s *TaskService) UpdateTask(ctx context.Context, task *Task) error {
	// Check for required fields
	err := checkFields(*task)
	if err != nil {
		return err
	}
	// Update Task
	err = s.repo.Update(ctx, task)
	if err != nil {
		return fmt.Errorf("failed to update task: %w", err)
	}

	return nil
}

func (s *TaskService) GetTaskById(ctx context.Context, taskid uuid.UUID) (*Task, error) {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return nil, errorutils.ErrMissingId
	}
	// Check if id exists and get it
	task, err := s.repo.GetById(ctx, taskid)
	if err != nil {
		return nil, fmt.Errorf("failed to get task by id: %w", err)
	}

	return task, nil
}

func (s *TaskService) GetAllTasks(ctx context.Context) ([]*Task, error) {
	tasks, err := s.repo.GetAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get all tasks: %w", err)
	}

	return tasks, nil
}

func (s *TaskService) DeleteTask(ctx context.Context, taskid uuid.UUID) error {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return errorutils.ErrMissingId
	}

	// Delete id
	err := s.repo.Delete(ctx, taskid)
	if err != nil {
		return fmt.Errorf("failed to delete task: %w", err)
	}

	return nil
}

func (s *TaskService) ToggleStatus(ctx context.Context, taskid uuid.UUID) error {
	// Check if id isn't empty
	if taskid == uuid.Nil {
		return errorutils.ErrMissingId
	}

	err := s.repo.ToggleStatus(ctx, taskid)
	if err != nil {
		return fmt.Errorf("failed to toggle task status: %w", err)
	}

	return nil
}

func checkFields(task Task) error {
	// Check title
	if task.Title == "" {
		return errorutils.ErrTitleRequired
	}

	// Check Priority Validation
	if !isPrioValid(task.Priority) {
		return errorutils.ErrInvalidPriority
	}

	// Check Domain Validation
	if !isDomainValid(task.Domain) {
		return errorutils.ErrInvalidDomain
	}

	// Check if deadline exists if task is not marked as backlog
	if task.Deadline == nil && !task.IsBacklog {
		return errorutils.ErrNoDeadlineForNonBacklog
	}

	// Check the other way around
	if task.IsBacklog && task.Deadline != nil {
		return errorutils.ErrBacklogDeadlineConflict

	}

	return nil
}

func isPrioValid(p Priority) bool {
	switch p {
	case PriorityHigh, PriorityLow, PriorityMedium:
		return true
	default:
		return false
	}
}

func isDomainValid(d Domain) bool {
	switch d {
	case DomainWork, DomainUniversity, DomainPersonal, DomainCoding, DomainHealth, DomainFinance, DomainSocial, DomainHome, DomainStudy, DomainTravel, DomainAdministration:
		return true
	default:
		return false
	}
}
