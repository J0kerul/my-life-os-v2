import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  ExternalLink,
  Plus,
  Menu,
  Lightbulb,
  ClipboardList,
  Code2,
  FlaskConical,
  Bug,
  Rocket,
  CheckCircle,
  Archive,
  Pause,
  RefreshCw,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";

// Project Status Configuration
const PROJECT_STATUSES = {
  idea: { label: "Idea", color: "#A78BFA", icon: Lightbulb },
  planning: { label: "Planning", color: "#60A5FA", icon: ClipboardList },
  ongoing: { label: "Ongoing", color: "#10B981", icon: Code2 },
  testing: { label: "Testing", color: "#FBBF24", icon: FlaskConical },
  bugfixes: { label: "Bug Fixes", color: "#F97316", icon: Bug },
  deployed: { label: "Deployed", color: "#14B8A6", icon: Rocket },
  finished: { label: "Finished", color: "#059669", icon: CheckCircle },
  archived: { label: "Archived", color: "#6B7280", icon: Archive },
  onhold: { label: "On Hold", color: "#94A3B8", icon: Pause },
  refactoring: { label: "Refactoring", color: "#8B5CF6", icon: RefreshCw },
} as const;

type ProjectStatus = keyof typeof PROJECT_STATUSES;

// Tech Stack Items Configuration
type TechStackItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  position: number;
};

const TECH_STACK_ITEMS: TechStackItem[] = [
  // Frontend
  {
    id: "1",
    name: "React",
    category: "Frontend",
    color: "#61DAFB",
    position: 1,
  },
  {
    id: "2",
    name: "TypeScript",
    category: "Frontend",
    color: "#3178C6",
    position: 2,
  },
  {
    id: "3",
    name: "Next.js",
    category: "Frontend",
    color: "#000000",
    position: 3,
  },
  {
    id: "4",
    name: "Tailwind CSS",
    category: "Frontend",
    color: "#06B6D4",
    position: 4,
  },
  {
    id: "5",
    name: "Vite",
    category: "Frontend",
    color: "#646CFF",
    position: 5,
  },

  // Backend
  { id: "6", name: "Go", category: "Backend", color: "#00ADD8", position: 6 },
  {
    id: "7",
    name: "Node.js",
    category: "Backend",
    color: "#339933",
    position: 7,
  },
  {
    id: "8",
    name: "Python",
    category: "Backend",
    color: "#3776AB",
    position: 8,
  },

  // Database
  {
    id: "9",
    name: "PostgreSQL",
    category: "Database",
    color: "#4169E1",
    position: 9,
  },
  {
    id: "10",
    name: "MongoDB",
    category: "Database",
    color: "#47A248",
    position: 10,
  },
  {
    id: "11",
    name: "Redis",
    category: "Database",
    color: "#DC382D",
    position: 11,
  },

  // DevOps
  {
    id: "12",
    name: "Docker",
    category: "DevOps",
    color: "#2496ED",
    position: 12,
  },
  {
    id: "13",
    name: "Kubernetes",
    category: "DevOps",
    color: "#326CE5",
    position: 13,
  },
  {
    id: "14",
    name: "GitHub Actions",
    category: "DevOps",
    color: "#2088FF",
    position: 14,
  },
].sort((a, b) => a.position - b.position);

export default function ProjectManager() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  // Mock Projects - direkt hardcoded
  const projects = [
    {
      id: "1",
      title: "MyLifeOS 2.0",
      description:
        "Full-stack personal life management system with modular architecture. Features task management, dashboard widgets, and clean architecture patterns.",
      status: "ongoing" as ProjectStatus,
      githubUrl: "https://github.com/alex/mylifeos",
      demoUrl: "https://mylifeos.onrender.com",
      techStackIds: ["6", "1", "2", "9", "12", "4"], // Go, React, TypeScript, PostgreSQL, Docker, Tailwind CSS
      phases: [
        { name: "Setup & Architecture", status: "Completed", tasks: "5/5" },
        { name: "Core Features", status: "In Progress", tasks: "3/8" },
        { name: "Module Expansion", status: "Not Started", tasks: "0/12" },
      ],
      tasks: [],
      totalTasks: 25,
      updatedAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Portfolio Website",
      description:
        "Modern portfolio website showcasing projects and skills. Built with Next.js for optimal performance and SEO.",
      status: "planning" as ProjectStatus,
      githubUrl: "https://github.com/alex/portfolio",
      techStackIds: ["3", "2", "4"], // Next.js, TypeScript, Tailwind CSS
      phases: [],
      tasks: [
        { id: "t1", title: "Design landing page mockup", completed: false },
        {
          id: "t2",
          title: "Setup Next.js project structure",
          completed: false,
        },
        { id: "t3", title: "Configure Tailwind CSS", completed: false },
        { id: "t4", title: "Create navigation component", completed: false },
        { id: "t5", title: "Build project showcase section", completed: false },
      ],
      totalTasks: 8,
      updatedAt: "1 day ago",
    },
    {
      id: "3",
      title: "Go Learning Path",
      description:
        "Learning Go through building practical projects. Following best practices and clean architecture patterns.",
      status: "ongoing" as ProjectStatus,
      techStackIds: ["6", "9", "12"], // Go, PostgreSQL, Docker
      phases: [
        { name: "Basics & Syntax", status: "Completed", tasks: "6/6" },
        { name: "Web Development", status: "In Progress", tasks: "4/10" },
      ],
      tasks: [],
      totalTasks: 16,
      updatedAt: "3 hours ago",
    },
    {
      id: "4",
      title: "Microservices Architecture Study",
      description:
        "Deep dive into microservices patterns, inter-service communication, and distributed systems.",
      status: "onhold" as ProjectStatus,
      techStackIds: ["6", "7", "12", "13", "11"], // Go, Node.js, Docker, Kubernetes, Redis
      phases: [],
      tasks: [
        { id: "t6", title: "Research service mesh patterns", completed: false },
        { id: "t7", title: "Setup local Kubernetes cluster", completed: false },
        { id: "t8", title: "Implement API gateway service", completed: false },
        { id: "t9", title: "Configure Redis for caching", completed: false },
        {
          id: "t10",
          title: "Document architecture decisions",
          completed: false,
        },
      ],
      totalTasks: 15,
      updatedAt: "2 weeks ago",
    },
    {
      id: "5",
      title: "React Component Library",
      description:
        "Reusable component library with TypeScript and Storybook documentation.",
      status: "finished" as ProjectStatus,
      githubUrl: "https://github.com/alex/component-lib",
      demoUrl: "https://alex-components.netlify.app",
      techStackIds: ["1", "2", "5"], // React, TypeScript, Vite
      phases: [
        { name: "Core Components", status: "Completed", tasks: "8/8" },
        { name: "Documentation", status: "Completed", tasks: "4/4" },
      ],
      tasks: [],
      totalTasks: 12,
      updatedAt: "1 month ago",
    },
    {
      id: "6",
      title: "API Gateway Experiment",
      description:
        "Building a custom API gateway to learn about routing, rate limiting, and authentication.",
      status: "testing" as ProjectStatus,
      githubUrl: "https://github.com/alex/api-gateway",
      techStackIds: ["6", "11", "12"], // Go, Redis, Docker
      phases: [],
      tasks: [
        {
          id: "t11",
          title: "Implement rate limiting middleware",
          completed: false,
        },
        { id: "t12", title: "Add JWT authentication", completed: false },
        { id: "t13", title: "Write integration tests", completed: false },
        { id: "t14", title: "Setup load testing", completed: false },
      ],
      totalTasks: 7,
      updatedAt: "5 hours ago",
    },
  ];

  // Helper function to get tech stack items for a project in sorted order
  const getTechStack = (techStackIds: string[]): TechStackItem[] => {
    return techStackIds
      .map((id) => TECH_STACK_ITEMS.find((item) => item.id === id))
      .filter((item): item is TechStackItem => item !== undefined)
      .sort((a, b) => a.position - b.position);
  };

  // Toggle tech stack filter
  const toggleTechStack = (techId: string) => {
    if (selectedTechStack.includes(techId)) {
      setSelectedTechStack(selectedTechStack.filter((id) => id !== techId));
    } else {
      setSelectedTechStack([...selectedTechStack, techId]);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card/50">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Burger Button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Title */}
                <h1 className="text-3xl font-bold">Project Manager</h1>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Filters - Static */}
        <div className="px-6 py-6">
          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <span className="text-sm font-medium mb-3 block">Status</span>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Status Filters */}
                {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                  (status) => {
                    const config = PROJECT_STATUSES[status];
                    const Icon = config.icon;
                    const isSelected = statusFilter === status;

                    return (
                      <button
                        key={status}
                        onClick={() =>
                          setStatusFilter(isSelected ? "all" : status)
                        }
                        className="px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 hover:opacity-80"
                        style={{
                          backgroundColor: isSelected
                            ? config.color
                            : "transparent",
                          color: isSelected ? "#ffffff" : config.color,
                          border: `2px solid ${config.color}`,
                        }}
                      >
                        <Icon size={16} />
                        <span>{config.label}</span>
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            {/* Tech Stack Filter */}
            <div>
              <span className="text-sm font-medium mb-3 block">Tech Stack</span>
              <div className="flex items-center gap-2 flex-wrap">
                {TECH_STACK_ITEMS.map((tech) => {
                  const isSelected = selectedTechStack.includes(tech.id);

                  return (
                    <button
                      key={tech.id}
                      onClick={() => toggleTechStack(tech.id)}
                      className="px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-80"
                      style={{
                        backgroundColor: isSelected
                          ? tech.color
                          : "transparent",
                        color: isSelected ? "#ffffff" : tech.color,
                        border: `2px solid ${tech.color}`,
                      }}
                    >
                      {tech.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="px-6 pb-12">
          <div className="grid grid-cols-2 gap-4">
            {projects
              .filter((project) => {
                const matchesStatus =
                  statusFilter === "all" || project.status === statusFilter;
                const matchesTechStack =
                  selectedTechStack.length === 0 ||
                  selectedTechStack.some((techId) =>
                    project.techStackIds.includes(techId),
                  );
                return matchesStatus && matchesTechStack;
              })
              .map((project) => (
                <Card
                  key={project.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">
                            {project.title}
                          </CardTitle>
                          {(() => {
                            const statusConfig =
                              PROJECT_STATUSES[project.status];
                            const StatusIcon = statusConfig.icon;
                            return (
                              <Badge
                                variant="outline"
                                className="text-xs capitalize gap-1.5 font-medium"
                                style={{
                                  borderColor: statusConfig.color,
                                  color: statusConfig.color,
                                }}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </Badge>
                            );
                          })()}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Tech Stack */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {getTechStack(project.techStackIds).map((tech) => (
                        <Badge
                          key={tech.id}
                          variant="outline"
                          style={{
                            borderColor: tech.color,
                            color: tech.color,
                          }}
                        >
                          {tech.name}
                        </Badge>
                      ))}
                    </div>

                    {/* Phases OR Tasks */}
                    {project.phases.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Phases:</p>
                        <div className="space-y-1">
                          {project.phases.slice(0, 3).map((phase, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
                            >
                              <span className="text-muted-foreground">
                                {phase.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {phase.tasks}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {phase.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      project.tasks &&
                      project.tasks.filter((t) => !t.completed).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Tasks:</p>
                          <div className="space-y-1">
                            {project.tasks
                              .filter((t) => !t.completed)
                              .slice(0, 3)
                              .map((task) => (
                                <div
                                  key={task.id}
                                  className="flex items-center gap-2 text-sm px-2 py-1.5 rounded-md hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <span className="text-muted-foreground">
                                    ☐
                                  </span>
                                  <span className="text-muted-foreground flex-1">
                                    {task.title}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    )}

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>📊 {project.totalTasks} Tasks</span>
                        {project.phases.length > 0 && (
                          <span>• {project.phases.length} Phases</span>
                        )}
                        <span>• Updated {project.updatedAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-muted rounded-md transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-muted rounded-md transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
