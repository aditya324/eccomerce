"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import CreateOOHServicePlanButton from "./CreateOOHServicePlanButton";

type Package = {
  _id: string;
  title: string;
  price: number;
  billingCycle: string;
  planId?: string;
};

type Service = {
  _id: string;
  title: string;
  vendorName: string;
  price: number;
  isFeatured: boolean;
  createdAt: string;
  slug: string;
  packages: Package[];
};

export default function OOHServiceTable({ data }: { data: Service[] }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const router = useRouter();

  const columns = useMemo<ColumnDef<Service>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Vendor",
        accessorKey: "vendorName",
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: (info) => `₹${info.getValue()}`,
      },
      {
        header: "Featured",
        accessorKey: "isFeatured",
        cell: (info) => (info.getValue() ? "✅" : "❌"),
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        cell: (info) =>
          new Date(info.getValue() as string).toLocaleDateString(),
      },
      {
        header: "Slug",
        accessorKey: "slug",
      },
      {
        header: "Packages",
        accessorKey: "packages",
        cell: ({ row }) => (
          <div className="space-y-2">
            {row.original.packages.map((pkg) => (
              <div key={pkg._id} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{pkg.title}</p>
                  <p className="text-sm text-gray-600">
                    ₹{pkg.price.toLocaleString()} / {pkg.billingCycle}
                  </p>
                </div>
                <CreateOOHServicePlanButton
                  oohServiceId={row.original._id}
                  pkgId={pkg._id}
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const service = row.original;
          return (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  router.push(`/dashboard/oohservice/update/${service._id}`)
                }
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => console.log("Delete", service._id)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <input
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search OOH services..."
          className="border px-3 py-2 rounded-md w-64"
        />
      </div>

      <table className="w-full border border-gray-300 mb-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="border px-4 py-2 text-left cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted() === "asc" && " 🔼"}
                  {header.column.getIsSorted() === "desc" && " 🔽"}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                No results found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="flex items-center justify-between text-sm">
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
