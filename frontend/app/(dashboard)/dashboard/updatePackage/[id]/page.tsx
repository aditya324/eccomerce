
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BASEURL } from "@/constants";

// The Zod schema remains the same as the 'add' page
const packageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  slug: z.string().min(1, "Slug is required."),
  price: z.coerce.number().nonnegative("Price must be a positive number."),
  billingCycle: z.enum(["monthly", "yearly"]),
  serviceIds: z.array(z.string()).min(1, "At least one service must be selected."),
  features: z.array(z.object({
    value: z.string().min(1, "Feature cannot be empty."),
  })).min(1, "At least one feature is required."),
  category: z.string().min(1, "A category must be selected."),
  isFeatured: z.boolean(),
});

type FormData = z.infer<typeof packageSchema>;

// Interface for fetched data, which might be populated
interface FetchedPackage {
  _id: string;
  title: string;
  slug: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  serviceIds: { _id: string; title: string }[]; // Populated services
  features: string[]; // Simple array of strings
  category: { _id: string; name: string }; // Populated category
  isFeatured: boolean;
  planId: string | null;
}

export default function UpdatePackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params?.id;

  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(packageSchema),
  });

  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: "features",
  });

  // Effect to fetch initial data and pre-populate the form
  useEffect(() => {
    const fetchData = async () => {
      if (!packageId) {
        setIsLoading(false);
        return;
      }

      try {
        const [pkgRes, svcRes, catRes] = await Promise.all([
          axios.get<FetchedPackage>(`${BASEURL}/package/${packageId}`),
          axios.get<{ service: { _id: string; title: string }[] }>(`${BASEURL}/service/getAllService`),
          axios.get<{ _id: string; name: string }[]>(`${BASEURL}/categories/getAllCategory`),
        ]);

        const packageData = pkgRes.data;
        setServices(svcRes.data.service || []);
        setCategories(catRes.data || []);
        
        // Transform features from a string array to an array of objects
        const transformedFeatures = packageData.features.map((feature: string) => ({
          value: feature,
        }));
        
        // Extract just the _id strings from the populated services array
        const serviceIds = packageData.serviceIds?.map(service => service._id) || [];
        
        // Pre-populate the form with fetched data using reset()
        reset({
          title: packageData.title,
          slug: packageData.slug,
          price: packageData.price,
          billingCycle: packageData.billingCycle,
          serviceIds: serviceIds,
          features: transformedFeatures,
          category: packageData.category._id,
          isFeatured: packageData.isFeatured,
        });

      } catch (err) {
        toast.error("Failed to fetch package data or form options.");
        console.error("Data fetching error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [packageId, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    // Transform features back to a string array for the backend
    const transformedFeatures = data.features.map(feature => feature.value);
    
    const payload = {
      ...data,
      features: transformedFeatures, 
    };

    try {
      await axios.put(`${BASEURL}/package/update/${packageId}`, payload, {
        withCredentials: true,
      });
      toast.success("Package updated successfully! 🎉");
      router.push("/dashboard/package");
    } catch (err) {
      toast.error("Failed to update package.");
      console.error("Submission Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors: any) => {
    console.log("VALIDATION ERRORS:", formErrors);
    toast.error("Please fix the errors shown on the form.");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-4 text-lg">Loading package data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Update Package</h1>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl"
      >
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} placeholder="Package Title" />
          {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} placeholder="package-slug" />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="number" step="0.01" {...register("price")} placeholder="e.g., 49.99" />
          {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <select id="billingCycle" {...register("billingCycle")} className="w-full border rounded px-3 py-2 bg-background">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="category">Category</Label>
          <select id="category" {...register("category")} className="w-full border rounded px-3 py-2 bg-background">
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {services.map((svc) => (
                <label key={svc._id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={svc._id}
                    {...register("serviceIds")}
                  />
                  {svc.title}
                </label>
              ))}
            </div>
            {errors.serviceIds && <p className="text-sm text-red-500 mt-4">{errors.serviceIds.message}</p>}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Features</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {featureFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Input {...register(`features.${index}.value`)} placeholder={`Feature ${index + 1}`} />
                <Button type="button" variant="destructive" onClick={() => removeFeature(index)}>Remove</Button>
              </div>
            ))}
            {errors.features && <p className="text-sm text-red-500">{errors.features.root?.message}</p>}
            <Button type="button" variant="secondary" onClick={() => appendFeature({ value: "" })}>+ Add Feature</Button>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 p-4 border rounded-md">
          <input id="isFeatured" type="checkbox" {...register("isFeatured")} className="h-4 w-4" />
          <Label htmlFor="isFeatured">Mark as Featured</Label>
        </div>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Package
          </Button>
        </div>
      </form>
    </div>
  );
}
