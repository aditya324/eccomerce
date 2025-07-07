"use client";

import ServiceTable from "@/components/ServiceTable";
import { useService } from "@/hooks/useService";
import React from "react";

const Service = () => {
  const { data, isLoading, isError } = useService();

  console.log("service",data)

  if (isLoading) return <p className="p-6">Loading services...</p>;
  if (isError || !data) return <p className="p-6 text-red-500">Failed to load services.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Services</h1>
      <ServiceTable data={data.service} />
    </div>
  );
};

export default Service;
