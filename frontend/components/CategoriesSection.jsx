"use client";

import { useCategories } from "@/hooks/useCategories";

export default function CategoriesSection() {
  const { data, isLoading, error } = useCategories();

  if (isLoading) return <p className="text-center py-4">Loading categories...</p>;
  if (error) return <p className="text-center py-4 text-red-500">Failed to load categories</p>;

  return (
    <div className="py-8">
      <div className="flex justify-center font-bold text-2xl md:text-3xl font-quicksand mb-6">
        <p>Browse Categories</p>
      </div>

      <div className="flex flex-wrap justify-between gap-8 px-12 text-gray-800 font-medium text-sm md:text-base">
        {data?.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col items-center hover:text-yellow-500 cursor-pointer transition"
          >
           
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
