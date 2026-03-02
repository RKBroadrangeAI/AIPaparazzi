"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Shirt } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid credentials");
        setLoading(false);
        return;
      }

      const roleRoutes: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        MANAGER: "/dashboard/manager",
        CONSULTANT: "/dashboard/consultant",
      };
      router.push(roleRoutes[data.user.role] ?? "/dashboard/consultant");
      router.refresh();
    } catch {
      setError("Connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md px-6">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="flex size-[72px] items-center justify-center rounded-2xl bg-[#C8658E]/10">
            <Shirt className="size-9 text-[#C8658E]" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-[#C8658E]">
              Paparazzi by Biz
            </h1>
            <p className="mt-1 text-sm text-[#666]">
              Fashion Intelligence CRM
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-[#666]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                placeholder="you@paparazzibybiz.com"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-[#999] focus:outline-none focus:border-[#C8658E]/30 focus:ring-1 focus:ring-[#C8658E]/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-[#666]">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black placeholder:text-[#999] focus:outline-none focus:border-[#C8658E]/30 focus:ring-1 focus:ring-[#C8658E]/20"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C8658E] px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-[#A84D73] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Lock className="size-4" />
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-[#999]">
          Authorized personnel only. Contact your admin for access.
        </p>
      </div>
    </div>
  );
}
