'use client';

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
}

const columns: ColumnDef<Category>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Slug",
    accessorKey: "slug",
  },
  {
    header: "Icon",
    accessorKey: "icon",
    cell: ({ getValue }) => (
      <img src={getValue() as string} alt="icon" className="h-10 w-10 object-cover rounded" />
    ),
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Edit category", category)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            // onClick={() => handleDelete(category._id)}
          >
            Delete
          </Button>
        </div>
      );
    },
  },
];


export default function CategoryTable({ categories }: Props) {

    const router=useRouter()
  const table = useReactTable({
    data: categories,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="w-full">
  <CardContent className="p-6 overflow-x-auto">
    <div className='flex justify-between'>
        <h2 className="text-3xl font-bold mb-6">All Categories</h2>
     <Button onClick={()=>router.push(' addCategories')}>Add Categories</Button>
    </div>

    <div className="min-w-[1000px]">
      <Table className="w-full">
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="border-b-2">
              {headerGroup.headers.map(header => (
                <TableHead key={header.id} className="text-lg p-4">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} className="hover:bg-muted/50 transition-all">
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="py-4 px-6 text-base">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>

  );
}
