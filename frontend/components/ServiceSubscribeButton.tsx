"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { BASEURL } from "@/constants";

interface Props {
  serviceId: string;
  pkgId:     string;
  label:     string;
}

export default function ServiceSubscribeButton({ serviceId, pkgId, label }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // 1) Create subscription on backend
      const { data } = await axios.post(
        `${BASEURL}/service/${serviceId}/packages/${pkgId}/subscribe`,
        {},
        { withCredentials: true }
      );
      const { subscriptionId, razorpayKey } = data;

      // 2) Launch Razorpay checkout
      const options = {
        key:             razorpayKey,
        subscription_id: subscriptionId,
        name:            label,
        description:     "Recurring subscription",
        handler(response: any) {
         console.log(response,"response")
        //   router.push("/dashboard/subscriptions");
        },
        theme: { color: "#FBBF24" },
      };
      
      new window.Razorpay(options).open();
    } catch (err: any) {
      console.error("Subscription error:", err);
      alert(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleSubscribe} disabled={loading} className="w-full">
      {loading ? "Processing…" : label}
    </Button>
  );
}
