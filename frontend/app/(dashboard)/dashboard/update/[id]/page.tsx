
"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BASEURL } from "@/constants";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

// --- Zod Schema for Update Form ---
// This schema handles both existing string URLs and new FileList objects for media.
const updateServiceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(1, "Slug is required"),
  categoryId: z.string().min(1, "Please select a category"),
  vendorName: z.string().min(1, "Vendor name is required"),
  price: z.coerce.number().nonnegative(),
  thumbnail: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files?.[0]?.size <= MAX_IMAGE_SIZE &&
          ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)),
      `Max image size is 5MB and only .jpg, .jpeg, .png, .webp are accepted.`
    ),
  videoUrl: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files ||
        files.length === 0 ||
        (files?.[0]?.size <= MAX_VIDEO_SIZE &&
          ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type)),
      `Max video size is 20MB and only .mp4, .webm are accepted.`
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

type FormData = z.infer<typeof updateServiceSchema>;

// --- S3 Upload Helper Function (re-used from AddServicePage) ---
const uploadFile = async (file: File): Promise<string> => {
  try {
    const { data } = await axios.get(
      `${BASEURL}/s3/get-presigned-url?fileName=${file.name}&fileType=${file.type}`
    );
    const { uploadUrl, key } = data;

    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });

    // Note: Ensure your environment variables are correctly configured.
    const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${key}`;
    return fileUrl;
  } catch (err) {
    console.error("File upload failed:", err);
    toast.error("File upload failed. Please try again.");
    throw new Error("File upload failed");
  }
};

export default function UpdateServicePage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);


  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(updateServiceSchema),
  });

  const { fields: includeFields, append: appendInclude } = useFieldArray({ control, name: "includes" });
  const { fields: packageFields, append: appendPackage } = useFieldArray({ control, name: "packages" });
  const { fields: faqFields, append: appendFaq } = useFieldArray({ control, name: "faqs" });
  const { fields: descriptionFields, append: appendDescription } = useFieldArray({ control, name: "description" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, serviceRes] = await Promise.all([
          axios.get(`${BASEURL}/categories/getAllCategory`),
          axios.get(`${BASEURL}/service/getServiceById/${serviceId}`),
        ]);
        
        const serviceData = serviceRes.data;
        setCategories(catRes.data || []);
        setInitialData(serviceData);
        reset(serviceData);
        
      } catch (err) {
        toast.error("Failed to load service data.");
        console.error(err);
      }
    };

    if (serviceId) {
      fetchData();
    }
  }, [serviceId, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let thumbnailUrl = initialData?.thumbnail;
      let videoS3Url = initialData?.videoUrl;


      if (data.thumbnail && data.thumbnail.length > 0) {
        toast.info("Uploading new thumbnail...");
        thumbnailUrl = await uploadFile(data.thumbnail[0]);
      }

     
      if (data.videoUrl && data.videoUrl.length > 0) {
        toast.info("Uploading new video...");
        videoS3Url = await uploadFile(data.videoUrl[0]);
      }

      const payload = {
        ...data,
        thumbnail: thumbnailUrl,
        videoUrl: videoS3Url,
      };

      await axios.post(`${BASEURL}/service/updateService/${serviceId}`, payload, {
        withCredentials: true,
      });

      toast.success("Service updated successfully!");
      router.push("/dashboard/services"); // Optional: redirect after success
    } catch (err) {
      toast.error("Failed to update service. Check console for details.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!initialData) {
    return <div className="text-center p-10">Loading service details...</div>
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-center">✏️ Update Service</h1>
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
          <CardContent className="space-y-4">
            <Input
              type="number"
              {...register("price")}
              placeholder="Base Price"
            />
            
            {/* Thumbnail Section */}
            <div>
              <label className="text-sm font-medium">Thumbnail Image</label>
              {initialData.thumbnail && (
                  <div className="my-2">
                    <p className="text-xs text-muted-foreground">Current Thumbnail:</p>
                    <img src={initialData.thumbnail} alt="Current Thumbnail" className="w-24 h-24 object-cover rounded-md border" />
                  </div>
              )}
              <Input type="file" accept="image/*" {...register("thumbnail")} />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to keep the current thumbnail.</p>
              {errors.thumbnail?.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.thumbnail.message as string}
                </p>
              )}
            </div>

            {/* Video Section */}
            <div>
              <label className="text-sm font-medium">Service Video</label>
              {initialData.videoUrl && (
                  <div className="my-2">
                    <a href={initialData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                      View Current Video
                    </a>
                  </div>
              )}
              <Input type="file" accept="video/*" {...register("videoUrl")} />
               <p className="text-xs text-muted-foreground mt-1">Leave empty to keep the current video.</p>
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
                  features: ["", ""], // Match the hardcoded feature inputs
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
            {isSubmitting ? "Updating..." : "✅ Update Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}

