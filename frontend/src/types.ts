export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high";
  domain: string;
  projectId?: string;
  uniModuleId?: string;
  deadline?: string;
  isBacklog: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};