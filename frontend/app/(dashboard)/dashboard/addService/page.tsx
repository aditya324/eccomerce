"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BASEURL } from "@/constants";

// --- File Validation Constants ---
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

// --- Zod Schema for Form Validation ---
const serviceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().min(1, "Please select a category"),
  vendorName: z.string().min(1, "Vendor name is required"),
  price: z.coerce.number().nonnegative(),
  thumbnail: z
    .any() // Use z.any() to prevent server-side errors
    .refine((files) => files?.length === 1, "Thumbnail image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_IMAGE_SIZE,
      `Max image size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
  videoUrl: z
    .any() // Use z.any() to prevent server-side errors
    .refine((files) => files?.length === 1, "Video is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_VIDEO_SIZE,
      `Max video size is 20MB.`
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "Only .mp4 and .webm formats are supported."
    ),
  description: z.array(z.string().min(5)).min(1),
  includes: z.array(z.string().min(1)),
  packages: z.array(
    z.object({
      title: z.string().min(1),
      price: z.coerce.number().nonnegative(),
      billingCycle: z.string().min(1),
      features: z.array(z.string().min(1)),
    })
  ),
  faqs: z.array(
    z.object({
      question: z.string().min(1),
      answer: z.string().min(1),
    })
  ),
});

type FormData = z.infer<typeof serviceSchema>;

// --- S3 Upload Helper Function ---
const uploadFile = async (file: File): Promise<string> => {
  try {
    const { data } = await axios.get(
      `${BASEURL}/s3/get-presigned-url?fileName=${file.name}&fileType=${file.type}`
    );
    const { uploadUrl, key } = data;

    console.log("uploadedurl", uploadUrl);
    console.log("key", key);

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${key}`;

    console.log("Constructed URL:", fileUrl);
    return fileUrl;
  } catch (err) {
    console.error("File upload failed:", err);
    toast.error("File upload failed. Please try again.");
    throw new Error("File upload failed");
  }
};

// --- React Component ---
export default function AddServicePage() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      includes: [""],
      packages: [{ title: "", price: 0, billingCycle: "", features: [""] }],
      faqs: [{ question: "", answer: "" }],
      description: [""],
    },
  });

  const { fields: includeFields, append: appendInclude } = useFieldArray({
    control,
    name: "includes",
  });
  const { fields: packageFields, append: appendPackage } = useFieldArray({
    control,
    name: "packages",
  });
  const { fields: faqFields, append: appendFaq } = useFieldArray({
    control,
    name: "faqs",
  });
  const { fields: descriptionFields, append: appendDescription } =
    useFieldArray({ control, name: "description" });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASEURL}/categories/getAllCategory`);
        setCategories(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const thumbnailFile = data.thumbnail[0];
      const videoFile = data.videoUrl[0];

      const [thumbnailUrl, videoS3Url] = await Promise.all([
        uploadFile(thumbnailFile),
        uploadFile(videoFile),
      ]);

      const payload = {
        ...data,
        thumbnail: thumbnailUrl,
        videoUrl: videoS3Url,
      };

      await axios.post(`${BASEURL}/service/addService`, payload, {
        withCredentials: true,
      });

      toast.success("Service created successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to create service. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🧩 Add New Service
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto"
      >
        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Title & Slug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input {...register("title")} placeholder="Service Title" />
            <Input {...register("slug")} placeholder="Slug" />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Vendor Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              {...register("categoryId")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Input {...register("vendorName")} placeholder="Vendor Name" />
          </CardContent>
        </Card>

        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Price & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              type="number"
              {...register("price")}
              placeholder="Base Price"
            />
            <div>
              <label className="text-sm font-medium">Thumbnail Image</label>
              <Input type="file" accept="image/*" {...register("thumbnail")} />
              {errors.thumbnail?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message as string}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Service Video</label>
              <Input type="file" accept="video/*" {...register("videoUrl")} />
              {errors.videoUrl?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.videoUrl.message as string}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {descriptionFields.map((field, idx) => (
              <Textarea
                key={field.id}
                {...register(`description.${idx}`)}
                placeholder={`Description point #${idx + 1}`}
              />
            ))}
            <Button type="button" onClick={() => appendDescription("")}>
              + Add Description Point
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>Includes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {includeFields.map((field, idx) => (
              <Input
                key={field.id}
                {...register(`includes.${idx}`)}
                placeholder={`Include #${idx + 1}`}
              />
            ))}
            <Button type="button" onClick={() => appendInclude("")}>
              + Add Include
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {packageFields.map((field, idx) => (
              <div key={field.id} className="bg-muted rounded-lg p-4 space-y-2">
                <Input
                  {...register(`packages.${idx}.title`)}
                  placeholder="Package Title"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    {...register(`packages.${idx}.price`)}
                    placeholder="Price"
                  />
                  <Input
                    {...register(`packages.${idx}.billingCycle`)}
                    placeholder="Billing Cycle"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    {...register(`packages.${idx}.features.0`)}
                    placeholder="Feature 1"
                  />
                  <Input
                    {...register(`packages.${idx}.features.1`)}
                    placeholder="Feature 2"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={() =>
                appendPackage({
                  title: "",
                  price: 0,
                  billingCycle: "",
                  features: [""],
                })
              }
            >
              + Add Package
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqFields.map((field, idx) => (
              <div key={field.id} className="grid md:grid-cols-2 gap-3">
                <Input
                  {...register(`faqs.${idx}.question`)}
                  placeholder="Question"
                />
                <Input
                  {...register(`faqs.${idx}.answer`)}
                  placeholder="Answer"
                />
              </div>
            ))}
            <Button
              type="button"
              onClick={() => appendFaq({ question: "", answer: "" })}
            >
              + Add FAQ
            </Button>
          </CardContent>
        </Card>

        <div className="col-span-3">
          <Button
            type="submit"
            className="w-full text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "🚀 Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
