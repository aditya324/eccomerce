"use client";

import ServiceTable from "@/components/ServiceTable";
import { Button } from "@/components/ui/button";
import { useService } from "@/hooks/useService";
import { useRouter } from "next/navigation";
import React from "react";

const Service = () => {
  const { data, isLoading, isError } = useService();
  const router=useRouter()

  console.log("service", data);

  if (isLoading) return <p className="p-6">Loading services...</p>;
  if (isError || !data)
    return <p className="p-6 text-red-500">Failed to load services.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">All Services</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={()=>router.push('addService')}>Add Service</Button>
      </div>
      </div>
      <ServiceTable data={data.service} />
    </div>
  );
};

export default Service;
