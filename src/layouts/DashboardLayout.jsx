import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <motion.main
        animate={{ marginLeft: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
        className="min-h-screen"
      >
        <div className="px-12 py-10 max-w-[1320px]">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
}
