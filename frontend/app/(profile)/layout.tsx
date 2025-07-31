// app/dashboard/layout.tsx

'use client'; // Required to use hooks like usePathname

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Define navigation links as an array for easier mapping
const navLinks = [
  { href: '/profile', label: 'subscriptions' },
  { href: '/subscriptions', label: 'packages' },
  
];

const DashboardNav = () => {
  // Get the current path from the URL
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#F0B100] p-6 flex-shrink-0">
      <h2 className="text-xl font-bold text-white mb-6">My Account</h2>
      <nav className="space-y-2">
        {navLinks.map((link) => {
          // Check if the current link is the active one
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.label}
              href={link.href}
              // Conditionally apply active or inactive styles
              className={`block p-2 rounded-md font-semibold ${
                isActive
                  ? 'bg-yellow-100 text-black' // Active styles
                  : 'text-slate-300 hover:bg-slate-700/50' // Inactive styles
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen ">
      <DashboardNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}