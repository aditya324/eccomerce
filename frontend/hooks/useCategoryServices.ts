// hooks/useCategoryServices.ts
import { BASEURL } from "@/constants";

import useSWR from "swr";

import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useCategoryServices(slug?: string) {
  const { data, error, isLoading } = useSWR(
    slug ? `${BASEURL}/categories/slug/${slug}` : null,
    fetcher
  );

  return {
    services: data?.services || [],
    isLoading,
    error,
  };
}
