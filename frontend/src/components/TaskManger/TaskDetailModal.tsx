import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Trash2 } from "lucide-react";
import { DOMAIN_COLORS, DOMAIN_ICONS } from "@/constants";
import type { Task } from "@/types";
import { Briefcase } from "lucide-react";

type TaskDetailModalProps = {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const formatDateGerman = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "#EF4444";
    case "medium":
      return "#F59E0B";
    case "low":
      return "#10B981";
    default:
      return "#6B7280";
  }
};

export function TaskDetailModal({
  isOpen,
  task,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailModalProps) {
  if (!isOpen || !task) return null;

  const domainColor = DOMAIN_COLORS[task.domain] || "#6B7280";
  const DomainIcon =
    DOMAIN_ICONS[task.domain as keyof typeof DOMAIN_ICONS] || Briefcase;
  const priorityColor = getPriorityColor(task.priority);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Task Details</h2>
          <div className="flex items-center gap-2">
            {/* Edit Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
              title="Edit task"
            >
              <Edit className="w-5 h-5" />
            </button>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Title and Deadline Row */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{task.title}</h2>
          </div>
          {task.deadline && !task.isBacklog && (
            <div className="text-right shrink-0">
              <p className="text-sm text-muted-foreground mb-1">Deadline</p>
              <p className="text-lg font-semibold">
                {formatDateGerman(task.deadline)}
              </p>
            </div>
          )}
        </div>

        {/* Domain and Priority Row */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div>
            <Badge
              variant="outline"
              className="text-sm capitalize gap-1.5"
              style={{
                borderColor: domainColor,
                color: domainColor,
              }}
            >
              <DomainIcon className="w-4 h-4" />
              {task.domain}
            </Badge>
          </div>
          <div>
            <Badge
              variant="outline"
              className="text-sm capitalize font-semibold"
              style={{
                borderColor: priorityColor,
                color: priorityColor,
              }}
            >
              {task.priority}
            </Badge>
          </div>
        </div>

        {/* Additional Badges */}
        {(task.isBacklog || task.completed) && (
          <div className="flex items-center gap-2 mb-6">
            {task.isBacklog && (
              <Badge variant="outline" className="text-sm">
                Backlog
              </Badge>
            )}
            {task.completed && (
              <Badge
                variant="outline"
                className="text-sm bg-green-500/10 text-green-500 border-green-500"
              >
                Completed
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {task.description && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {task.description}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
