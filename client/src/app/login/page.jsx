"use client"

import { useState } from "react";
import { loginUser } from "@/services/api";
import Navbar from "@/components/Navbar";

export default function LoginPage(){

 const [email,setEmail]=useState("");
 const [password,setPassword]=useState("");

const handleLogin = async () => {
  const data = await loginUser(email, password);

  if (data.accessToken && data.refreshToken) {
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    window.location.href = "/dashboard";
  }
};

 return(

  <div className="min-h-screen bg-[#0b0b1a] flex items-center justify-center relative overflow-hidden">
    <Navbar />

    {/* Glow */}
    <div className="absolute w-[400px] h-[400px] bg-purple-600 opacity-30 blur-[100px] rounded-full"></div>

    {/* Card */}
    <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">

      <h2 className="text-3xl font-bold mb-6 text-center">
        Welcome Back 🔐
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full p-3 mb-4 rounded-lg bg-white/10 border border-white/20"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full p-3 mb-6 rounded-lg bg-white/10 border border-white/20"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 py-3 rounded-lg hover:scale-105 transition"
      >
        Login
      </button>

    </div>

  </div>

 )
}