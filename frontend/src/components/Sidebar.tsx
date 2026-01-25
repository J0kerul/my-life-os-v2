import { X, ChevronDown, ChevronRight, Home, CheckSquare } from "lucide-react";
import { JokerIcon } from "./icons/JokerIcon";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const location = useLocation();

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((c) => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const categories = [
    {
      name: "Home",
      items: [{ name: "Dashboard", path: "/", icon: Home }],
    },
    {
      name: "Productivity",
      items: [{ name: "Task Manager", path: "/tasks", icon: CheckSquare }],
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <JokerIcon size={24} className="text-primary" />
              <h1 className="text-xl font-bold">JOKER'S HUB</h1>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-muted rounded-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          {categories.map((category) => {
            const isExpanded = expandedCategories.includes(category.name);

            return (
              <div key={category.name}>
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors cursor-pointer"
                >
                  <span>{category.name}</span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;

                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={onClose}
                          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer ${
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "hover:bg-muted"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
