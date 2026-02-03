CREATE TYPE phase_status_enum AS ENUM ('idea', 'planning', 'ongoing', 'testing', 'bug_fixes', 'deployed', 'finished', 'archived', 'on_hold', 'refactoring');

CREATE TABLE IF NOT EXISTS phases (
    phase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(project_id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status phase_status_enum NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
)