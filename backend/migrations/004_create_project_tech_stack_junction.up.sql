CREATE TABLE project_tech_stack (
  project_id UUID REFERENCES projects(project_id) ON DELETE CASCADE,
  tech_stack_item_id UUID REFERENCES tech_stack_items(tech_stack_item_id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tech_stack_item_id)
);