"use client";

import React, { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  Users, 
  Image as ImageIcon, 
  Star,
  Home,
  FileText,
  Settings,
  Menu,
  X
} from "lucide-react";

export default function AdminLayoutClient({ user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarDays },
    { label: "Rooms & Pricing", href: "/admin/rooms", icon: BedDouble },
    { label: "Customers", href: "/admin/customers", icon: Users },
    { label: "Gallery Management", href: "/admin/gallery", icon: ImageIcon },
    { label: "Reviews Moderation", href: "/admin/reviews", icon: Star },
    { label: "Blogs Management", href: "/admin/blogs", icon: FileText },
  ];

  if (user && user.role === "ADMIN") {
    navItems.push({ label: "Settings", href: "/admin/settings", icon: Settings });
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937] overflow-hidden relative">
      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/55 z-30 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar - responsive drawer */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1F1914] text-[#FFF8E7] flex flex-col border-r border-[#D4AF37]/20 transform transition-transform duration-300 ease-in-out shrink-0 md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-[#D4AF37]/10 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold text-[#D4AF37] tracking-wide">
              साई विठ्ठल
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#FFF8E7]/60 uppercase mt-0.5">
              Dashboard
            </span>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 text-[#FFF8E7]/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-[#FFF8E7]/80 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#D4AF37] transition-all"
              >
                <Icon className="h-4 w-4 text-[#D4AF37]" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#D4AF37]/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-[#FFF8E7]">{user.name || "Invited Staff"}</span>
              <span className="text-[9px] font-mono text-emerald-400 capitalize">{user.role.replace("_", " ").toLowerCase()}</span>
            </div>
          </div>
          <a
            href="/"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#FFF8E7]/60 hover:text-white shrink-0"
            title="Go to main website"
          >
            <Home className="h-4 w-4" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 md:px-8 shrink-0">
          <div className="flex items-center gap-3">
            {/* Hamburger Button for mobile */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-1 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 md:hidden"
              title="Open Navigation"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-sm md:text-lg font-semibold text-gray-800 truncate">
              Welcome back, {user.name || "Invited Staff"}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] md:text-xs font-medium text-gray-500 shrink-0">
            <span>Role: <strong className="text-[#EA580C] uppercase">{user.role}</strong></span>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
