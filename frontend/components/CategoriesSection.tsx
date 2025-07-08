"use client";

import { useCategories } from "@/hooks/useCategories";
import { useCategoryServices } from "@/hooks/useCategoryServices";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CategoriesSection() {
  const { data, isLoading, error } = useCategories();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const { services, isLoading: servicesLoading } = useCategoryServices(activeSlug || undefined);

  if (isLoading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Failed to load categories</p>;

  return (
    <div className="py-8">
      <div className="flex justify-center font-bold text-2xl md:text-3xl font-quicksand mb-6">
        <p>Browse Categories</p>
      </div>

      <div className="flex flex-wrap justify-between gap-10 px-12 text-gray-800 font-medium text-sm md:text-base">
        {data?.map((cat) => (
          <div
            key={cat._id}
            className="group relative flex flex-col items-center hover:text-yellow-500 cursor-pointer transition"
            onMouseEnter={() => setActiveSlug(cat.slug)}
          >
            <div className="flex items-center gap-1 transition-all">
              <span>{cat.name}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${
                  activeSlug === cat.slug ? "rotate-180" : "rotate-0"
                }`}
                size={16}
              />
            </div>

            {/* Dropdown appears only on hover and stays visible */}
            {activeSlug === cat.slug && (
              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 absolute top-full mt-3 w-60 bg-white text-gray-700 shadow-xl border rounded-lg p-3 z-50">
                {servicesLoading ? (
                  <p className="text-center text-sm text-gray-400">Loading...</p>
                ) : services.length === 0 ? (
                  <p className="text-center text-sm text-gray-400">No services found</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {services.map((s: any) => (
                      <li
                        key={s._id}
                        className="hover:text-yellow-500 transition-all cursor-pointer"
                      >
                        {s.title}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
