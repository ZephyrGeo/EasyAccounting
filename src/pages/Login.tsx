import React from "react";
import { Navigate } from "react-router-dom";
import { Snowflake, ShieldCheck, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const { user, isLoading, signInWithGoogle } = useAuth();

  // If already logged in, redirect to dashboard
  if (!isLoading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0F1A] overflow-hidden">
      {/* 1. Header Area (Standalone Top-Left Logo) */}
      <header className="w-full px-8 md:px-12 py-8 md:py-12 relative z-20">
        <div className="flex items-center group cursor-default w-fit">
          <div className="w-10 h-10 flex items-center justify-center transform group-hover:rotate-[15deg] transition-all duration-500">
            <img src="/favicon.svg" alt="SnowFlake Logo" className="w-8 h-8" />
          </div>
          <span className="text-[22px] font-medium text-slate-900 dark:text-white font-serif tracking-tight">
            SnowFlake
          </span>
        </div>
      </header>

      {/* 2. Main Content Area (Two Columns) */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center px-8 md:px-12 pb-12 relative z-10">
        {/* Left Column: Slogan */}
        <div className="flex-1 flex flex-col justify-center max-w-2xl mb-12 md:mb-0">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <h2 className="text-4xl md:text-6xl font-medium text-slate-900 dark:text-white font-serif leading-[1.15] mb-6">
              Track your <br />
              <span style={{ color: "#5dd6f4" }}>finances</span> with <br />
              absolute <span className="italic">clarity.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Pure, simple, and intelligent expense tracking for the modern era. Experience financial peace of mind.
            </p>

            <div className="mt-10 flex items-center gap-4 text-slate-400 dark:text-slate-500">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-[#0B0F1A] bg-slate-200 dark:bg-slate-800"
                  />
                ))}
              </div>
              <span className="text-sm font-medium">Joined by 2,000+ users this month</span>
            </div>
          </div>
        </div>

        {/* Right Column: Login Card */}
        <div className="w-full md:w-[450px] flex justify-center items-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div className="w-full bg-slate-50/50 dark:bg-slate-900/40 backdrop-blur-sm p-8 md:p-12 rounded-[32px] border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/10 dark:shadow-none">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Welcome back</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Please sign in to access your dashboard.</p>

            <button
              onClick={signInWithGoogle}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white dark:bg-[#2A2A2A] text-[#1A1A1A] dark:text-white border border-[#E5E5E0] dark:border-[#444444] rounded-xl text-[15px] font-medium hover:bg-[#F7F7F3] dark:hover:bg-[#333333] hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            <div className="mt-10 flex items-center justify-center gap-3 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Protected by Supabase RLS
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10" />
    </div>
  );
}
