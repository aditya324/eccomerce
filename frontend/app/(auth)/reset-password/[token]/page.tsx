"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {  useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { BASEURL } from "@/constants";

interface ResetPasswordResponse {
  message: string;
}

const ResetPasswordPage = () => {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();
 
  const { token } = useParams();
  console.log("token", token)

  const resetPassword = useMutation<
    ResetPasswordResponse,
    AxiosError<{ message: string }>,
    string
  >({
    mutationFn: (password) =>
      axios.post(`${BASEURL}/users/reset-password/${token}`, { password }, { withCredentials: true }),
    onSuccess: (res) => {
      toast.success(res.data.message || "Password reset successful");
      router.push("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Reset failed");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.password || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!token) {
      return toast.error("Invalid or missing token");
    }

    resetPassword.mutate(form.password);
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
        {/* Left - Image */}
        <div className="hidden md:block h-full">
          <Image
            src="/signupimage.jpg" // 👈 Replace with your image path
            alt="Reset password illustration"
            width={758}
            height={598}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Right - Form */}
        <div className="p-16 flex flex-col justify-center">
          <form className="space-y-6 w-full max-w-md" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">Reset Password</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enter your new password below.
              </p>
            </div>

            <Input
              type="password"
              name="password"
              placeholder="New Password"
              className="h-14 bg-white border border-gray-300"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              className="h-14 bg-white border border-gray-300"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
              disabled={resetPassword.isLoading}
            >
              {resetPassword.isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
