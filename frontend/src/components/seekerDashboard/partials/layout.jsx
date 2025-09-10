import { useState } from "react";
import Navbar from "../partials/navbar";
import Sidebar from "../partials/sidebar";

export default function Layout({ children }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); 

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (

    <div>
      {/* Sidebar */}
      <div className="relative">
        <Sidebar isOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />
      </div>
      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isSidebarOpen ? "md:ml-[300px]" : "ml-0"
        }`}
      >
        {/* Pass toggle function to Navbar */}
        <Navbar onSidebarToggle={handleSidebarToggle} />

        {/* Content Wrapper */}
        <main className="flex-1 bg-gray-50 pt-16 p-6 pl-0" >{children}</main>
      </div>
    </div>
  );
}
