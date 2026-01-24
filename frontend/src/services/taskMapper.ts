import type { Task } from "@/types";

// Backend API Format
export type ApiTask = {
  task_id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  domain: string;
  project_id?: string;
  uni_module_id?: string;
  deadline?: string;
  is_backlog: boolean;
  completed: boolean;
  created_at: string;
  updated_at: string;
};

export const taskMapper = {
  // API → Frontend
  toFrontend(apiTask: ApiTask): Task {
    return {
      id: apiTask.task_id,
      title: apiTask.title,
      description: apiTask.description,
      priority: apiTask.priority,
      domain: apiTask.domain,
      projectId: apiTask.project_id,
      uniModuleId: apiTask.uni_module_id,
      deadline: apiTask.deadline 
        ? apiTask.deadline.split('T')[0]
        : undefined,
      isBacklog: apiTask.is_backlog,
      completed: apiTask.completed,
      createdAt: apiTask.created_at,
      updatedAt: apiTask.updated_at,
    };
  },

  // Frontend → API (für POST/PUT requests)
  toApi(task: Partial<Task>): Partial<Omit<ApiTask, "task_id" | "created_at" | "updated_at">> {
    const apiTask: Partial<Omit<ApiTask, "task_id" | "created_at" | "updated_at">> = {};
    
    if (task.title !== undefined) apiTask.title = task.title;
    if (task.description !== undefined) apiTask.description = task.description;
    if (task.priority !== undefined) apiTask.priority = task.priority;
    if (task.domain !== undefined) apiTask.domain = task.domain;
    if (task.projectId !== undefined) apiTask.project_id = task.projectId;
    if (task.uniModuleId !== undefined) apiTask.uni_module_id = task.uniModuleId;
    if (task.deadline !== undefined) apiTask.deadline = task.deadline;
    if (task.isBacklog !== undefined) apiTask.is_backlog = task.isBacklog;
    if (task.completed !== undefined) apiTask.completed = task.completed;
    
    return apiTask;
  },
};