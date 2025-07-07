"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BASEURL } from '@/constants';

export default function PackageTablePage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BASEURL}/package/getAllPackages`)
      .then(({ data }) => setPackages(data))
      .catch(() => setError('Failed to load packages'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading packages…</p>;
  if (error) return <p className="text-center mt-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="flex justify-center p-10 bg-muted/5">
      <Card className="w-full max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">All Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="mx-auto text-lg">
              <TableCaption>List of all package plans</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Billing</TableHead>
                  <TableHead>Services</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packages.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell>{pkg.title}</TableCell>
                    <TableCell>{pkg.slug}</TableCell>
                    <TableCell>₹{pkg.price.toLocaleString()}</TableCell>
                    <TableCell>{pkg.billingCycle}</TableCell>
                    <TableCell>
                      {pkg.serviceIds.map((s) => s.title).join(', ')}
                    </TableCell>
                    <TableCell>
                      {pkg.features.join(', ')}
                    </TableCell>
                    <TableCell>{pkg.category}</TableCell>
                    <TableCell>{pkg.isFeatured ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
