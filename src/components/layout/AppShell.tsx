// ============================================================
// App Shell Layout (used by all dashboard pages)
// Provides the Sidebar + main content area structure.
// On mobile: Sidebar is hidden; content fills full width.
// ============================================================

"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useSocketUpdates } from "@/hooks/useSocketUpdates";
import { Menu, X } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Socket.IO listener for real-time transaction updates
  useSocketUpdates();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Mobile Header (only visible on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-[100]">
        <a href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-sm italic">R</span>
          </div>
          <span className="text-black font-extrabold text-lg tracking-tight">RemitLand</span>
        </a>
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -mr-2 text-gray-500 hover:text-black transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar Overlay (mobile only) */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop (hidden on mobile) & Mobile Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform md:translate-x-0 md:static md:block flex-shrink-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">
        {children}
      </main>
    </div>
  );
}
