"use client";

import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { getMe } from "@/services/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await getMe();
    setUser(data);
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">

        <div className="bg-white/5 rounded-3xl p-8 border border-white/10">

          <div className="flex items-center gap-6">

            {/* IMAGE */}
            <img
              src={
                user.profilePic
                  ? `http://localhost:5000/uploads/${user.profilePic}`
                  : "https://ui-avatars.com/api/?name=" + user.name
              }
              className="w-28 h-28 rounded-full object-cover"
            />

            {/* INFO */}
            <div>
              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>

              <p className="text-gray-400 mt-2">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}