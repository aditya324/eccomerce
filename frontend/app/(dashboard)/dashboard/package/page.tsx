// components/PackageTablePage.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASEURL } from "@/constants";
import { toast } from "sonner";

interface PopulatedService {
  _id: string;
  title: string;
}

interface PopulatedCategory {
  _id: string;
  name: string;
}

interface Package {
  _id: string;
  title: string;
  slug: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  planId: string | null;
  serviceIds: PopulatedService[];
  features: string[];
  category: PopulatedCategory;
  isFeatured: boolean;
}

export default function PackageTablePage() {
  // --- Typed State ---
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPackages = () => {
    setLoading(true);
    // --- Typed API Call ---
    axios
      .get<Package[]>(`${BASEURL}/package/getAllPackages`)
      .then(({ data }) => setPackages(data))
      .catch(() => setError("Failed to load packages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePlan = async (packageId: string) => {
    setProcessingId(packageId);
    try {
      const res = await axios.post<{ planId: string }>(
        `${BASEURL}/package/create-plan/${packageId}`
      );
      toast.success(`Plan Created: ${res.data.planId}`);
      fetchPackages(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create plan");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading packages…</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="flex justify-center p-10 bg-muted/5">
      <Card className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between">
          <CardHeader>
            <CardTitle className="text-3xl ">All Packages</CardTitle>
          </CardHeader>
          <Button>AddPackage</Button>
        </div>
        
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="mx-auto text-base">
              <TableCaption>List of all package plans</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Plan ID</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* 'pkg' is now correctly typed as 'Package' */}
                {packages.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell className="font-medium">{pkg.title}</TableCell>
                    <TableCell>{pkg.slug}</TableCell>
                    <TableCell>₹{pkg.price.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">
                      {pkg.billingCycle}
                    </TableCell>
                    <TableCell>
                      {pkg.serviceIds?.map((s) => s.title).join(", ")}
                    </TableCell>
                    <TableCell>{pkg.features?.join(", ")}</TableCell>
                    {/* FIX: Display category name instead of object */}
                    <TableCell>{pkg.category?.name}</TableCell>
                    <TableCell>{pkg.isFeatured ? "Yes" : "No"}</TableCell>
                    <TableCell className="font-mono">
                      {pkg.planId || "—"}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        disabled={!!pkg.planId || processingId === pkg._id}
                        onClick={() => handleCreatePlan(pkg._id)}
                      >
                        {processingId === pkg._id
                          ? "Creating..."
                          : pkg.planId
                          ? "Created"
                          : "Create Plan"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
