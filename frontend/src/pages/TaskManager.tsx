import { useState } from "react";
import { FilterSidebar } from "../components/TaskManger/FilterSidebar";
import { TaskCard } from "../components/TaskManger/TaskCard";
import { StatsPanel } from "../components/TaskManger/StatsPanel";
import { TaskDetailView } from "../components/TaskManger/TaskDetailView";
import { TodaysSchedule } from "../components/TaskManger/TodaysSchedule";
import { TaskManagerHeader } from "../components/TaskManger/TaskManagerHeader";
import { Card } from "@/components/ui/card";
import { ALL_DOMAINS } from "../constants";
import type { Task } from "../types";

const MOCK_TASKS: Task[] = [
  {
    id: "1",
    title: "Buy milk",
    completed: false,
    priority: "high",
    domain: "personal",
    deadline: "2026-01-22",
    isBacklog: false,
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Finish homework",
    completed: true,
    priority: "medium",
    domain: "university",
    deadline: "2026-01-21",
    isBacklog: false,
    createdAt: "2026-01-19T14:30:00Z",
  },
  {
    id: "3",
    title: "Build MyLifeOS",
    completed: false,
    priority: "high",
    domain: "coding",
    isBacklog: true,
    createdAt: "2026-01-22T09:15:00Z",
  },
  {
    id: "4",
    title: "Prepare presentation",
    completed: false,
    priority: "high",
    domain: "university",
    deadline: "2026-01-24",
    isBacklog: false,
    createdAt: "2026-01-18T16:45:00Z",
  },
  {
    id: "5",
    title: "Call dentist",
    completed: false,
    priority: "low",
    domain: "health",
    deadline: "2026-01-28",
    isBacklog: false,
    createdAt: "2026-01-21T11:20:00Z",
  },
  {
    id: "6",
    title: "Review Pull Request",
    completed: false,
    priority: "medium",
    domain: "work",
    deadline: "2026-01-22",
    isBacklog: false,
    createdAt: "2026-01-22T08:00:00Z",
  },
  {
    id: "7",
    title: "Learn Rust",
    completed: false,
    priority: "low",
    domain: "coding",
    isBacklog: true,
    createdAt: "2026-01-15T13:30:00Z",
  },
  {
    id: "8",
    title: "Fix bug in auth system",
    completed: false,
    priority: "high",
    domain: "work",
    deadline: "2026-01-25",
    isBacklog: false,
    createdAt: "2026-01-21T15:00:00Z",
  },
  {
    id: "9",
    title: 'Read "Clean Code"',
    completed: false,
    priority: "medium",
    domain: "study",
    isBacklog: true,
    createdAt: "2026-01-20T12:00:00Z",
  },
  {
    id: "10",
    title: "Budget review",
    completed: false,
    priority: "medium",
    domain: "finance",
    deadline: "2026-01-26",
    isBacklog: false,
    createdAt: "2026-01-19T10:30:00Z",
  },
  {
    id: "11",
    title: "Setup Docker registry",
    completed: false,
    priority: "high",
    domain: "administration",
    isBacklog: true,
    createdAt: "2026-01-21T14:00:00Z",
  },
  {
    id: "12",
    title: "Plan Berlin trip",
    completed: false,
    priority: "low",
    domain: "travel",
    deadline: "2026-02-01",
    isBacklog: false,
    createdAt: "2026-01-20T09:00:00Z",
  },
  {
    id: "13",
    title: "Dinner with friends",
    completed: false,
    priority: "medium",
    domain: "social",
    deadline: "2026-01-23",
    isBacklog: false,
    createdAt: "2026-01-22T07:30:00Z",
  },
  {
    id: "14",
    title: "Clean apartment",
    completed: false,
    priority: "low",
    domain: "home",
    deadline: "2026-01-24",
    isBacklog: false,
    description:
      "Living room and kitchen Living room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchenLiving room and kitchen",
    createdAt: "2026-01-21T18:00:00Z",
  },
];

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [completedFilter, setCompletedFilter] = useState<
    "all" | "finished" | "unfinished"
  >("all");
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [deadlineFilter, setDeadlineFilter] = useState<
    "all" | "today" | "tomorrow" | "next-week" | "next-month"
  >("all");
  const [sortBy, setSortBy] = useState<"default" | "priority">("default");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

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

    const today = new Date("2026-01-22");
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

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const selectedTask = selectedTaskId
    ? tasks.find((t) => t.id === selectedTaskId) || null
    : null;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <TaskManagerHeader />

      {/* 3 BOXEN NEBENEINANDER - weniger links, mehr rechts */}
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
          />
        </Card>

        {/* ============ BOX 2: TASKS (MITTE) ============ */}
        <Card className="rounded-none bg-muted/30 p-6">
          <div className="grid grid-cols-2 gap-6 h-full">
            {/* DEADLINE TASKS */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Deadline Tasks</h2>
              <div className="space-y-3">
                {deadlineTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTaskId === task.id}
                    onToggle={toggleTask}
                    onSelect={setSelectedTaskId}
                  />
                ))}
              </div>
            </div>

            {/* BACKLOG TASKS */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Backlog</h2>
              <div className="space-y-3">
                {backlogTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isSelected={selectedTaskId === task.id}
                    onToggle={toggleTask}
                    onSelect={setSelectedTaskId}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ============ RECHTE SPALTE: 3 BOXEN ÜBEREINANDER ============ */}
        <div className="flex flex-col gap-0">
          {/* Domain Stats Box */}
          <Card className="rounded-l-none rounded-b-none p-6 flex-1">
            <StatsPanel stats={domainStats} />
          </Card>

          {/* Task Detail View Box */}
          <Card className="rounded-none p-6 flex-1">
            <TaskDetailView task={selectedTask} />
          </Card>

          {/* Today's Schedule Box */}
          <Card className="rounded-l-none rounded-t-none p-6 flex-1">
            <TodaysSchedule />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TaskManager;
