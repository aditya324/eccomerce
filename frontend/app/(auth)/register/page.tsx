"use client";

import { useState } from "react";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRegister } from "@/hooks/useauth";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = useRegister();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate(form, {
      onSuccess: () => {
        toast.success("Account created successfully!");
        setForm({ name: "", email: "", password: "" });
      },
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("Registration failed");
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
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden">
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
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-gray-800">
                Create an account
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Enter your details below
              </p>
            </div>

            <div className="space-y-5">
              <Input
                id="name"
                name="name"
                placeholder="Your Name"
                required
                className="h-14 bg-white border border-gray-300"
                value={form.name}
                onChange={handleChange}
              />
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

            <Button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold h-12"
              disabled={register.isPending}
            >
              {register.isPending ? "Creating..." : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full flex gap-2 items-center justify-center h-12"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
              >
                {/* SVG paths go here */}
              </svg>
              Sign up with Google
            </Button>

            <p className="text-sm text-gray-600 text-center mt-4">
              Already have account?{" "}
              <Link href="/login" className="text-black font-medium underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
