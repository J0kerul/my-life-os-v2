import type { Task } from "@/types";
import { taskMapper, type ApiTask } from "./taskMapper";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export type CreateTaskRequest = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskRequest = Partial<Omit<Task, "id" | "createdAt" | "updatedAt" | "deadline">> & {
  deadline?: string | null;
};

class TaskService {
  private async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || `API Error: ${response.status}`);
    }

    // ← FIX: Leere Responses (wie DELETE 204) nicht parsen!
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T;
    }

    return response.json();
  }

  async getAllTasks(): Promise<Task[]> {
    const apiTasks = await this.fetch<ApiTask[]>("/tasks");
    return apiTasks.map(taskMapper.toFrontend);
  }

  async getTaskById(id: string): Promise<Task> {
    const apiTask = await this.fetch<ApiTask>(`/tasks/${id}`);
    return taskMapper.toFrontend(apiTask);
  }

  async createTask(task: CreateTaskRequest): Promise<Task> {
    const apiTaskData = taskMapper.toApi(task);
    const apiTask = await this.fetch<ApiTask>("/tasks", {
      method: "POST",
      body: JSON.stringify(apiTaskData),
    });
    return taskMapper.toFrontend(apiTask);
  }

  async updateTask(id: string, updates: UpdateTaskRequest): Promise<Task> {
    const apiUpdates = taskMapper.toApi(updates);
    const apiTask = await this.fetch<ApiTask>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(apiUpdates),
    });
    return taskMapper.toFrontend(apiTask);
  }

  async deleteTask(id: string): Promise<void> {
    await this.fetch<void>(`/tasks/${id}`, {
      method: "DELETE",
    });
  }

  async toggleTaskCompletion(id: string): Promise<Task> {
    const apiTask = await this.fetch<ApiTask>(`/tasks/${id}/toggle`, {
      method: "PATCH",
    });
    return taskMapper.toFrontend(apiTask);
  }
}

export const taskService = new TaskService();