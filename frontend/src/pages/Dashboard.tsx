import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../components/Sidebar";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="p-6">
        {/* Burger Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-muted rounded-md transition-colors cursor-pointer mb-6"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg">
              <h2 className="text-xl font-semibold mb-2">
                Welcome to MyLifeOS 2.0
              </h2>
              <p className="text-muted-foreground">
                Your personal life management system is ready!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
