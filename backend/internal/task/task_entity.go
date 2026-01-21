package task

import (
	"time"

	"github.com/google/uuid"
)

type Priority string

const (
	PriorityHigh   Priority = "high"
	PriorityMedium Priority = "medium"
	PriorityLow    Priority = "low"
)

type Domain string

const (
	DomainWork           Domain = "work"
	DomainUniversity     Domain = "university"
	DomainPersonal       Domain = "personal"
	DomainCoding         Domain = "coding"
	DomainHealth         Domain = "health"
	DomainFinance        Domain = "finance"
	DomainSocial         Domain = "social"
	DomainHome           Domain = "home"
	DomainStudy          Domain = "study"
	DomainTravel         Domain = "travel"
	DomainAdministration Domain = "administration"
)

type Task struct {
	TaskId      uuid.UUID  `json:"task_id" db:"task_id"`
	Title       string     `json:"title" db:"title"`
	Description *string    `json:"description,omitempty" db:"description"`
	Priority    Priority   `json:"priority" db:"priority"`
	Domain      Domain     `json:"domain" db:"domain"`
	ProjectId   *uuid.UUID `json:"project_id,omitempty" db:"project_id"`
	UniModuleId *uuid.UUID `json:"uni_module_id,omitempty" db:"uni_module_id"`
	Deadline    *time.Time `json:"deadline,omitempty" db:"deadline"`
	IsBacklog   bool       `json:"is_backlog" db:"is_backlog"`
	Completed   bool       `json:"completed" db:"completed"`
	CreatedAt   time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at" db:"updated_at"`
}

type TaskFilter struct {
	Priority  *Priority
	Domain    *Domain
	IsBacklog *bool
	Completed *bool
}
