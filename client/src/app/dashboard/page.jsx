"use client";

import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { getDashboardStats } from "@/services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  const totalTasks = stats?.totalTasks || 0;

  const completedTasks = stats?.completedTasks || 0;

  const pendingTasks = stats?.pendingTasks || 0;

  const inProgressTasks = stats?.inProgressTasks || 0;

  const chartData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.log("Dashboard error:", err);

        // ❗ agar token invalid hai
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    load();
  }, []);

  return (
    <Layout>
      <div className="bg-white/5 border border-white/10 rounded-3xl p-10 mb-10">
        <h2 className="text-2xl font-bold mb-10">Task Analytics</h2>

        <div className="flex items-center justify-between mt-10">
          {/* LEFT STATS */}
          <div className="space-y-16 p1-5">
            <div>
              <p className="text-gray-400 text-sm">Pending Tasks</p>

              <h2 className="text-5xl font-bold text-yellow-400">
                {pendingTasks}
              </h2>
            </div>

            <div>
              <p className="text-gray-400 text-sm">In Progress</p>

              <h2 className="text-5xl font-bold text-blue-400">
                {inProgressTasks}
              </h2>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Completed</p>

              <h2 className="text-5xl font-bold text-green-400">
                {completedTasks}
              </h2>
            </div>
          </div>

          {/* RIGHT CHART */}
          <div className="w-[450px] h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={140}
                  paddingAngle={5}
                >
                  <Cell fill="#facc15" />
                  <Cell fill="#60a5fa" />
                  <Cell fill="#4ade80" />
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <Link href="/workspace/69adaf506bc94b82dc86c3f5">
          <div
            className="
      bg-gradient-to-r
      from-purple-600
      to-indigo-600
      hover:scale-[1.02]
      transition-all
      duration-300
      rounded-3xl
      p-6
      mt-8
      cursor-pointer
      shadow-xl
    "
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Open Workspace
                </h2>

                <p className="text-white/70 mt-2">
                  Manage projects, tasks and deadlines
                </p>
              </div>

              <div className="text-5xl">🚀</div>
            </div>
          </div>
        </Link>
      </div>
    </Layout>
  );
}
