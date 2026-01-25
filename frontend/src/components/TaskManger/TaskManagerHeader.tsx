import type { Task } from "@/types";
import { Menu } from "lucide-react";

type TaskManagerHeaderProps = {
  tasks: Task[];
  onMenuClick: () => void;
};

export function TaskManagerHeader({
  tasks,
  onMenuClick,
}: TaskManagerHeaderProps) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const tasksDueToday = tasks.filter((task) => {
    if (!task.deadline || task.completed || task.isBacklog) return false;
    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === now.getTime();
  }).length;

  return (
    <div className="mb-6 flex items-center justify-between pl-32 pr-32">
      <div className="flex items-center gap-3">
        {/* Burger Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold">Task Manager</h1>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        <span className="font-medium">{tasksDueToday}</span> tasks due today
      </div>
    </div>
  );
}
