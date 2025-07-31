import { getAllCategories, getCategoryBySlug } from "@/lib/auth/api";
import { Category, CategoryWithServicesResponse } from "@/types/category";

import { useQuery } from "@tanstack/react-query";


export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: ()=>getAllCategories(),
  });
};


export const useCategoryBySlug = (slug: string) => {
  return useQuery<CategoryWithServicesResponse, Error>({
    queryKey: ["categorySlug", slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
};