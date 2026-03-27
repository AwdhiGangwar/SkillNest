import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 max-w-2xl animate-slide-up">
        <div className="space-y-4">
          <div className="inline-flex w-20 h-20 rounded-3xl bg-brand-500 items-center justify-center text-white font-bold text-3xl shadow-lg shadow-brand-500/25 mb-4">
            SN
          </div>
          <h1 className="text-6xl font-display font-bold tracking-tight">
            SkillNest
          </h1>
          <p className="text-xl text-slate-400 max-w-lg mx-auto leading-relaxed">
            Empowering the next generation of learners and educators. Join our community today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="btn-primary px-8 py-3 rounded-xl text-lg min-w-[160px]"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-xl text-lg font-semibold bg-surface-card border border-surface-border hover:bg-surface-hover hover:border-slate-500 transition-all min-w-[160px]"
          >
            Register
          </Link>
        </div>

        <div className="pt-8 border-t border-surface-border/50 w-full max-w-sm mx-auto">
          <p className="text-slate-500 mb-3 text-sm">Are you an expert?</p>
          <Link
            to="/join-teacher"
            className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors font-medium group"
          >
            Join as a Teacher
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}