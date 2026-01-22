import { Menu } from "lucide-react";
import type { Task } from "@/types";

type TaskManagerHeaderProps = {
  tasks: Task[];
};

export function TaskManagerHeader({ tasks }: TaskManagerHeaderProps) {
  // calculate tasks due today
  const today = new Date("2026-01-22"); // Your mock date
  today.setHours(0, 0, 0, 0);

  const todaysTasks = tasks.filter((task) => {
    if (!task.deadline || task.completed) return false;

    const taskDate = new Date(task.deadline);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate.getTime() === today.getTime();
  }).length;

  return (
    <div className="flex items-start gap-4 mb-6 pl-32 pr-32">
      {/* Burger Button - absolutely positioned on the far left */}
      <button
        onClick={() => {
          // TODO: Open sidebar
          console.log("Open sidebar");
        }}
        className="p-2 hover:bg-muted rounded-md transition-colors absolute left-6"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Title + Tasks Count + Border - volle Breite des Grids */}
      <div className="flex-1 flex items-center justify-between pb-4 border-b border-border">
        <h1 className="text-2xl font-bold">Task Manager</h1>

        <div className="text-lg text-muted-foreground">
          <span className="font-semibold text-foreground">{todaysTasks}</span>{" "}
          tasks due today
        </div>
      </div>
    </div>
  );
}
