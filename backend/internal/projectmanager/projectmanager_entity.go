package projectmanager

import (
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	StatusIdea        Status = "idea"
	StatusPlanning    Status = "planning"
	StatusOngoing     Status = "ongoing"
	StatusTesting     Status = "testing"
	StatusBugFixes    Status = "bug_fixes"
	StatusDeployed    Status = "deployed"
	StatusFinished    Status = "finished"
	StatusArchived    Status = "archived"
	StatusOnHold      Status = "on_hold"
	StatusRefactoring Status = "refactoring"
)

type Project struct {
	Projectid    uuid.UUID   `json:"project_id" db:"project_id"`
	Title        string      `json:"title" db:"title"`
	Description  string      `json:"description" db:"description"`
	Status       Status      `json:"status" db:"status"`
	TechStackIds []uuid.UUID `json:"tech_stack_ids" db:"-"`
	GithubUrl    *string     `json:"github_url,omitempty" db:"github_url"`
	LiveUrl      *string     `json:"live_url,omitempty" db:"live_url"`
	CreatedAt    time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time   `json:"updated_at" db:"updated_at"`
}

type TechStackItem struct {
	TechStackItemId uuid.UUID `json:"tech_stack_item_id" db:"tech_stack_item_id"`
	Name            string    `json:"name" db:"name"`
	Color           string    `json:"color" db:"color"`
	Position        int       `json:"position" db:"position"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

type Phase struct {
	PhaseId     uuid.UUID `json:"phase_id" db:"phase_id"`
	ProjectId   uuid.UUID `json:"project_id" db:"project_id"`
	Title       string    `json:"title" db:"title"`
	Description string    `json:"description" db:"description"`
	Status      Status    `json:"status" db:"status"`
	Position    int       `json:"position" db:"position"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
