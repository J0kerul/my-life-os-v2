package errors

import "errors"

var (
	// Generic Validation Errors
	ErrTitleRequired   = errors.New("title is required")
	ErrInvalidPriority = errors.New("invalid priority value")
	ErrInvalidDomain   = errors.New("invalid domain value")
	ErrMissingId       = errors.New("id is required")

	// Task Specific Validation Errors
	ErrNoDeadlineForNonBacklog = errors.New("deadline must be set for non-backlog tasks")
	ErrBacklogDeadlineConflict = errors.New("backlog tasks should not have a deadline")
)
