
export interface PackageDetails {
  _id: string;
  title: string;
  slug: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | string;
  serviceIds: string[];
  features: string[];
  category: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  planId: string;
}


export interface Subscription {
  subscriptionId: string;
  packageId: PackageDetails;
  status: 'active' | 'cancelled' | 'inactive';
  currentStart: string; // Represents an ISO Date String
  currentEnd: string;   // Represents an ISO Date String
  paymentStatus: 'paid' | 'unpaid' | 'failed';
  renewalLogs: any[]; // You can define a more specific type if you know the log structure
  paymentId: string;
  paymentSignature: string;
}