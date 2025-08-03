
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { BASEURL } from '@/constants';
import { useRouter, useParams } from 'next/navigation';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function UpdateCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  // Effect to fetch the category data and pre-populate the form
  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${BASEURL}/categories/${categoryId}`);
        console.log(data, "data")
        
        // --- FIX: Access the nested 'category' object before resetting the form ---
        if (data && data.category) {
          reset(data.category);
        } else {
          toast.error('Category not found.');
          router.push('/dashboard/categories');
        }
      } catch (error) {
        toast.error('Failed to fetch category data.');
        console.error(error);
        router.push('/dashboard/categories');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategory();
  }, [categoryId, reset, router]);

  const onSubmit = async (data: CategoryForm) => {
    setIsSubmitting(true);
    try {
      await axios.put(`${BASEURL}/categories/update/${categoryId}`, data, {
        withCredentials: true,
      });
      toast.success('Category updated successfully!');
    //   router.push('/dashboard/categories');
    } catch (error) {
      toast.error('Failed to update category');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start p-10 bg-muted/5">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Update Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} placeholder="e.g. Electronics" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register('slug')} placeholder="e.g. electronics" />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Update Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
