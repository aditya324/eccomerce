"use client";
import { useState } from "react";
import axios from "axios";
import { BASEURL } from "@/constants";
import { toast } from "sonner";

export default function SubscribeButton({ packageId }: { packageId: string }) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

   
      const res = await axios.post(
        `${BASEURL}/package/${packageId}/subscribe`,
        {},
        { withCredentials: true }
      );

      const { razorpaySubscriptionId, customerId, packageTitle } = res.data;

      console.log("res.data", res.data);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        name: "Sunrise Digital",
        description: packageTitle,
        subscription_id: razorpaySubscriptionId,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          try {
            await axios.post(
              `${BASEURL}/payments/package/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_subscription_id: response.razorpay_subscription_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            toast.success("Payment verified & subscription activated ✅");
          } catch (err) {
            toast.error("Payment failed to verify ❌");
          }
        },

        prefill: {
          email: "",
          name: "",
        },
        theme: {
          color: "#facc15",
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className="mt-auto bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors text-center w-full"
    >
      {loading ? "Processing..." : "Get a plan"}
    </button>
  );
}
