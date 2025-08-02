'use client';

import { useCategories, useDeleteCategory } from '@/hooks/useCategories'; // Import both hooks
import CategoryTable from '@/components/CategoryTable';
import { Loader2 } from 'lucide-react';

export default function CategoryPage() {
  const { data: categories, isLoading, isError } = useCategories();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory(); 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin mr-2" />
        <span>Loading categories...</span>
      </div>
    );
  }

  if (isError || !categories) {
    return (
      <div className="text-center text-red-500 mt-6">
        Failed to load categories.
      </div>
    );
  }

  // This is the function the table will call.
  // It calls the `mutate` function from our hook.
  const handleCategoryDelete = (id: string) => {
    deleteCategory(id);
  };

  return (
    <div className="flex justify-center p-8">
      <div className="w-full max-w-6xl">
        <CategoryTable
          categories={categories}
          onCategoryDeleted={handleCategoryDelete}
          isDeleting={isDeleting} 
        />
      </div>
    </div>
  );
}