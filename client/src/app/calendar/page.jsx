"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

import "react-calendar/dist/Calendar.css";

import Layout from "@/components/Layout";
import { getTasks } from "@/services/api";

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : data.tasks || []);
      } catch (err) {
        console.log(err);
      }
    };

    loadTasks();
  }, []);

  const tasksForDate = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const taskDate = new Date(task.dueDate).toDateString();

    return taskDate === selectedDate.toDateString();
  });

  return (
    <Layout>
      <div className="p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Deadline Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CALENDAR */}
          <div className="bg-white/5 p-8 rounded-2xl flex justify-center">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileContent={({ date, view }) => {
                if (view === "month") {
                  const hasTask = tasks.some(
                    (task) =>
                      task.dueDate &&
                      new Date(task.dueDate).toDateString() ===
                        date.toDateString(),
                  );

                  return hasTask ? (
                    <div className="flex justify-center mt-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  ) : null;
                }
              }}
            />
          </div>

          {/* TASKS */}
          <div className="bg-white/5 p-5 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">
              Tasks for {selectedDate.toDateString()}
            </h2>

            <div className="space-y-3">
              {tasksForDate.length > 0 ? (
                tasksForDate.map((task) => (
                  <div key={task._id} className="bg-white/10 p-4 rounded-xl">
                    <p className="font-semibold">{task.title}</p>

                    <p className="text-sm text-gray-400">
                      Priority: {task.priority}
                    </p>

                    <p className="text-sm text-gray-400">
                      Status: {task.status}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No tasks for this day</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
