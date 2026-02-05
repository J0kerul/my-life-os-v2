import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Github,
  ExternalLink,
  Plus,
  Menu,
  X,
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
import {
  projectService,
  type Project,
  type ProjectStatus,
} from "@/services/projectService";
import { CreateProjectModal } from "@/components/ProjectManager/CreateProjectModal";
import { ProjectCard } from "@/components/ProjectManager/ProjectCard";

// Project Status Configuration
const PROJECT_STATUSES = {
  idea: { label: "Idea", color: "#A78BFA", icon: Lightbulb },
  planning: { label: "Planning", color: "#60A5FA", icon: ClipboardList },
  ongoing: { label: "Ongoing", color: "#10B981", icon: Code2 },
  testing: { label: "Testing", color: "#FBBF24", icon: FlaskConical },
  bug_fixes: { label: "Bug Fixes", color: "#F97316", icon: Bug },
  deployed: { label: "Deployed", color: "#14B8A6", icon: Rocket },
  finished: { label: "Finished", color: "#059669", icon: CheckCircle },
  archived: { label: "Archived", color: "#6B7280", icon: Archive },
  on_hold: { label: "On Hold", color: "#94A3B8", icon: Pause },
  refactoring: { label: "Refactoring", color: "#8B5CF6", icon: RefreshCw },
} as const;

// Tech Stack Items Configuration
type TechStackItem = {
  tech_stack_item_id: string;
  name: string;
  color: string;
};

const TECH_STACK_ITEMS: TechStackItem[] = [
  // Frontend
  { id: "550e8400-e29b-41d4-a716-446655440001", name: "React", color: "#61DAFB", position: 1 },
  { id: "550e8400-e29b-41d4-a716-446655440002", name: "TypeScript", color: "#3178C6", position: 2 },
  { id: "550e8400-e29b-41d4-a716-446655440003", name: "Next.js", color: "#000000", position: 3 },
  { id: "550e8400-e29b-41d4-a716-446655440004", name: "Tailwind CSS", color: "#06B6D4", position: 4 },
  { id: "550e8400-e29b-41d4-a716-446655440005", name: "Vite", color: "#646CFF", position: 5 },
  
  // Backend
  { id: "550e8400-e29b-41d4-a716-446655440006", name: "Go", color: "#00ADD8", position: 6 },
  { id: "550e8400-e29b-41d4-a716-446655440007", name: "Node.js", color: "#339933", position: 7 },
  { id: "550e8400-e29b-41d4-a716-446655440008", name: "Python", color: "#3776AB", position: 8 },
  
  // Database
  { id: "550e8400-e29b-41d4-a716-446655440009", name: "PostgreSQL", color: "#4169E1", position: 9 },
  { id: "550e8400-e29b-41d4-a716-446655440010", name: "MongoDB", color: "#47A248", position: 10 },
  { id: "550e8400-e29b-41d4-a716-446655440011", name: "Redis", color: "#DC382D", position: 11 },
  
  // DevOps
  { id: "550e8400-e29b-41d4-a716-446655440012", name: "Docker", color: "#2496ED", position: 12 },
  { id: "550e8400-e29b-41d4-a716-446655440013", name: "Kubernetes", color: "#326CE5", position: 13 },
  { id: "550e8400-e29b-41d4-a716-446655440014", name: "GitHub Actions", color: "#2088FF", position: 14 },
].sort((a, b) => a.position - b.position);

export default function ProjectManager() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">(
    "all",
  );
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Form state for edit project
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    status: "idea" as ProjectStatus,
    techStackIds: [] as string[],
    githubUrl: "",
    liveUrl: "",
  });

  // Load projects from API
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get tech stack items for a project in sorted order
  const getTechStack = (techStackIds: string[]): TechStackItem[] => {
    return techStackIds
      .map((id) =>
        TECH_STACK_ITEMS.find((item) => item.tech_stack_item_id === id),
      )
      .filter((item): item is TechStackItem => item !== undefined);
  };

  // Toggle tech stack filter
  const toggleTechStack = (techId: string) => {
    if (selectedTechStack.includes(techId)) {
      setSelectedTechStack(selectedTechStack.filter((id) => id !== techId));
    } else {
      setSelectedTechStack([...selectedTechStack, techId]);
    }
  };

  // Toggle tech stack in edit project form
  const toggleNewProjectTechStack = (techId: string) => {
    if (newProject.techStackIds.includes(techId)) {
      setNewProject({
        ...newProject,
        techStackIds: newProject.techStackIds.filter((id) => id !== techId),
      });
    } else {
      setNewProject({
        ...newProject,
        techStackIds: [...newProject.techStackIds, techId],
      });
    }
  };

  // Open edit modal with project data
  const handleOpenEdit = () => {
    if (selectedProject) {
      setNewProject({
        title: selectedProject.title,
        description: selectedProject.description,
        status: selectedProject.status,
        techStackIds: selectedProject.tech_stack_ids,
        githubUrl: selectedProject.github_url || "",
        liveUrl: selectedProject.live_url || "",
      });
      setShowDetailModal(false);
      setShowEditModal(true);
    }
  };

  // Close edit modal
  const handleCloseEdit = () => {
    setShowEditModal(false);
    setShowDetailModal(true);
    setNewProject({
      title: "",
      description: "",
      status: "idea",
      techStackIds: [],
      githubUrl: "",
      liveUrl: "",
    });
  };

  // Handle update (no functionality yet)
  const handleUpdate = () => {
    console.log("Update project:", selectedProject?.project_id, newProject);
    setShowEditModal(false);
    setShowDetailModal(true);
  };

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    const matchesTechStack =
      selectedTechStack.length === 0 ||
      selectedTechStack.some((techId) =>
        project.tech_stack_ids.includes(techId),
      );
    return matchesStatus && matchesTechStack;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading projects...</p>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 shrink-0">
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
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Main Content with Custom Scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-120px)]">
          {/* Filters - Static */}
          <div className="px-6 py-6 shrink-0">
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
                <span className="text-sm font-medium mb-3 block">
                  Tech Stack
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {TECH_STACK_ITEMS.map((tech) => {
                    const isSelected = selectedTechStack.includes(
                      tech.tech_stack_item_id,
                    );

                    return (
                      <button
                        key={tech.tech_stack_item_id}
                        onClick={() => toggleTechStack(tech.tech_stack_item_id)}
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
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.project_id}
                  project={project}
                  techStackItems={TECH_STACK_ITEMS}
                  phases={[]} // TODO: Load phases from API
                  tasks={[]} // TODO: Load tasks from API
                  statusConfig={PROJECT_STATUSES[project.status]}
                  onClick={() => {
                    setSelectedProject(project);
                    setShowDetailModal(true);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadProjects}
          techStackItems={TECH_STACK_ITEMS}
        />

        {/* Project Detail Modal */}
        {showDetailModal && selectedProject && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowDetailModal(false);
              setSelectedProject(null);
            }}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">
                      {selectedProject.title}
                    </h2>
                    {(() => {
                      const statusConfig =
                        PROJECT_STATUSES[selectedProject.status];
                      const StatusIcon = statusConfig.icon;
                      return (
                        <Badge
                          variant="outline"
                          className="text-sm gap-1.5 font-medium"
                          style={{
                            borderColor: statusConfig.color,
                            color: statusConfig.color,
                          }}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig.label}
                        </Badge>
                      );
                    })()}
                  </div>
                  {selectedProject.description && (
                    <p className="text-sm text-muted-foreground">
                      {selectedProject.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedProject(null);
                  }}
                  className="p-1 hover:bg-muted rounded-md transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Tech Stack */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Tech Stack</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getTechStack(selectedProject.tech_stack_ids).map(
                      (tech) => (
                        <Badge
                          key={tech.tech_stack_item_id}
                          variant="outline"
                          style={{
                            borderColor: tech.color,
                            color: tech.color,
                          }}
                        >
                          {tech.name}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {/* Links */}
                {(selectedProject.github_url || selectedProject.live_url) && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Links</h3>
                    <div className="flex items-center gap-3">
                      {selectedProject.github_url && (
                        <a
                          href={selectedProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Github className="w-4 h-4" />
                          GitHub Repository
                        </a>
                      )}
                      {selectedProject.live_url && (
                        <a
                          href={selectedProject.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* TODO: Phases and Tasks sections when API is ready */}
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    Phases and tasks will load from API...
                  </p>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>
                      Updated{" "}
                      {new Date(
                        selectedProject.updated_at,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={() =>
                    console.log("Delete project:", selectedProject.project_id)
                  }
                  className="px-4 py-2 rounded-md text-destructive border border-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={handleOpenEdit}
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer"
                >
                  Edit Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={handleCloseEdit}
          >
            <div
              className="bg-background border border-border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-2xl font-bold">Edit Project</h2>
                <button
                  onClick={handleCloseEdit}
                  className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <Label
                    htmlFor="edit-title"
                    className="text-sm font-medium mb-2"
                  >
                    Title *
                  </Label>
                  <Input
                    id="edit-title"
                    type="text"
                    placeholder="e.g. Portfolio Website"
                    value={newProject.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label
                    htmlFor="edit-description"
                    className="text-sm font-medium mb-2"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="edit-description"
                    placeholder="Brief description of your project..."
                    value={newProject.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Status */}
                <div>
                  <Label className="text-sm font-medium mb-2">Status *</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value: ProjectStatus) =>
                      setNewProject({ ...newProject, status: value })
                    }
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(PROJECT_STATUSES) as ProjectStatus[]).map(
                        (status) => {
                          const config = PROJECT_STATUSES[status];
                          const Icon = config.icon;
                          return (
                            <SelectItem key={status} value={status}>
                              <div className="flex items-center gap-2">
                                <Icon
                                  className="w-4 h-4"
                                  style={{ color: config.color }}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          );
                        },
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tech Stack */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Tech Stack
                  </Label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {TECH_STACK_ITEMS.map((tech) => {
                      const isSelected = newProject.techStackIds.includes(
                        tech.tech_stack_item_id,
                      );
                      return (
                        <button
                          key={tech.tech_stack_item_id}
                          type="button"
                          onClick={() =>
                            toggleNewProjectTechStack(tech.tech_stack_item_id)
                          }
                          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:opacity-80"
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

                {/* GitHub URL */}
                <div>
                  <Label
                    htmlFor="edit-githubUrl"
                    className="text-sm font-medium mb-2"
                  >
                    GitHub URL
                  </Label>
                  <Input
                    id="edit-githubUrl"
                    type="text"
                    placeholder="https://github.com/username/repo"
                    value={newProject.githubUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({
                        ...newProject,
                        githubUrl: e.target.value,
                      })
                    }
                    className="mt-2"
                  />
                </div>

                {/* Live URL */}
                <div>
                  <Label
                    htmlFor="edit-liveUrl"
                    className="text-sm font-medium mb-2"
                  >
                    Live URL
                  </Label>
                  <Input
                    id="edit-liveUrl"
                    type="text"
                    placeholder="https://your-project.com"
                    value={newProject.liveUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewProject({ ...newProject, liveUrl: e.target.value })
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
                <button
                  onClick={handleCloseEdit}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={
                    !newProject.title ||
                    !newProject.description ||
                    newProject.techStackIds.length === 0
                  }
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
