"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p
          className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-8"
          style={{ fontFamily: "var(--font-space-mono)" }}
        >
          PopUp Admin
        </p>
        <h1
          className="font-playfair font-bold italic text-4xl text-white mb-12"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[10px] tracking-[0.2em] text-white/30 uppercase"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
              className="bg-transparent border-b border-white/15 py-3 text-white text-sm font-sans placeholder:text-white/20 focus:border-white focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <p
              className="text-[11px] text-white/50 tracking-wider"
              style={{ fontFamily: "var(--font-space-mono)" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="font-mono text-[11px] tracking-[0.2em] uppercase px-8 py-4 bg-white text-[#0A0A0A] hover:bg-white/85 transition-colors disabled:opacity-40"
            style={{ fontFamily: "var(--font-space-mono)" }}
          >
            {loading ? "Signing in..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
