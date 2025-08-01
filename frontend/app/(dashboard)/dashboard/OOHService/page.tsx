"use client";

import React from "react";
import { useOoh } from "@/hooks/useService"; // Replace with useOohService if different
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import OohServiceTable from "@/components/OohServiceTable";


const OohServiceSection = () => {
  const { data, isLoading, isError } = useOoh(); 

  console.log(data, "dataooh")
  const router = useRouter();

  if (isLoading) return <p className="p-6">Loading OOH services...</p>;
  if (isError || !data)
    return <p className="p-6 text-red-500">Failed to load OOH services.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">OOH Services</h1>
        <div className="flex justify-end mb-4">
          <Button onClick={() => router.push("addService")}>Add OOH Service</Button>
        </div>
      </div>
      <OohServiceTable data={data.service} />
    </div>
  );
};

export default OohServiceSection;
