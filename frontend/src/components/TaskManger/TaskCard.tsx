import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DOMAIN_COLORS, DOMAIN_ICONS } from "@/constants";
import { Briefcase } from "lucide-react";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  domain: string;
  deadline?: string;
  isBacklog: boolean;
};

type TaskCardProps = {
  task: Task;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
};

const getPriorityStyle = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "high":
      return { color: "#EF4444", borderColor: "#EF4444" };
    case "medium":
      return { color: "#F59E0B", borderColor: "#F59E0B" };
    case "low":
      return { color: "#10B981", borderColor: "#10B981" };
  }
};

// Format date from YYYY-MM-DD to DD.MM.YYYY
const formatDateGerman = (dateString: string): string => {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

const getDeadlineDisplay = (deadline: string) => {
  const today = new Date();
  const taskDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  taskDate.setHours(0, 0, 0, 0);

  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: "OVERDUE",
      color: "#EF4444",
      isCritical: true,
    };
  } else if (diffDays === 0) {
    return {
      text: "today",
      color: "#EF4444",
      isCritical: true,
    };
  } else if (diffDays === 1) {
    return {
      text: "tomorrow",
      color: "#F59E0B",
      isCritical: false,
    };
  } else {
    return {
      text: `Due ${formatDateGerman(deadline)}`,
      color: "inherit",
      isCritical: false,
    };
  }
};

export function TaskCard({
  task,
  isSelected,
  onToggle,
  onSelect,
}: TaskCardProps) {
  const domainColor = DOMAIN_COLORS[task.domain] || "#6B7280";
  const DomainIcon =
    DOMAIN_ICONS[task.domain as keyof typeof DOMAIN_ICONS] || Briefcase;
  const priorityStyle = getPriorityStyle(task.priority);
  const deadlineDisplay = task.deadline
    ? getDeadlineDisplay(task.deadline)
    : null;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-center gap-3">
        {/* Checkbox - with cursor pointer */}
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          onClick={(e) => e.stopPropagation()}
          className={`cursor-pointer ${!task.completed ? "border-gray-500" : ""}`}
        />

        {/* Priority Bar */}
        <div
          className="w-1 h-4 rounded-full"
          style={{ backgroundColor: priorityStyle.color }}
        />

        {/* Title */}
        <p
          className={`text-sm font-medium shrink-0 ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.title}
        </p>

        {/* Domain Badge with Icon */}
        <Badge
          variant="outline"
          className="text-xs capitalize gap-1 mx-3"
          style={{
            borderColor: domainColor,
            color: domainColor,
          }}
        >
          <DomainIcon className="w-3 h-3" />
          {task.domain}
        </Badge>

        {/* Deadline - far right */}
        {deadlineDisplay && (
          <p
            className={`text-xs whitespace-nowrap ml-auto ${
              deadlineDisplay.isCritical ? "font-bold" : ""
            }`}
            style={{ color: deadlineDisplay.color }}
          >
            {deadlineDisplay.text}
          </p>
        )}
      </div>
    </Card>
  );
}
