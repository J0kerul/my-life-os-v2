CREATE TYPE priority_enum AS ENUM ('low', 'medium', 'high');
CREATE TYPE domain_enum AS ENUM (
    'work', 
    'university', 
    'personal', 
    'coding', 
    'health', 
    'finance',
    'social',
    'home',
    'study',
    'travel',
    'administration'
);


CREATE TABLE tasks (
    task_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority priority_enum NOT NULL,
    domain domain_enum NOT NULL,
    project_id UUID,
    uni_module_id UUID,
    deadline TIMESTAMPTZ,
    is_backlog BOOLEAN NOT NULL DEFAULT FALSE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)