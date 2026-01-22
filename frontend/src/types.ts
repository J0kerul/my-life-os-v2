export type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  domain: string;
  deadline?: string;
  isBacklog: boolean;
  createdAt: string;
  description?: string;
  project_id?: string;
  uni_module_id?: string;
};