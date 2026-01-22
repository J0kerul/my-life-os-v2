import { Menu } from "lucide-react";

export function TaskManagerHeader() {
  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
      {/* Left: Burger Menu */}
      <button
        onClick={() => {
          // TODO: Open sidebar
          console.log("Open sidebar");
        }}
        className="p-2 hover:bg-muted rounded-md transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Center: Title */}
      <h1 className="text-2xl font-bold">Task Manager</h1>

      {/* Right: Placeholder */}
      <div className="w-10" />
    </div>
  );
}
