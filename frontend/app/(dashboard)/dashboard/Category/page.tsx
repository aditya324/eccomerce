'use client';

import { useCategories } from '@/hooks/useCategories';
import CategoryTable from '@/components/CategoryTable';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CategoryPage() {
  const { data, isLoading, isError } = useCategories();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading categories...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8">
     
      <div className="w-full max-w-6xl">
        <CategoryTable categories={data} />
      </div>
    </div>
  );
}
