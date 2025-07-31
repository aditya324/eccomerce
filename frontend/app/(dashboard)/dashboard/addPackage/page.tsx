'use client';

import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { BASEURL } from '@/constants';

const packageSchema = z.object({
  title: z.string().min(3),
  slug: z.string(),
  price: z.coerce.number().nonnegative(),
  billingCycle: z.enum(['monthly', 'yearly']),
  planId: z.string(),
  serviceIds: z.array(z.string().min(1)).min(1, 'At least one service is required'),
  features: z.array(z.string().min(1)).min(1),
  category: z.string().min(1),
  isFeatured: z.boolean()
});

type FormData = z.infer<typeof packageSchema>;

export default function AddPackagePage() {
  const [services, setServices] = useState<{ _id: string; title: string }[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
  
    control,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      serviceIds: [],
      features: [''],
      isFeatured: false
    }
  });

  const { fields: featureFields, append: appendFeature } = useFieldArray({ control,  name: 'features' as never });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [svcRes, catRes] = await Promise.all([
          axios.get(`${BASEURL}/service/getAllService`),
          axios.get(`${BASEURL}/categories/getAllCategory`)
        ]);
        setServices(svcRes.data.service || []);
        setCategories(catRes.data || []);
      } catch (err) {
        toast.error('Failed to fetch services or categories');
      }
    };
    fetchData();
  }, []);

  const selectedServiceIds = watch('serviceIds');

  const onSubmit = async (data: FormData) => {
    try {
      await axios.post(`${BASEURL}/package/add`, data, {
        withCredentials: true
      });
      toast.success('Package created successfully!');
      reset();
    } catch (err) {
      toast.error('Failed to create package');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Package</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-5xl"
      >
        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Title</Label>
            <Input {...register('title')} placeholder="Package Title" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Slug</Label>
            <Input {...register('slug')} placeholder="slug-url" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Price</Label>
            <Input type="number" {...register('price')} placeholder="Package Price" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Billing Cycle</Label>
            <select {...register('billingCycle')} className="w-full border rounded px-3 py-2">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </CardContent>
        </Card>

        {/* <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Plan ID</Label>
            <Input {...register('planId')} placeholder="e.g. basic-001" />
          </CardContent>
        </Card> */}

        <Card>
          <CardContent className="p-4 space-y-2">
            <Label>Category</Label>
            <select {...register('category')} className="w-full border rounded px-3 py-2">
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Services</CardTitle></CardHeader>
          <CardContent className="p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
             {services.map((svc) => (
  <label key={svc._id} className="flex items-center gap-2">
    <input
      type="checkbox"
      value={svc._id}
      checked={selectedServiceIds.includes(svc._id)}
      onChange={(e) => {
        const isChecked = e.target.checked;
        const updated = isChecked
          ? [...selectedServiceIds, svc._id]
          : selectedServiceIds.filter((id) => id !== svc._id);
        setValue('serviceIds', updated, { shouldValidate: true });
      }}
    />
    {svc.title}
  </label>
))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Features</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {featureFields.map((field, index) => (
              <Input key={field.id} {...register(`features.${index}`)} placeholder={`Feature ${index + 1}`} />
            ))}
            <Button type="button" onClick={() => appendFeature('')}>+ Add Feature</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="flex items-center gap-2">
            <input type="checkbox" {...register('isFeatured')} />
            <Label>Mark as Featured</Label>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Button type="submit" className="w-full">Create Package</Button>
        </div>
      </form>
    </div>
  );
}
