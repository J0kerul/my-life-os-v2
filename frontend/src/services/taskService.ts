// src/services/taskService.ts
import type { Task } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

// Request Types
export type CreateTaskRequest = Omit<Task, "id" | "createdAt">;
export type UpdateTaskRequest = Partial<Omit<Task, "id" | "createdAt">>;

class TaskService {
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // TODO: Add auth token here later
        // "Authorization": `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // GET /tasks - Alle Tasks holen
  async getAllTasks(): Promise<Task[]> {
    return this.fetch<Task[]>("/tasks");
  }

  // POST /tasks - Task erstellen
  async createTask(task: CreateTaskRequest): Promise<Task> {
    return this.fetch<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(task),
    });
  }

  // PUT /tasks/:id - Task updaten
  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    return this.fetch<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // DELETE /tasks/:id - Task löschen
  async deleteTask(id: string): Promise<void> {
    return this.fetch<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  // PATCH /tasks/:id/toggle - Completion toggle
  async toggleTaskCompletion(id: string): Promise<Task> {
    return this.fetch<Task>(`/tasks/${id}/toggle`, {
      method: "PATCH",
    });
  }
}

export const taskService = new TaskService();