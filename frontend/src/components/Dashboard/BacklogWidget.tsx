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
import { BacklogIcon } from "../icons/BacklogIcon";

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

type BacklogWidgetProps = {
  refreshTrigger: number;
  onRefresh: () => void;
};

export function BacklogWidget({
  refreshTrigger,
  onRefresh,
}: BacklogWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadBacklogTasks();
  }, [refreshTrigger]);

  const loadBacklogTasks = async () => {
    try {
      const allTasks = await taskService.getAllTasks();
      const backlogTasks = allTasks
        .filter((task) => task.isBacklog && !task.completed)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 10);
      setTasks(backlogTasks);
    } catch (err) {
      console.error("Failed to load backlog tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await taskService.createTask(taskData);
      setShowCreateModal(false);
      loadBacklogTasks();
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
      loadBacklogTasks();
      onRefresh();
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      loadBacklogTasks();
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
            <BacklogIcon size={20} className="text-blue-500" />
            <h3 className="text-lg font-semibold">Backlog</h3>
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
              No backlog tasks
            </p>
          ) : (
            tasks.map((task) => {
              const domainColor = DOMAIN_COLORS[task.domain] || "#6B7280";
              const DomainIcon =
                DOMAIN_ICONS[task.domain as keyof typeof DOMAIN_ICONS] ||
                Briefcase;
              const priorityStyle = getPriorityStyle(task.priority);

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
                      <p className="text-sm font-medium truncate">
                        {task.title}
                      </p>
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
        defaultIsBacklog={true}
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
