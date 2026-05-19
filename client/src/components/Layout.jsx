"use client";

import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function Layout({ children }) {
  const [openMenu, setOpenMenu] = useState(false);

  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0b0b1a] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold mb-10">🚀 SmartTask</h2>

          <div className="flex flex-col gap-3">
            {/* Dashboard */}
            <a
              href="/dashboard"
              className={`flex items-center gap-3 p-3 rounded-xl transition ${
                pathname === "/dashboard"
                  ? "bg-purple-500 text-white"
                  : "hover:bg-white/10 text-gray-300"
              }`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </a>

            <Link href="/calendar">
              <div className="bg-white/5 hover:bg-purple-500 transition p-3 rounded-xl cursor-pointer">
                📅 Calendar
              </div>
            </Link>
          </div>
        </div>

        {/* Logout */}
        <button 
         onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
        className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-xl hover:scale-105 transition">
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition px-4 py-2 rounded-xl"
            >
              <User size={18} />
              Diwakar
              <ChevronDown size={16} />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-[#151528] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                <Link href="/profile">
                  <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition cursor-pointer">
                    <User size={18} />
                    Profile
                  </div>
                </Link>

                <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition cursor-pointer">
                  <Settings size={18} />
                  Settings
                </div>

                <div className="border-t border-white/10" />

                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/20 text-red-400 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111827",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        {children}
      </div>
    </div>
  );
}
