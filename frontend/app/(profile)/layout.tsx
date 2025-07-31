// app/dashboard/layout.tsx

import React from 'react';

const DashboardNav = () => (
    <aside className="w-64 bg-[#F0B100] p-6 flex-shrink-0">
        <h2 className="text-xl font-bold text-white mb-6">My Account</h2>
        <nav className="space-y-2">
            <a href="/dashboard" className="block p-2 rounded-md font-semibold bg-indigo-600 text-white">Dashboard</a>
            <a href="/subscriptions" className="block p-2 rounded-md hover:bg-slate-700/50 text-slate-300">Subscriptions</a>
            <a href="#" className="block p-2 rounded-md hover:bg-slate-700/50 text-slate-300">Billing</a>
            <a href="#" className="block p-2 rounded-md hover:bg-slate-700/50 text-slate-300">Settings</a>
        </nav>
    </aside>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ">
      <DashboardNav />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}