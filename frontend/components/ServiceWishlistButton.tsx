"use client";
import { Heart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { BASEURL } from "@/constants";

export default function ServiceWishlistButton({ serviceId }: { serviceId: string }) {
  const queryClient = useQueryClient();


  const { data: wishlist, isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axios.get(`${BASEURL}/wishlist`, {
        withCredentials: true,
      });
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });


  const addMutation = useMutation({
    mutationFn: (id: string) =>
      axios.post(
        `${BASEURL}/wishlist/add/${id}`,
        {},
        { withCredentials: true }
      ),
    onSuccess: () => {
      toast("Added to wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => toast.error("Failed to add to wishlist"),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) =>
      axios.delete(`${BASEURL}/wishlist/remove/${id}`, {
        withCredentials: true,
      }),
    onSuccess: () => {
      toast("Removed from wishlist");
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: () => toast.error("Failed to remove from wishlist"),
  });


  const inWishlist = wishlist?.some((s: any) => s._id === serviceId);

  const toggle = () => {
    if (inWishlist) {
      removeMutation.mutate(serviceId);
    } else {
      addMutation.mutate(serviceId);
    }
  };

  if (isLoading) {
    return (
      <Heart className="w-6 h-6 text-gray-300 animate-pulse" />
    );
  }

  return (
    <button onClick={toggle} aria-label="Toggle wishlist">
      <Heart
        className={`w-6 h-6 cursor-pointer transition ${
          inWishlist ? "text-red-500" : "text-gray-400 hover:text-gray-600"
        }`}
      />
    </button>
  );
}
