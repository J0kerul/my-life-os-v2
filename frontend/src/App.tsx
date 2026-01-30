import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TaskManager from "./pages/TaskManager";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    // Dark Mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
