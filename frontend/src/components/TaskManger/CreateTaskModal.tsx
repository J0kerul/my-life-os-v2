import { useState } from "react";
import { Card } from "@/components/ui/card";
import { X, Save } from "lucide-react";
import { ALL_DOMAINS } from "@/constants";
import type { Task } from "@/types";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void;
};

const PRIORITIES = ["low", "medium", "high"] as const;

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState("personal");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [isBacklog, setIsBacklog] = useState(false);
  const [deadline, setDeadline] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    onCreateTask({
      title,
      description: description || undefined,
      completed: false,
      priority,
      domain,
      isBacklog,
      deadline: isBacklog ? undefined : deadline,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDomain("personal");
    setPriority("medium");
    setIsBacklog(false);
    setDeadline("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Create New Task</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title..."
              className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Backlog Toggle + Date Input */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBacklog(!isBacklog)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                isBacklog
                  ? "bg-muted text-foreground"
                  : "bg-transparent border border-border"
              }`}
            >
              Backlog
            </button>

            {!isBacklog && (
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="flex-1 px-3 py-1.5 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
            />
          </div>

          {/* Domain + Priority */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Domain</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer capitalize"
              >
                {ALL_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer capitalize"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Create Task
          </button>
        </div>
      </Card>
    </div>
  );
}
