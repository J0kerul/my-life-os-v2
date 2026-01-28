import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DOMAIN_COLORS, DOMAIN_ICONS } from "@/constants";
import { Briefcase, ExternalLink, Plus } from "lucide-react";
import { taskService } from "@/services/taskService";
import type { Task } from "@/types";
import { useNavigate } from "react-router-dom";
import { CreateTaskModal } from "../TaskManger/CreateTaskModal";
import { UpdateTaskModal } from "../TaskManger/UpdateTaskModal";
import { TaskDetailModal } from "../TaskManger/TaskDetailModal";
import { CalendarWeekIcon } from "../icons/CalendarWeekIcon";

const getPriorityStyle = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "high":
      return { color: "#EF4444" };
    case "medium":
      return { color: "#F59E0B" };
    case "low":
      return { color: "#10B981" };
  }
};

const formatDateGerman = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

const getDeadlineLabel = (deadline: string) => {
  const today = new Date();
  const taskDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "OVERDUE", color: "#EF4444", isCritical: true };
  } else if (diffDays === 0) {
    return { text: "Today", color: "#EF4444", isCritical: true };
  } else if (diffDays === 1) {
    return { text: "Tomorrow", color: "#F59E0B", isCritical: false };
  } else {
    return {
      text: formatDateGerman(deadline),
      color: "inherit",
      isCritical: false,
    };
  }
};

type UpcomingTasksWidgetProps = {
  refreshTrigger: number;
  onRefresh: () => void;
};

export function UpcomingTasksWidget({
  refreshTrigger,
  onRefresh,
}: UpcomingTasksWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUpcomingTasks();
  }, [refreshTrigger]);

  const loadUpcomingTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);

      const upcomingTasks = allTasks
        .filter((task) => {
          if (!task.deadline || task.completed || task.isBacklog) return false;
          const taskDate = new Date(task.deadline);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate <= sevenDaysFromNow;
        })
        .sort((a, b) => {
          if (!a.deadline || !b.deadline) return 0;
          return a.deadline.localeCompare(b.deadline);
        })
        .slice(0, 10);

      setTasks(upcomingTasks);
    } catch (err) {
      console.error("Failed to load upcoming tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await taskService.createTask(taskData);
      setShowCreateModal(false);
      loadUpcomingTasks();
      onRefresh();
    } catch (err) {
      console.error("Failed to create task:", err);
      alert("Failed to create task");
    }
  };

  const handleUpdateTask = async (taskId: string, updates: any) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, updates);
      setShowUpdateModal(false);
      setSelectedTask(updatedTask);
      setShowDetailModal(true);
      loadUpcomingTasks();
      onRefresh();
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      loadUpcomingTasks();
      onRefresh();
    } catch (err) {
      console.error("Failed to delete task:", err);
      alert("Failed to delete task");
    }
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleEdit = () => {
    setShowDetailModal(false);
    setShowUpdateModal(true);
  };

  const handleDelete = () => {
    setShowDetailModal(false);
    if (selectedTask) {
      handleDeleteTask(selectedTask.id);
      setSelectedTask(null);
    }
  };

  return (
    <>
      <Card className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarWeekIcon size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold">Next 7 Days</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="Quick add task"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/tasks")}
              className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="View all tasks"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar max-h-60">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading...
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No upcoming tasks
            </p>
          ) : (
            tasks.map((task) => {
              const domainColor = DOMAIN_COLORS[task.domain] || "#6B7280";
              const DomainIcon =
                DOMAIN_ICONS[task.domain as keyof typeof DOMAIN_ICONS] ||
                Briefcase;
              const priorityStyle = getPriorityStyle(task.priority);
              const deadlineLabel = task.deadline
                ? getDeadlineLabel(task.deadline)
                : null;

              return (
                <div
                  key={task.id}
                  className="p-3 border border-border rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleTaskClick(task)}
                >
                  <div className="flex items-center gap-2">
                    {/* Priority Bar */}
                    <div
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: priorityStyle.color }}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">
                          {task.title}
                        </p>
                        {deadlineLabel && (
                          <span
                            className={`text-xs whitespace-nowrap shrink-0 ${
                              deadlineLabel.isCritical ? "font-bold" : ""
                            }`}
                            style={{ color: deadlineLabel.color }}
                          >
                            {deadlineLabel.text}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs capitalize gap-1 mt-1"
                        style={{
                          borderColor: domainColor,
                          color: domainColor,
                        }}
                      >
                        <DomainIcon className="w-3 h-3" />
                        {task.domain}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
        defaultIsBacklog={false}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showDetailModal}
        task={selectedTask}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedTask(null);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Update Task Modal */}
      <UpdateTaskModal
        isOpen={showUpdateModal}
        task={selectedTask}
        onClose={() => {
          setShowUpdateModal(false);
          setShowDetailModal(true);
        }}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </>
  );
}
