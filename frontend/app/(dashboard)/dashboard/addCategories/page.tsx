'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'sonner';
import { BASEURL } from '@/constants';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  // icon: z.string().url('Icon must be a valid URL'),
});

type CategoryForm = z.infer<typeof categorySchema>;

export default function AddCategoryPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryForm) => {
    try {
      await axios.post(`${BASEURL}/categories/addCategory`, data, {
        withCredentials: true,
      });
      toast.success('Category added successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to add category');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-10 bg-muted/5">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Add New Category</CardTitle>
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

            {/* <div className="space-y-2">
              <Label htmlFor="icon">Icon URL</Label>
              <Input id="icon" {...register('icon')} placeholder="https://example.com/icon.png" />
              {errors.icon && <p className="text-sm text-red-500">{errors.icon.message}</p>}
            </div> */}

            <Button type="submit" className="w-full">
              Add Category
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
