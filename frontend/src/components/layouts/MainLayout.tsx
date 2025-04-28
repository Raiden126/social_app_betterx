// src/layouts/MainLayout.tsx
import Sidebar from "../common/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-black-50">{children}</div>
    </div>
  );
};

export default MainLayout;
