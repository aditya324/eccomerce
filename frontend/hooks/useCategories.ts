import { BASEURL } from "@/constants";
import { getAllCategories, getCategoryBySlug } from "@/lib/auth/api";
import { Category, CategoryWithServicesResponse } from "@/types/category";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axios from "axios";

import { toast } from "sonner";

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(),
  });
};

export const useCategoryBySlug = (slug: string) => {
  return useQuery<CategoryWithServicesResponse, Error>({
    queryKey: ["categorySlug", slug],
    queryFn: () => getCategoryBySlug(slug),
    enabled: !!slug,
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) => {
      return axios.delete(`${BASEURL}/categories/delete/${categoryId}`);
    },
    onSuccess: () => {
      toast.success("Category deleted successfully!");

      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to delete category.");
    },
  });
};
