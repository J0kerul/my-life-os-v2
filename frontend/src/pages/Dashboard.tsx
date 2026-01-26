import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/Dashboard/DashboardHeader";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="min-h-screen bg-background p-6">
        {/* Header mit Burger Button */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto pl-32 pr-32">
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
    </>
  );
}

export default Dashboard;
