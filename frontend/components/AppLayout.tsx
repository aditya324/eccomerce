// app/components/AppLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

    const adminRoutes = ["/dashboard" , "/Category"];

   const isDashboard = adminRoutes.some(route => pathname.startsWith(route));

  return (
    <>
      {!isDashboard && <Navbar />}
      {children}
    </>
  );
}
