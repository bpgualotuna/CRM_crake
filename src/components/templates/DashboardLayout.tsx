import React, { useState } from 'react';
import { TopNavbar } from '../organisms/TopNavbar';
import { SidebarNav } from '../organisms/SidebarNav';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-[#F9FAFB] flex flex-col antialiased selection:bg-[#E50914] selection:text-white transition-colors duration-200">
      {/* Persistent Top Navbar */}
      <TopNavbar />

      {/* Main Container with Sidebar + Content Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Sidebar */}
        <SidebarNav
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />

        {/* Dynamic Center Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-[#090D16] relative transition-colors duration-200">
          <div className="max-w-[1600px] mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
