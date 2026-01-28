import { useState } from "react";
import { X, Save, CalendarIcon } from "lucide-react";
import { ALL_DOMAINS } from "@/constants";
import type { Task } from "@/types";
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
import { taskService } from "@/services/taskService";

type TaskEditViewProps = {
  task: Task;
  onCancel: () => void;
  onSave: (task: Task) => void;
  onDelete: (taskId: string) => void;
};

const PRIORITIES = ["low", "medium", "high"] as const;

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

export function TaskEditView({ task, onCancel, onSave }: TaskEditViewProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [domain, setDomain] = useState(task.domain);
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task.priority,
  );
  const [isBacklog, setIsBacklog] = useState(task.isBacklog);
  const [deadline, setDeadline] = useState(task.deadline || "");

  const handleSubmit = async () => {
    if (!title.trim()) return;
    if (!isBacklog && !deadline) return;

    try {
      const updatedTask = await taskService.updateTask(task.id, {
        title,
        description: description || undefined,
        domain,
        priority,
        isBacklog,
        deadline: isBacklog ? null : deadline || undefined,
      });
      onSave(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
      alert("Failed to update task");
    }
  };

  const selectedDate = stringToDate(deadline);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Edit Task</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {/* Title */}
        <div>
          <label className="text-sm font-medium mb-2 block">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Backlog Toggle + Date Picker */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              const newBacklogState = !isBacklog;
              setIsBacklog(newBacklogState);
              if (newBacklogState) {
                setDeadline("");
              }
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
              isBacklog
                ? "bg-muted text-foreground"
                : "bg-transparent border border-border"
            }`}
          >
            Backlog
          </button>

          {!isBacklog && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-between px-3 py-1.5 text-sm bg-background border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
                >
                  {selectedDate ? (
                    format(selectedDate, "dd.MM.yyyy", { locale: de })
                  ) : (
                    <span className="text-muted-foreground">Pick a date</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0"
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setDeadline(dateToString(date))}
                  locale={de}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add a description..."
            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Domain + Priority */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Domain</label>
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="w-full cursor-pointer text-sm capitalize">
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4}>
                {ALL_DOMAINS.map((d) => (
                  <SelectItem key={d} value={d} className="capitalize">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Priority</label>
            <Select
              value={priority}
              onValueChange={(value) =>
                setPriority(value as "low" | "medium" | "high")
              }
            >
              <SelectTrigger className="w-full cursor-pointer text-sm capitalize">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4}>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p} className="capitalize">
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCancel();
          }}
          className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleSubmit();
          }}
          disabled={!title.trim() || (!isBacklog && !deadline)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
