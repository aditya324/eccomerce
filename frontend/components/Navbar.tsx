"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import debounce from "lodash.debounce";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  User,
} from "lucide-react";
import { BASEURL } from "@/constants";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
   const [isLoggedIn, setIsLoggedIn] = useState(false);


    useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${BASEURL}/users/check`, {
          withCredentials: true, // ✅ send cookies
        });
        setIsLoggedIn(res.data.isLoggedIn);
        console.log(res)
      } catch (error) {
        setIsLoggedIn(false); // fallback
      }
    };

    checkLogin();
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(
          `${BASEURL}/service/search?q=${encodeURIComponent(searchTerm)}`
        );
        setResults(res.data?.service || []);
      } catch (error) {
        console.error("Search failed:", error);
      }
    }, 500),
    []
  );

  // Trigger debounced search
  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query, debouncedSearch]);

  return (
    <nav className="w-full bg-white z-50 relative">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/sunrise-logo.png" alt="Logo" width={40} height={40} />
        </Link>

        {/* Desktop Search Bar */}
        <div className="hidden lg:flex flex-col flex-1 mx-8 max-w-3xl relative">
          <div className="flex w-full rounded border border-gray-300 overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What service are you looking for today?"
              className="w-full px-4 py-2 outline-none text-gray-700"
            />
            <button
              className="bg-yellow-500 px-4 text-white flex items-center justify-center"
              onClick={() => debouncedSearch.flush()}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Search Results */}
          {results.length > 0 && (
            <div className="absolute top-full mt-2 bg-white border rounded shadow w-full z-50 max-h-64 overflow-y-auto">
              {results.map((service) => (
                <Link
                  key={service._id}
                  href={`/service/${service._id}`}
                  className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100"
                >
                  <img
                    src={service.thumbnail}
                    alt={service.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{service.title}</h4>
                    <p className="text-sm text-gray-500">₹{service.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Icons */}
       <div className="hidden lg:flex items-center space-x-6 text-gray-700">
  {isLoggedIn ? (
    <>
      <Heart className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
      <div className="relative cursor-pointer hover:text-yellow-500">
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-2 -right-2 text-xs bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
          2
        </span>
      </div>
      <User className="w-6 h-6 cursor-pointer hover:text-yellow-500" />
    </>
  ) : (
    <Link
      href="/login"
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
    >
      Login
    </Link>
  )}
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
          <div className="flex flex-col relative">
            <div className="flex rounded border border-gray-300 overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for a service..."
                className="w-full px-4 py-2 outline-none text-gray-700"
              />
              <button
                className="bg-yellow-500 px-4 text-white flex items-center justify-center"
                onClick={() => debouncedSearch.flush()}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Results */}
            {results.length > 0 && (
              <div className="mt-2 bg-white border rounded shadow w-full z-50 max-h-64 overflow-y-auto">
                {results.map((service) => (
                  <Link
                    key={service._id}
                    href={`/services/${service.slug}`}
                    className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100"
                  >
                    <Image
                      src={service.thumbnail}
                      alt={service.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{service.title}</h4>
                      <p className="text-sm text-gray-500">₹{service.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
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
