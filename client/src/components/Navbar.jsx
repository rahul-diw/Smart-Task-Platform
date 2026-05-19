"use client"

export default function Navbar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">

      <div className="flex justify-between items-center px-6 py-3 rounded-2xl 
      bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg text-white">

        {/* Logo */}
        <h1 className="text-lg font-semibold tracking-wide">
          🚀 SmartTask
        </h1>

        {/* Links */}
        <div className="flex items-center gap-6">

          <a 
            href="/dashboard" 
            className="text-sm text-gray-300 hover:text-white transition"
          >
            Dashboard
          </a>

          <a 
            href="/login" 
            className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-sm font-medium hover:scale-105 transition"
          >
            Login
          </a>

        </div>

      </div>

    </div>
  );
}