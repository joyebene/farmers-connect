"use client";

import React, { useState } from 'react';
import Header from '@/component/layout/Header';
import Sidebar from '@/component/layout/Sidebar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-green-50 min-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />
      <div className="flex-1 flex flex-col lg:ml-64">
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;