"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Hexagon } from "lucide-react";

const inputCls = "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors bg-white";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center gap-2.5">
          <div className="bg-white/20 rounded-xl p-1.5">
            <Hexagon className="size-6 text-white fill-white" />
          </div>
          <span className="text-white font-bold text-xl">Enterprise Core</span>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome back to<br />your workspace
            </h1>
            <p className="text-blue-100 text-base leading-relaxed">
              Manage your team, track performance, and make data-driven decisions — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[["98%", "Uptime"], ["50K+", "Users"], ["4.9★", "Rating"]].map(([val, lbl]) => (
              <div key={lbl} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-blue-200 mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-blue-300 text-xs relative">© 2025 Enterprise Core. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#F8F9FD]">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Hexagon className="size-5 text-white fill-white" />
            </div>
            <span className="font-bold text-lg text-gray-900">Enterprise Core</span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="mb-7">
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="text-gray-500 mt-1 text-sm">Enter your credentials to access the dashboard</p>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm hover:bg-gray-50 transition-colors font-medium">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm hover:bg-gray-50 transition-colors font-medium">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gray-50" />
              <span className="text-xs text-gray-500">or continue with email</span>
              <div className="flex-1 h-px bg-gray-50" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">Email</label>
                <input type="email" required placeholder="admin@example.com" className={inputCls} />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-900">Password</label>
                  <Link href="/auth/recover-password" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} required placeholder="••••••••" className={inputCls + " pr-10"} />
                  <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-500">
                    {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" style={{ accentColor: "#2563eb" }} className="size-4 rounded" />
                <span className="text-sm text-gray-500">Remember me for 30 days</span>
              </label>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm">
                {loading ? <><span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</> : "Sign in"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
