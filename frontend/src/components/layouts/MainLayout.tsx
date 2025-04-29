import { useState } from "react";
import Sidebar from "@/components/common/Sidebar";
import Navbar from "@/components/common/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* Always on top */}
      <Navbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* Content under navbar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
