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
  CalendarIcon,
} from "lucide-react";
import type { Task } from "@/types";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { taskService } from "@/services/taskService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type TaskDetailViewProps = {
  task: Task | null;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
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

// Format date from YYYY-MM-DD to DD.MM.YYYY
const formatDateGerman = (dateString: string | undefined): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

// Convert YYYY-MM-DD to Date object
const stringToDate = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const [year, month, day] = dateString.split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

// Convert Date to YYYY-MM-DD
const dateToString = (date: Date | undefined): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function TaskDetailView({
  task,
  onTaskUpdated,
  onTaskDeleted,
}: TaskDetailViewProps) {
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

  const handleUpdate = async () => {
    if (!editTitle.trim()) return;

    try {
      const updatedTask = await taskService.updateTask(task.id, {
        title: editTitle,
        description: editDescription || undefined,
        domain: editDomain,
        priority: editPriority,
        isBacklog: editIsBacklog,
        deadline: editIsBacklog ? null : editDeadline || undefined,
      });

      onTaskUpdated(updatedTask);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  const handleDelete = async () => {
    try {
      await taskService.deleteTask(task.id);
      onTaskDeleted(task.id);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  const selectedDate = stringToDate(editDeadline);

  return (
    <div>
      {/* Header mit Buttons */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Task Details</h2>

        {!isEditing && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-destructive/50 text-destructive rounded-md hover:bg-destructive/10 transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content - ohne extra Card border */}
      <div className="space-y-4">
        {/* VIEW MODE */}
        {!isEditing ? (
          <>
            {/* Title + Deadline/Backlog - selbe Zeile */}
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
                  {formatDateGerman(task.deadline)}
                </span>
              )}
            </div>

            {/* Description - MIT SCROLL LIMIT UND ZEILENUMBRÜCHEN */}
            {task.description && (
              <div className="max-h-32 overflow-y-auto custom-scrollbar">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
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
            {/* Title - volle Breite */}
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 text-base font-semibold bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Backlog Toggle + Date Picker - unter dem Titel */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const newBacklogState = !editIsBacklog;
                  setEditIsBacklog(newBacklogState);
                  if (newBacklogState) {
                    setEditDeadline("");
                  }
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  editIsBacklog
                    ? "bg-muted text-foreground"
                    : "bg-transparent border border-border"
                }`}
              >
                Backlog
              </button>

              {!editIsBacklog && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex-1 flex items-center justify-between px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors cursor-pointer">
                      {selectedDate ? (
                        format(selectedDate, "dd.MM.yyyy", { locale: de })
                      ) : (
                        <span className="text-muted-foreground">
                          Pick a date
                        </span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setEditDeadline(dateToString(date))}
                      locale={de}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              {/* Domain Select */}
              <Select value={editDomain} onValueChange={setEditDomain}>
                <SelectTrigger className="flex-1 cursor-pointer text-xs capitalize">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {ALL_DOMAINS.map((domain) => (
                    <SelectItem
                      key={domain}
                      value={domain}
                      className="capitalize"
                    >
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Priority Select */}
              <Select
                value={editPriority}
                onValueChange={(value) =>
                  setEditPriority(value as "low" | "medium" | "high")
                }
              >
                <SelectTrigger className="w-32 cursor-pointer text-xs capitalize">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {PRIORITIES.map((priority) => (
                    <SelectItem
                      key={priority}
                      value={priority}
                      className="capitalize"
                    >
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Save/Cancel Buttons */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all font-medium cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted active:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border transition-all cursor-pointer"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* Projekt/Uni Modul - nur in View Mode */}
        {!isEditing && task.projectId && (
          <div>
            <Badge variant="secondary" className="text-xs gap-1">
              <FolderKanban className="w-3 h-3" />
              Project: {task.projectId}
            </Badge>
          </div>
        )}

        {!isEditing && task.uniModuleId && (
          <div>
            <Badge variant="secondary" className="text-xs gap-1">
              <GraduationCap className="w-3 h-3" />
              Module: {task.uniModuleId}
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
                className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium cursor-pointer"
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
