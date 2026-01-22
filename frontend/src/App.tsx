import { useState } from "react";
import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TaskManager from "./pages/TaskManager";

function App() {
  useEffect(() => {
    // Dark Mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen">
      <TaskManager />
    </div>
  );
}

export default App;
