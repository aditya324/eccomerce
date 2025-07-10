// components/CreateServicePlanButton.jsx
"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BASEURL } from "@/constants";

export default function CreateServicePlanButton({ serviceId, pkgId }) {
  const [loading, setLoading] = useState(false);
  const [planId, setPlanId]     = useState("");
  const [error, setError]       = useState("");

  const handleCreatePlan = async () => {
    setLoading(true);
    setError("");
    try {
   
      const res = await axios.post(
        `${BASEURL}/service/${serviceId}/packages/${pkgId}/create-plan`,
        {},
        { withCredentials: true }
      );
      setPlanId(res.data.planId);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end space-y-1">
      <Button
        onClick={handleCreatePlan}
        disabled={loading || !!planId}
        className="px-3 py-1 text-sm"
      >
        {planId ? "✔ Plan Created" : loading ? "Creating…" : "Create Plan"}
      </Button>
      {planId && (
        <span className="text-xs text-green-600">
          {planId}
        </span>
      )}
      {error && (
        <span className="text-xs text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
