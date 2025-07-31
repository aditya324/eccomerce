// "use client";

// import { useEffect, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";

// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { BASEURL } from "@/constants";
// import { useParams } from "next/navigation";

// const serviceSchema = z.object({
//   title: z.string().min(3),
//   slug: z.string(),
//   categoryId: z.string().min(1),
//   vendorName: z.string().min(1),
//   price: z.coerce.number().nonnegative(),
//   thumbnail: z.string().url(),
//   videoUrl: z.string().url(),
//   description: z.array(z.string().min(5)).min(1),
//   includes: z.array(z.string().min(1)),
//   packages: z.array(
//     z.object({
//       title: z.string().min(1),
//       price: z.coerce.number().nonnegative(),
//       billingCycle: z.string().min(1),
//       planId: z.string().min(1),
//       features: z.array(z.string().min(1)),
//     })
//   ),
//   faqs: z.array(
//     z.object({
//       question: z.string().min(1),
//       answer: z.string().min(1),
//     })
//   ),
// });

// type FormData = z.infer<typeof serviceSchema>;

// export default function UpdateServicePage() {
//     const params = useParams();
//   const serviceId = params.id as string;

//   const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm<FormData>({
//     resolver: zodResolver(serviceSchema),
//     defaultValues: {
//       includes: [""],
//       packages: [],
//       faqs: [],
//       description: [""],
//     },
//   });


//   console.log("serviceid", serviceId)

//   const { fields: includeFields, append: appendInclude } = useFieldArray({ control, name: "includes" });
//   const { fields: packageFields, append: appendPackage } = useFieldArray({ control, name: "packages" });
//   const { fields: faqFields, append: appendFaq } = useFieldArray({ control, name: "faqs" });
//   const { fields: descriptionFields, append: appendDescription } = useFieldArray({ control, name: "description" });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [catRes, serviceRes] = await Promise.all([
//           axios.get(`${BASEURL}/categories/getAllCategory`),
//           axios.get(`${BASEURL}/service/getServiceById/${serviceId}`),
//         ]);

//         setCategories(catRes.data || []);
//         reset(serviceRes.data); // Pre-fill the form
//       } catch (err) {
//         toast.error("Failed to load data");
//       }
//     };

//     if (serviceId) fetchData();
//   }, [serviceId, reset]);

//   const onSubmit = async (data: FormData) => {
//     try {
//       await axios.post(`${BASEURL}/service/updateService/${serviceId}`, data, {
//         withCredentials: true,
//       });
//       toast.success("Service updated successfully!");
//     } catch (err) {
//       toast.error("Failed to update service");
//     }
//   };

//   return (
//     <div className="px-4 py-6">
//       <h1 className="text-3xl font-bold mb-8 text-center">✏️ Update Service</h1>

//       <form
//         onSubmit={handleSubmit(onSubmit)}
//         className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto"
//       >
//         {/* Title & Slug */}
//         <Card className="col-span-1 shadow-md">
//           <CardHeader><CardTitle>Title & Slug</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <Input {...register("title")} placeholder="Service Title" />
//             <Input {...register("slug")} placeholder="Slug" />
//           </CardContent>
//         </Card>

//         {/* Vendor Info */}
//         <Card className="col-span-1 shadow-md">
//           <CardHeader><CardTitle>Vendor Info</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <select {...register("categoryId")} className="w-full border rounded px-3 py-2">
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat._id}>{cat.name}</option>
//               ))}
//             </select>
//             <Input {...register("vendorName")} placeholder="Vendor Name" />
//           </CardContent>
//         </Card>

//         {/* Price & Media */}
//         <Card className="col-span-1 shadow-md">
//           <CardHeader><CardTitle>Price & Media</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             <Input type="number" {...register("price", { valueAsNumber: true })} placeholder="Base Price" />
//             <Input {...register("thumbnail")} placeholder="Thumbnail URL" />
//             <Input {...register("videoUrl")} placeholder="Video URL" />
//           </CardContent>
//         </Card>

//         {/* Description */}
//         <Card className="col-span-3 shadow-md">
//           <CardHeader><CardTitle>Description</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             {descriptionFields.map((field, idx) => (
//               <Textarea
//                 key={field.id}
//                 {...register(`description.${idx}`)}
//                 placeholder={`Description point #${idx + 1}`}
//               />
//             ))}
//             <Button type="button" onClick={() => appendDescription("")}>+ Add Description Point</Button>
//           </CardContent>
//         </Card>

//         {/* Includes */}
//         <Card className="col-span-2 shadow-md">
//           <CardHeader><CardTitle>Includes</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             {includeFields.map((field, idx) => (
//               <Input
//                 key={field.id}
//                 {...register(`includes.${idx}`)}
//                 placeholder={`Include #${idx + 1}`}
//               />
//             ))}
//             <Button type="button" onClick={() => appendInclude("")}>+ Add Include</Button>
//           </CardContent>
//         </Card>

//         {/* Packages */}
//         <Card className="col-span-3 shadow-md">
//           <CardHeader><CardTitle>Packages</CardTitle></CardHeader>
//           <CardContent className="space-y-4">
//             {packageFields.map((field, idx) => (
//               <div key={field.id} className="bg-muted rounded-lg p-4 space-y-2">
//                 <Input {...register(`packages.${idx}.title`)} placeholder="Package Title" />
//                 <div className="grid grid-cols-2 gap-3">
//                   <Input type="number" {...register(`packages.${idx}.price`, { valueAsNumber: true })} placeholder="Price" />
//                   <Input {...register(`packages.${idx}.billingCycle`)} placeholder="Billing Cycle" />
//                   <Input {...register(`packages.${idx}.planId`)} placeholder="PlanId" />
//                 </div>
//                 <p className="text-xl">fetaures</p>
//                 {field.features.map((_, featureIdx) => (
//                   <Input
//                     key={featureIdx}
//                     {...register(`packages.${idx}.features.${featureIdx}`)}
//                     placeholder={`Feature ${featureIdx + 1}`}
//                   />
//                 ))}
                 
//               </div>
//             ))}
//             <Button
//               type="button"
//               onClick={() =>
//                 appendPackage({
//                   title: "",
//                   price: 0,
//                   billingCycle: "",
//                   features: [""],
//                 })
//               }
//             >
//               + Add Package
//             </Button>
//           </CardContent>
//         </Card>

//         {/* FAQs */}
//         <Card className="col-span-3 shadow-md">
//           <CardHeader><CardTitle>FAQs</CardTitle></CardHeader>
//           <CardContent className="space-y-3">
//             {faqFields.map((field, idx) => (
//               <div key={field.id} className="grid md:grid-cols-2 gap-3">
//                 <Input {...register(`faqs.${idx}.question`)} placeholder="Question" />
//                 <Input {...register(`faqs.${idx}.answer`)} placeholder="Answer" />
//               </div>
//             ))}
//             <Button type="button" onClick={() => appendFaq({ question: "", answer: "" })}>
//               + Add FAQ
//             </Button>
//           </CardContent>
//         </Card>

//         {/* Submit */}
//         <div className="col-span-3">
//           <Button type="submit" className="w-full text-lg">✅ Update Service</Button>
//         </div>
//       </form>
//     </div>
//   );
// }



import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
