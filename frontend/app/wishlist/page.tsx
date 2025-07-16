"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASEURL } from "@/constants";
import Link from "next/link";
import {
  Card,
  CardContent,

  CardTitle,
} from "@/components/ui/card";

interface WishlistItem {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
}

const WishlistPage = () => {
  const { data, isLoading, isError } = useQuery<WishlistItem[]>({
    queryKey: ["wishlist"],
    queryFn: async () => {
      const res = await axios.get(`${BASEURL}/wishlist`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10 text-lg">Loading wishlist...</div>;
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load wishlist.</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-gray-500">Your wishlist is empty.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <Link href={`/service/${item._id}`} key={item._id}>
            <Card className="group hover:shadow-xl transition-shadow border rounded-2xl overflow-hidden">
              <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold mb-1 text-gray-800 group-hover:text-black">
                  {item.title}
                </CardTitle>
                <p className="text-orange-600 font-bold text-xl">₹{item.price}</p>
                <p className="text-sm text-muted-foreground mt-1">View Details →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
