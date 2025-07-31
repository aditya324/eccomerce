"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BASEURL } from "@/constants";

interface ForgotPasswordResponse {
  data:{
    message: string;
  }
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const forgotPassword = useMutation<
    ForgotPasswordResponse,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: (email) =>
      axios.post(`${BASEURL}/users/forgot-password`, { email }, { withCredentials: true }),
    
    // Optional: If you want to log when the mutation starts, use onMutate
    onMutate: (email) => {
      console.log("Starting to send reset link for:", email);
    },

    onSuccess: (res) => {
      toast.success(res.data.message || "Reset link sent!");
      setEmail("");
    },
    
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    forgotPassword.mutate(email);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(circle, rgba(242, 177, 4, 0.14), rgba(242, 177, 4, 0))",
      }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden">

        <div className="hidden md:block h-full">
          <Image
            src="/signupimage.jpg"
            alt="Forgot password illustration"
            width={758}
            height={598}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right - Form */}
        <div className="p-16 flex flex-col justify-center">
          <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                Forgot Password
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enter your email to receive a reset link
              </p>
            </div>

            {/* Email Input */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-14 bg-white border border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
            </Button>

            {/* Back to login */}
            <p className="text-sm text-gray-600 text-center mt-4">
              Remember your password?{" "}
              <span
                className="text-black font-medium underline cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
