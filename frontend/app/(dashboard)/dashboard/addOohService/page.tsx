"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { BASEURL } from "@/constants";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

const serviceSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(1),
  categoryId: z.string().min(1),
  vendorName: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  thumbnail: z
    .any()
    .refine((files) => files?.length === 1, "Thumbnail is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_IMAGE_SIZE,
      "Max image size is 5MB."
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Invalid image format."
    ),
  videoUrl: z
    .any()
    .refine((files) => files?.length === 1, "Video is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_VIDEO_SIZE,
      "Max video size is 20MB."
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      "Invalid video format."
    ),
  description: z.array(z.string().min(5)).min(1),
  includes: z.array(z.string().min(1)),
  packages: z.array(
    z.object({
      title: z.string().min(1),
      price: z.coerce.number().nonnegative(),
      billingCycle: z.string().min(1),
      features: z.array(z.string().min(1)),
      packageType: z.enum(["Static", "Digital"]),
      subType: z.string().min(1),
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

const uploadFile = async (file: File): Promise<string> => {
  const { data } = await axios.get(
    `${BASEURL}/s3/get-presigned-url?fileName=${file.name}&fileType=${file.type}`
  );
  await axios.put(data.uploadUrl, file, {
    headers: { "Content-Type": file.type },
  });
  return `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${data.key}`;
};

export default function AddOOHServicePage() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      includes: [""],
      packages: [
        {
          title: "",
          price: 0,
          billingCycle: "",
          features: [""],
          packageType: "Static",
          subType: "Hoarding",
        },
      ],
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
    axios
      .get(`${BASEURL}/categories/getAllCategory`)
      .then((res) => setCategories(res.data))
      .catch(() => toast.error("Failed to fetch categories"));
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const thumbnailUrl = await uploadFile(data.thumbnail[0]);
      const videoS3Url = await uploadFile(data.videoUrl[0]);

      const payload = {
        ...data,
        thumbnail: thumbnailUrl,
        videoUrl: videoS3Url,
      };

      await axios.post(`${BASEURL}/oohservices/add`, payload, {
        withCredentials: true,
      });

      toast.success("OOH Service created successfully!");
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
        📍 Add OOH Service
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto"
      >
        {/* Title & Slug */}
        <Card className="col-span-1 shadow-md">
          <CardHeader>
            <CardTitle>Title & Slug</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input {...register("title")} placeholder="Service Title" />
            <Input {...register("slug")} placeholder="Slug" />
          </CardContent>
        </Card>

        {/* Vendor Info */}
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

        {/* Price & Media */}
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
            <Input type="file" accept="image/*" {...register("thumbnail")} />
            <Input type="file" accept="video/*" {...register("videoUrl")} />
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {descriptionFields.map((field, idx) => (
              <Textarea
                key={field.id}
                {...register(`description.${idx}`)}
                placeholder={`Description #${idx + 1}`}
              />
            ))}
            <Button type="button" onClick={() => appendDescription("")}>
              + Add Description
            </Button>
          </CardContent>
        </Card>

        {/* Includes */}
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

        {/* Packages */}
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

                {/* Package Type Dropdown */}
                <Select
                  value={watch(`packages.${idx}.packageType`)}
                  onValueChange={(val) =>
                    setValue(
                      `packages.${idx}.packageType`,
                      val as "Static" | "Digital"
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Package Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Static">Static</SelectItem>
                    <SelectItem value="Digital">Digital</SelectItem>
                  </SelectContent>
                </Select>

                {/* SubType Dropdown */}
                <Select
                  value={watch(`packages.${idx}.subType`)}
                  onValueChange={(val) =>
                    setValue(`packages.${idx}.subType`, val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sub Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hoarding">Hoarding</SelectItem>
                    <SelectItem value="Ticket Counter">
                      Ticket Counter
                    </SelectItem>
                    <SelectItem value="Platform TV">Platform TV</SelectItem>
                    <SelectItem value="Inside Railway Station">
                      Inside Railway Station
                    </SelectItem>
                    <SelectItem value="Popups">Popups</SelectItem>
                  </SelectContent>
                </Select>

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
                  packageType: "Static", // default
                  subType: "Hoarding", // default
                })
              }
            >
              + Add Package
            </Button>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="col-span-3 shadow-md">
          <CardHeader>
            <CardTitle>FAQs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqFields.map((field, idx) => (
              <div key={field.id} className="grid grid-cols-2 gap-3">
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
            {isSubmitting ? "Uploading..." : "🚀 Create OOH Service"}
          </Button>
        </div>
      </form>
    </div>
  );
}
