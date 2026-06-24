"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");

  function login() {
    if (password === "Mabon2026!") {
      document.cookie = "mabon_admin=approved; path=/";
      window.location.href = "/admin/submissions";
    } else {
      alert("Incorrect password.");
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-zinc-950 border border-yellow-500/20 rounded-3xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-black text-white mb-2">
          MaBon Staff Login
        </h1>

        <p className="text-zinc-400 mb-8">
          Authorized personnel only.
        </p>

        <input
          type="password"
          placeholder="Staff Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-black border border-zinc-700 text-white"
        />

        <button
          onClick={login}
          className="w-full mt-6 bg-yellow-500 text-black font-bold rounded-xl py-4"
        >
          Login
        </button>
      </div>
    </main>
  );
}