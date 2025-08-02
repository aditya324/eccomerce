"use client";
import { getAllExcept, getAllOohService, getAllService } from "@/lib/auth/api";
import { GetServicesResponse } from "@/types/service";
import { OohApiResponse, Service } from "@/types/Ooh";

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


export const useOoh = ()=>{
  return useQuery<OohApiResponse>({
    queryKey:["oohService"],
    queryFn:()=>getAllOohService()
  })
}



