import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header bar */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Dynamic Page content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
