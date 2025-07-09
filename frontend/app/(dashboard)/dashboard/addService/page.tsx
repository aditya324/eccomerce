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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BASEURL } from "@/constants";

const serviceSchema = z.object({
  title: z.string().min(3),
  slug: z.string(),
  categoryId: z.string().min(1),
  vendorName: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  thumbnail: z.string().url(),
  videoUrl: z.string().url(),
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

export default function AddServicePage() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

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
    useFieldArray({
      control,
      name: "description",
    });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASEURL}/categories/getAllCategory`); // adjust if different
        setCategories(res.data || []);

        await axios.get(`${BASEURL}/test-cookies`, {
          withCredentials: true,
        });
        console.log("cat", res.data);
      } catch (err) {
        toast.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`${BASEURL}/service/addService`, data, {
        withCredentials: true,
      });
      toast.success("Service created successfully!");
      reset();
    } catch (err) {
      toast.error("Failed to create service");
    }
  };

  

  return (
    <>
      <div className="flex justify-center px-4">
        <h1 className="text-3xl font-bold mb-8">🧩 Add New Service</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* TITLE + SLUG */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Title & Slug</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input {...register("title")} placeholder="Service Title" />
              <Input {...register("slug")} placeholder="Slug" />
            </CardContent>
          </Card>

         
          <Card className="col-span-1">
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

          {/* PRICING */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Price & Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="Base Price"
              />
              <Input {...register("thumbnail")} placeholder="Thumbnail URL" />
              <Input {...register("videoUrl")} placeholder="Video URL" />
            </CardContent>
          </Card>

          {/* DESCRIPTION */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
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
          </Card>

          {/* INCLUDES */}
          <Card className="md:col-span-3">
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

          {/* PACKAGES */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Packages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {packageFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="bg-muted rounded-lg p-4 space-y-2"
                >
                  <Input
                    {...register(`packages.${idx}.title`)}
                    placeholder="Package Title"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      {...register(`packages.${idx}.price`, {
                        valueAsNumber: true,
                      })}
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

          {/* FAQS */}
          <Card className="md:col-span-3">
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

          {/* SUBMIT BUTTON */}
          <div className="md:col-span-3">
            <Button type="submit" className="w-full text-lg">
              🚀 Create Service
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
