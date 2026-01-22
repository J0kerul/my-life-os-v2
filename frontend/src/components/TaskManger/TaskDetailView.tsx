import { Badge } from "@/components/ui/badge";
import { DOMAIN_COLORS, DOMAIN_ICONS, ALL_DOMAINS } from "@/constants";
import {
  Briefcase,
  FolderKanban,
  GraduationCap,
  Edit,
  Trash2,
  X,
  Save,
} from "lucide-react";
import type { Task } from "@/types";
import { useState } from "react";
import { Card } from "@/components/ui/card";

type TaskDetailViewProps = {
  task: Task | null;
};

const PRIORITIES = ["low", "medium", "high"] as const;

const getPriorityStyle = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "high":
      return { color: "#EF4444", borderColor: "#EF4444", label: "High" };
    case "medium":
      return { color: "#F59E0B", borderColor: "#F59E0B", label: "Medium" };
    case "low":
      return { color: "#10B981", borderColor: "#10B981", label: "Low" };
  }
};

export function TaskDetailView({ task }: TaskDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit state
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDomain, setEditDomain] = useState("");
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );
  const [editIsBacklog, setEditIsBacklog] = useState(false);
  const [editDeadline, setEditDeadline] = useState("");

  if (!task) {
    return (
      <div>
        <h2 className="text-lg font-semibold mb-4">Task Details</h2>
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground italic">
            Select a task to view details
          </p>
        </div>
      </div>
    );
  }

  const domainColor = DOMAIN_COLORS[task.domain] || "#6B7280";
  const DomainIcon =
    DOMAIN_ICONS[task.domain as keyof typeof DOMAIN_ICONS] || Briefcase;
  const priorityStyle = getPriorityStyle(task.priority);

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditDomain(task.domain);
    setEditPriority(task.priority);
    setEditIsBacklog(task.isBacklog);
    setEditDeadline(task.deadline || "");
    setIsEditing(true);
  };

  const handleUpdate = () => {
    // TODO: Backend update logic
    console.log("Update task:", {
      id: task.id,
      title: editTitle,
      description: editDescription,
      domain: editDomain,
      priority: editPriority,
      isBacklog: editIsBacklog,
      deadline: editIsBacklog ? null : editDeadline,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    // TODO: Backend delete logic
    console.log("Delete task:", task.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div>
      {/* Header mit Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Task Details</h2>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/50 text-destructive rounded-md hover:bg-destructive/10 transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* VIEW MODE */}
        {!isEditing ? (
          <>
            {/* Title + Deadline/Backlog - same line */}
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold flex-1">{task.title}</h3>

              {task.isBacklog ? (
                <Badge
                  variant="outline"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Backlog
                </Badge>
              ) : (
                <span className="text-sm font-medium whitespace-nowrap">
                  {task.deadline}
                </span>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <div className="max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-muted-foreground">
                  {task.description}
                </p>
              </div>
            )}

            {/* Domain + Priority Tags */}
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant="outline"
                className="text-xs capitalize gap-1"
                style={{
                  borderColor: domainColor,
                  color: domainColor,
                }}
              >
                <DomainIcon className="w-3 h-3" />
                {task.domain}
              </Badge>

              <Badge
                variant="outline"
                className="text-xs"
                style={{
                  borderColor: priorityStyle.borderColor,
                  color: priorityStyle.color,
                }}
              >
                {priorityStyle.label}
              </Badge>
            </div>
          </>
        ) : (
          /* EDIT MODE */
          <>
            {/* Title */}
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 text-base font-semibold bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Backlog Toggle + Date Input - below the title */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditIsBacklog(!editIsBacklog)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  editIsBacklog
                    ? "bg-muted text-foreground"
                    : "bg-transparent border border-border"
                }`}
              >
                Backlog
              </button>

              {!editIsBacklog && (
                <input
                  type="date"
                  value={editDeadline}
                  onChange={(e) => setEditDeadline(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
            </div>

            {/* Description */}
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              placeholder="Add a description..."
              className="w-full px-3 py-2 text-sm text-muted-foreground bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />

            {/* Domain + Priority Dropdowns */}
            <div className="flex items-center justify-between gap-2">
              <select
                value={editDomain}
                onChange={(e) => setEditDomain(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer capitalize"
              >
                {ALL_DOMAINS.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>

              <select
                value={editPriority}
                onChange={(e) =>
                  setEditPriority(e.target.value as "low" | "medium" | "high")
                }
                className="w-30 px-3 py-2 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer capitalize"
              >
                {PRIORITIES.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Project/Uni Module */}
        {!isEditing && task.project_id && (
          <div>
            <Badge variant="secondary" className="text-xs gap-1">
              <FolderKanban className="w-3 h-3" />
              Project: {task.project_id}
            </Badge>
          </div>
        )}

        {!isEditing && task.uni_module_id && (
          <div>
            <Badge variant="secondary" className="text-xs gap-1">
              <GraduationCap className="w-3 h-3" />
              Module: {task.uni_module_id}
            </Badge>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Delete Task?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
