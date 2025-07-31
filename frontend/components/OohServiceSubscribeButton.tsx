"use client";
import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

import { BASEURL } from "@/constants";
import { toast } from "sonner";
import { RazorpayInstance, RazorpayOptions } from "@/types/razorpay";

interface Props {
  OohserviceId: string;
  pkgId: string;
  label: string;
}

declare global {
  interface Window {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}
}

export default function OohServiceSubscribeButton({
  OohserviceId,
  pkgId,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);


  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BASEURL}/oohservices/${OohserviceId}/packages/${pkgId}/subscribe`,
        {},
        { withCredentials: true }
      );
      const { subscriptionId, razorpayKey } = data;

      const options = {
        key: razorpayKey,
        subscription_id: subscriptionId,
        name: label,
        description: "Recurring subscription",
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) => {
          console.log("Razorpay response:", response);
          try {
            await axios.post(
              `${BASEURL}/payments/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );

            toast.success("payment successfull");
          } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              console.error("Axios error:", err.response?.data);
            } else if (err instanceof Error) {
              console.error(err.message);
            } else {
              console.error("Unknown error", err);
            }
          }
        },
        theme: { color: "#FBBF24" },
      } as RazorpayOptions;

      new window.Razorpay(options).open();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error("Axios error:", err.response?.data);
      } else if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Unknown error", err);
      }
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
