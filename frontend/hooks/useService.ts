"use client";
import { getAllExcept, getAllService } from "@/lib/auth/api";
import { GetServicesResponse } from "@/types/service";

import { useQuery } from "@tanstack/react-query";

export const useService = () => {
  return useQuery<GetServicesResponse>({
    queryKey: ["Service"],
    queryFn: () => getAllService(),
  });
};

export const useServiceExcept = (id: string) => {
  return useQuery<GetServicesResponse>({
    queryKey: ["serviceExcept", id],
    queryFn: () => getAllExcept(id),
    enabled: !!id,
  });
};
