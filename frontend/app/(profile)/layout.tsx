// app/dashboard/layout.tsx

"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// --- Data for navigation links ---
const navLinks = [
  { href: "/profile", label: "Subscriptions" },
  { href: "/packages", label: "Packages" },
  { href: "/oohservice", label: "OOH Service" },
];


const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* --- Mobile Menu Overlay --- */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* --- Sidebar --- */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#F0B100] p-6 text-white transition-transform duration-300 ease-in-out z-50 
                   md:translate-x-0 
                   ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold">My Account</h2>
          <button onClick={() => setIsMenuOpen(false)} className="md:hidden">
            <CloseIcon />
          </button>
        </div>

        <nav className="space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block p-2 rounded-md font-semibold capitalize transition-colors duration-200 ${
                  isActive ? "bg-black/20" : "hover:bg-black/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* --- Main Content with left margin on desktop --- */}
      <div className="flex-1 flex flex-col md:ml-64">
        <header className="flex items-center p-4 bg-white shadow-sm md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-gray-700"
          >
            <MenuIcon />
          </button>
          <span className="text-xl font-bold text-gray-800 ml-4">Dashboard</span>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}