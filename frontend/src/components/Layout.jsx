// src/components/Layout.jsx
import React from "react";
import Sidebar from "./Sidebar";

export default function Layout({ children, title, subtitle, actions }) {
  return (
    <div className="flex min-h-screen bg-surface text-white">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          {(title || actions) && (
            <div className="flex items-start justify-between mb-8">
              <div>
                {title && (
                  <h1 className="text-2xl font-display font-bold text-white">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
