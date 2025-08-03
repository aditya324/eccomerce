'use client';

import { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { BASEURL } from '@/constants';
import Link from 'next/link';

type Category = {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
};

interface Props {
  categories: Category[];
  onCategoryDeleted: (id: string) => void;
  isDeleting?: boolean;
}

export default function CategoryTable({
  categories,
  onCategoryDeleted,
  isDeleting, // Use the prop as the source of truth
}: Props) {
  const router = useRouter();
  // FIX: Local isDeleting state is removed to rely on the prop.
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    // The parent component now controls the isDeleting state via its mutation hook.
    // The parent will call onCategoryDeleted, which triggers the API call.
    onCategoryDeleted(categoryToDelete._id);
    setCategoryToDelete(null); // Close the dialog after initiating the delete
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
    },
    {
      header: 'Slug',
      accessorKey: 'slug',
    },
    {
      header: 'Actions',
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
             
            >

              <Link href={`/dashboard/editCategory/${category._id}`}>
              Edit
              </Link>
              
            </Button>
            <Button
              variant="destructive"
              size="sm"
              // FIX: This now opens the dialog instead of deleting directly.
              onClick={() => setCategoryToDelete(category)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="w-full">
        <CardContent className="p-6 overflow-x-auto">
          <div className="flex justify-between mb-6">
            <h2 className="text-3xl font-bold">All Categories</h2>
            <Button onClick={() => router.push('./addCategories')}>Add Category</Button>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog
        open={!!categoryToDelete}
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category {categoryToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}