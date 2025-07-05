"use client"
import { getAllService } from "@/lib/auth/api";
import { GetServicesResponse } from "@/types/service";

import { useQuery } from "@tanstack/react-query";

export const useService = () => {
  return useQuery<GetServicesResponse>({
    queryKey: ["Service"],
    queryFn: ()=>getAllService(),
  });
};