import React from "react";
import { redirect } from "next/navigation";
import Link from "next/navigation";
import { checkUser } from "@/lib/checkUser";

export const dynamic = "force-dynamic";
import { 
  LayoutDashboard, 
  CalendarDays, 
  BedDouble, 
  Users, 
  Image as ImageIcon, 
  Star,
  Home,
  LogOut,
  FileText,
  Settings
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export default async function AdminLayout({ children }) {
  const user = await checkUser();

  // Route protection
  if (!user || (user.role !== "ADMIN" && user.role !== "RECEPTION_STAFF")) {
    redirect("/");
  }

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
    <div className="flex min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F1914] text-[#FFF8E7] flex flex-col border-r border-[#D4AF37]/20 shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-[#D4AF37]/10 flex flex-col">
          <span className="font-serif text-lg font-bold text-[#D4AF37] tracking-wide">
            साई विठ्ठल
          </span>
          <span className="text-[10px] font-mono tracking-widest text-[#FFF8E7]/60 uppercase">
            Admin Dashboard
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-[#FFF8E7]/80 hover:bg-white/10 hover:text-white hover:border-l-4 hover:border-[#D4AF37] transition-all"
              >
                <Icon className="h-4 w-4 text-[#D4AF37]" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#D4AF37]/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-[#FFF8E7]">{user.name}</span>
              <span className="text-[9px] font-mono text-emerald-400 capitalize">{user.role.replace("_", " ").toLowerCase()}</span>
            </div>
          </div>
          <a
            href="/"
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#FFF8E7]/60 hover:text-white"
            title="Go to main website"
          >
            <Home className="h-4 w-4" />
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-gray-800">
            Welcome back, {user.name}
          </h1>
          <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
            <span>Role: <strong className="text-[#EA580C] uppercase">{user.role}</strong></span>
          </div>
        </header>

        <main className="p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
