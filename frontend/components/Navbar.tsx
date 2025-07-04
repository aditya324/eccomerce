// components/Navbar.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full  bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex  justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/sunrise-logo.png" alt="Logo" width={40} height={40} />
          {/* <span className="text-xl font-semibold text-green-700">
            sunrise <span className="text-yellow-500">Digital</span>
          </span> */}
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-1 mx-8 max-w-3xl">
          <div className="flex w-full rounded border border-gray-300 overflow-hidden">
            <input
              type="text"
              placeholder="What service are you looking for today?"
              className="w-full px-4 py-2 outline-none text-gray-700"
            />
            <button className="bg-yellow-500 px-4 text-white flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Icons */}
        <div className="hidden lg:flex items-center space-x-6 text-gray-700">
          <Heart className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
          <div className="relative cursor-pointer hover:text-yellow-500">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </div>
          <User className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
        </div>

        {/* Hamburger */}
        <button
          className="lg:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden px-4 pb-4 space-y-4">
          <div className="flex rounded border border-gray-300 overflow-hidden">
            <input
              type="text"
              placeholder="Search for a service..."
              className="w-full px-4 py-2 outline-none text-gray-700"
            />
            <button className="bg-yellow-500 px-4 text-white flex items-center justify-center">
              <Search className="w-5 h-5" />
            </button>
          </div>

          <div className="flex space-x-6 text-gray-700 text-xl">
            <Heart className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
            <div className="relative cursor-pointer hover:text-yellow-500">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </div>
            <User className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
          </div>
        </div>
      )}
    </nav>
  );
}
