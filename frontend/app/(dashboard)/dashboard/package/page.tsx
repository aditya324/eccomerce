// components/PackageTablePage.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link"; // Assuming Next.js for routing

// UI component imports
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
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Icon imports
import { Trash2, Pencil, Loader2 } from "lucide-react";

// Assuming BASEURL and the provided interfaces are in your project
import { BASEURL } from "@/constants";

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
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // --- NEW: State for Delete Confirmation Dialog ---
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<Package | null>(null);

  const fetchPackages = () => {
    setLoading(true);
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

  // --- NEW: Function to handle deleting a package ---
  const handleDeletePackage = async () => {
    if (!packageToDelete) return;

    setProcessingId(packageToDelete._id);
    setShowDeleteDialog(false); // Close the dialog immediately

    try {
      await axios.delete(`${BASEURL}/package/delete/${packageToDelete._id}`);
      toast.success("Package deleted successfully");

      // Optimistic update: remove the package from the list immediately
      setPackages(prevPackages => prevPackages.filter(p => p._id !== packageToDelete._id));
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete package");
      // If deletion fails, refetch the data to get the correct state
      fetchPackages(); 
    } finally {
      setProcessingId(null);
      setPackageToDelete(null);
    }
  };

  // --- NEW: Function to open the delete confirmation dialog ---
  const handleOpenDeleteDialog = (pkg: Package) => {
    setPackageToDelete(pkg);
    setShowDeleteDialog(true);
  };

  if (loading)
    return <p className="text-center mt-10 text-lg">Loading packages…</p>;
  if (error)
    return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <>
      <div className="flex justify-center p-10 bg-muted/5">
        <Card className="w-full max-w-7xl mx-auto">
          <div className="flex justify-between p-6 pb-0">
            <CardHeader className="p-0">
              <CardTitle className="text-3xl">All Packages</CardTitle>
            </CardHeader>
            <Button asChild>
              <Link href="/dashboard/addPackage">Add Package</Link>
            </Button>
          </div>

          <CardContent className="mt-4">
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
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
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
                      <TableCell>{pkg.category?.name}</TableCell>
                      <TableCell>{pkg.isFeatured ? "Yes" : "No"}</TableCell>
                      <TableCell className="font-mono">
                        {pkg.planId || "—"}
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        {/* --- NEW: Edit Button --- */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                asChild
                                disabled={processingId === pkg._id}
                              >
                                <Link href={`/dashboard/updatePackage/${pkg._id}`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Edit Package</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {/* --- NEW: Delete Button --- */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleOpenDeleteDialog(pkg)}
                                disabled={processingId === pkg._id}
                              >
                                {processingId === pkg._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Package</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- NEW: Delete Confirmation Dialog --- */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              package 
              <span className="font-bold">{packageToDelete?.title}</span> and
              remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePackage}
              className="bg-destructive hover:bg-destructive-hover"
              disabled={processingId !== null}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}