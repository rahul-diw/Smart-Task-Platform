import Navbar from "@/components/Navbar";

export default function Home() {
  return (

    <div className="min-h-screen bg-[#0b0b1a] flex items-center justify-center relative overflow-hidden">

      <>
      <Navbar />
      {/* tumhara home UI */}
      </> 

      {/* 🔥 Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 opacity-30 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
      <div className="absolute w-[500px] h-[500px] bg-indigo-600 opacity-30 blur-[120px] rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>

      {/* 🔥 Main Container */}
      <div className="relative z-10 w-[90%] max-w-6xl bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10">

        {/* Heading */}
        <div className="text-center mb-10 text-white">
          <h1 className="text-6xl font-bold mb-4">
            Next Gen Task Manager 🚀
          </h1>
          <p className="text-gray-400">
            Manage tasks, projects and teams with a modern experience
          </p>
        </div>

        {/* 🔥 3D Preview Section */}
        <div className="grid grid-cols-2 gap-10 items-center">

          {/* Left text */}
          <div className="text-white">
            <h2 className="text-3xl font-semibold mb-4">
              Visualize Your Workflow
            </h2>
            <p className="text-gray-400 mb-6">
              Organize tasks in a clean Kanban board with real-time updates.
            </p>

            <a href="/login">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 rounded-full hover:scale-105 transition">
                Get Started
              </button>
            </a>
          </div>

          {/* Right 3D card */}
          <div className="transform hover:rotate-2 hover:scale-105 transition duration-500">

            <div className="bg-[#111827] p-6 rounded-2xl shadow-2xl border border-white/10">

              {/* Fake App UI */}
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-white text-sm">

                {["Pending","Progress","Done"].map((col)=>(
                  <div key={col} className="bg-black/40 p-3 rounded-lg">

                    <h3 className="mb-2 text-gray-300">{col}</h3>

                    <div className="space-y-2">
                      <div className="bg-white/10 p-2 rounded">Task 1</div>
                      <div className="bg-white/10 p-2 rounded">Task 2</div>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}