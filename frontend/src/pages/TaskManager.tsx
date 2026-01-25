import { useState, useEffect } from "react";
import { FilterSidebar } from "../components/TaskManger/FilterSidebar";
import { TaskCard } from "../components/TaskManger/TaskCard";
import { StatsPanel } from "../components/TaskManger/StatsPanel";
import { TaskDetailView } from "../components/TaskManger/TaskDetailView";
import { TodaysSchedule } from "../components/TaskManger/TodaysSchedule";
import { TaskManagerHeader } from "../components/TaskManger/TaskManagerHeader";
import { CreateTaskModal } from "../components/TaskManger/CreateTaskModal";
import { Card } from "@/components/ui/card";
import { ALL_DOMAINS } from "../constants";
import type { Task } from "../types";
import { Plus } from "lucide-react";
import { taskService, type CreateTaskRequest } from "../services/taskService";

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedFilter, setCompletedFilter] = useState<
    "all" | "finished" | "unfinished"
  >("unfinished");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [deadlineFilter, setDeadlineFilter] = useState<
    "all" | "today" | "tomorrow" | "next-week" | "next-month"
  >("all");
  const [sortBy, setSortBy] = useState<"default" | "priority">("default");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setCompletedFilter("unfinished");
    setSelectedDomains([]);
    setDeadlineFilter("all");
    setSortBy("default");
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const isDeadlineInRange = (
    deadline: string | undefined,
    range: typeof deadlineFilter,
  ): boolean => {
    if (!deadline || range === "all") return true;

    const today = new Date();
    const taskDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    switch (range) {
      case "today":
        return diffDays === 0;
      case "tomorrow":
        return diffDays === 1;
      case "next-week":
        return diffDays >= 0 && diffDays <= 7;
      case "next-month":
        return diffDays >= 0 && diffDays <= 30;
      default:
        return true;
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (completedFilter === "finished" && !task.completed) return false;
    if (completedFilter === "unfinished" && task.completed) return false;

    if (selectedDomains.length > 0 && !selectedDomains.includes(task.domain))
      return false;

    if (!task.isBacklog && !isDeadlineInRange(task.deadline, deadlineFilter))
      return false;

    return true;
  });

  const priorityValue = (priority: string) => {
    switch (priority) {
      case "high":
        return 3;
      case "medium":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  };

  const deadlineTasks = filteredTasks
    .filter((task) => !task.isBacklog)
    .sort((a, b) => {
      // Completed tasks immer nach unten
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Beide completed oder beide uncompleted - normale Sortierung
      if (sortBy === "priority") {
        return priorityValue(b.priority) - priorityValue(a.priority);
      } else {
        if (!a.deadline || !b.deadline) return 0;
        return a.deadline.localeCompare(b.deadline);
      }
    });

  const backlogTasks = filteredTasks
    .filter((task) => task.isBacklog)
    .sort((a, b) => {
      // Completed tasks immer nach unten
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;

      // Beide completed oder beide uncompleted - normale Sortierung
      if (sortBy === "priority") {
        return priorityValue(b.priority) - priorityValue(a.priority);
      } else {
        return b.createdAt.localeCompare(a.createdAt);
      }
    });

  const domainStats = ALL_DOMAINS.map((domain) => {
    const count = tasks.filter(
      (task) => task.domain === domain && !task.completed,
    ).length;
    return { domain, count };
  }).filter((stat) => stat.count > 0);

  const toggleTask = async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskCompletion(id);
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      console.error("Error toggling task:", err);
      alert("Failed to toggle task completion");
    }
  };

  const handleCreateTask = async (taskData: CreateTaskRequest) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to create task");
    }
  };

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) || null
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <p className="text-lg">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Error: {error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <TaskManagerHeader tasks={tasks} />

      {/* 3 BOXEN NEBENEINANDER */}
      <div className="grid grid-cols-[240px_1fr_380px] gap-0 h-[calc(100vh-12rem)] pl-32 pr-32">
        {/* ============ BOX 1: FILTER (LINKS) ============ */}
        <Card className="rounded-r-none p-6">
          <FilterSidebar
            completedFilter={completedFilter}
            setCompletedFilter={setCompletedFilter}
            selectedDomains={selectedDomains}
            toggleDomain={toggleDomain}
            deadlineFilter={deadlineFilter}
            setDeadlineFilter={setDeadlineFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onResetFilters={resetFilters}
          />
        </Card>

        {/* ============ BOX 2: TASKS (MITTE) ============ */}
        <Card className="rounded-none bg-muted/30 p-6 flex flex-col overflow-hidden">
          {/* ZENTRALE EMPTY STATE - wenn beide Listen leer */}
          {deadlineTasks.length === 0 &&
          backlogTasks.length === 0 &&
          selectedDomains.length === 0 &&
          deadlineFilter === "all" &&
          (completedFilter === "unfinished" || completedFilter === "all") &&
          (sortBy === "default" || sortBy === "priority") ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-8">
                <p className="text-lg font-semibold mb-2">No tasks yet!</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by creating your first task.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium cursor-pointer mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Task
                </button>
              </div>
            </div>
          ) : deadlineTasks.length === 0 && backlogTasks.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground italic">
                  No tasks match your filters.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Try adjusting your filters to see more tasks.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 h-full min-h-0">
              {/* DEADLINE TASKS */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h2 className="text-xl font-semibold">Deadline</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0 custom-scrollbar">
                  {deadlineTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground italic">
                        No deadline tasks.
                      </p>
                    </div>
                  ) : (
                    deadlineTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isSelected={selectedTaskId === task.id}
                        onToggle={toggleTask}
                        onSelect={setSelectedTaskId}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* BACKLOG TASKS */}
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h2 className="text-xl font-semibold">Backlog</h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 px-2 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 font-medium whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Task
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-0 custom-scrollbar">
                  {backlogTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground italic">
                        No backlog tasks.
                      </p>
                    </div>
                  ) : (
                    backlogTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        isSelected={selectedTaskId === task.id}
                        onToggle={toggleTask}
                        onSelect={setSelectedTaskId}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* ============ RECHTE SPALTE: 3 BOXEN ÜBEREINANDER ============ */}
        <div className="flex flex-col gap-0">
          {/* Domain Stats Box */}
          <Card className="rounded-l-none rounded-b-none p-6 flex-1">
            <StatsPanel stats={domainStats} />
          </Card>

          {/* Task Detail View Box */}
          <Card className="rounded-none p-6 flex-1">
            <TaskDetailView
              task={selectedTask}
              onTaskUpdated={(updatedTask) => {
                setTasks(
                  tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
                );
              }}
              onTaskDeleted={(taskId) => {
                setTasks(tasks.filter((t) => t.id !== taskId));
                setSelectedTaskId(null);
              }}
            />
          </Card>

          {/* Today's Schedule Box */}
          <Card className="rounded-l-none rounded-t-none p-6 flex-1">
            <TodaysSchedule />
          </Card>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}

export default TaskManager;
