import { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/Dashboard/DashboardHeader";
import { BacklogWidget } from "../components/Dashboard/BacklogWidget";
import { UpcomingTasksWidget } from "../components/Dashboard/UpcomingTasksWidget";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="min-h-screen bg-background p-6">
        {/* Header mit Burger Button */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Content */}
        <div className="px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upcoming Tasks Widget - JETZT LINKS */}
            <UpcomingTasksWidget
              refreshTrigger={refreshTrigger}
              onRefresh={handleRefresh}
            />

            {/* Backlog Widget - JETZT RECHTS */}
            <BacklogWidget
              refreshTrigger={refreshTrigger}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
