"use client";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { useGoogleLogin, useLogin } from "@/hooks/useauth";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = useLogin();

  const router = useRouter();

  const googleLogin = useGoogleLogin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(form, {
      onSuccess: (data: any) => {
        toast.success("account logged in successfully");

        console.log("Login Data:", data); // Already here
        console.log("Role Check Passed:", data.role);
        if (data?.role === "admin") {
          console.log("Redirecting to /dashboard");
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          console.log("Redirecting to /");
          router.push("/"); // or wherever users go
        }

        setForm({ email: "", password: "" });
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Login failed");
        }
      },
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(circle, rgba(242, 177, 4, 0.14), rgba(242, 177, 4, 0))",
      }}
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2  rounded-2xl overflow-hidden">
        {/* Left - Image */}
        <div className="hidden md:block h-full">
          <Image
            src="/signupimage.jpg"
            alt="Sign up illustration"
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
              <h2 className="text-2xl font-semibold text-gray-800">Log in</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enter your details below
              </p>
            </div>

            {/* Input Fields */}
            <div className="space-y-5">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Your Email / phone no"
                required
                className="h-14 bg-white border border-gray-300"
                value={form.email}
                onChange={handleChange}
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
                className="h-14 bg-white border border-gray-300"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
            >
              Login Account
            </Button>

            {/* Google Signup */}
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                const idToken = credentialResponse.credential;

                if (!idToken) {
                  toast.error("No ID token received");
                  return;
                }

                googleLogin.mutate(
                  { idToken },
                  {
                    onSuccess: (data) => {
                      toast.success("Login successful!");
                      console.log("User:", data);
                    },
                    onError: (err: any) => {
                      toast.error(
                        err?.response?.data?.message || "Google login failed"
                      );
                    },
                  }
                );
              }}
              onError={() => toast.error("Google login failed")}
            />

            <p
              className="text-sm text-gray-600 text-center mt-4 cursor-pointer "
              onClick={() => router.push("/forgot-password")}
            >
              forgotpassword?
            </p>

            {/* Login Link */}
            <p className="text-sm text-gray-600 text-center mt-4">
              Don&apos;t free have account?{" "}
              <Link
                href="/register"
                className="text-black font-medium underline"
              >
                Signup in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
