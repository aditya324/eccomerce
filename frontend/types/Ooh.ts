// For an individual package within a subcategory
export interface Package {
  _id: string;
  title: string;
  price: number;
  billingCycle: 'monthly' | 'yearly' | string; // Using a union type for known values
  features: string[];
  planId: string;
}

// For a subcategory that contains packages
export interface Subcategory {
  _id: string;
  name: string;
  packages: Package[];
}

// For a single FAQ item
export interface Faq {
  _id: string;
  question: string;
  answer: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  city: string;
  vendorName:string,
  price:number,
  packages:[],
  category: 'Static' | 'Digital' | string; 
  description: string[];
  thumbnail: string;
  videoUrl: string;
  subcategories: Subcategory[];
  faqs: Faq[];
  isFeatured: boolean;
  createdAt: string; 
  updatedAt: string; 
  __v: number;
}


export interface OohApiResponse {
  service: Service[];
}


// types/oohService.ts

export type OohPackage = {
  _id: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  packageType: string;
  subType: string;
};

export type OohService = {
  _id: string;
  title: string;
  slug: string;
  categoryId: string;
  vendorName: string;
  price: number;
  thumbnail: string;
  videoUrl: string;
  includes: string[];
  description: string[];
  packages: OohPackage[];
  faqs: {
    question: string;
    answer: string;
    _id: string;
  }[];
  rating: number;
  isFeatured: boolean;
  isOOH: boolean;
  createdAt: string;
  updatedAt: string;
};



export interface OohServiceDetails {
  _id: string;
  title: string;
  slug: string;
  vendorName: string;
  thumbnail: string;
}

// An interface for a single payment log entry
export interface RenewalLog {
  paymentId: string;
  date: string;
  amount: number;
  status: string;
}

// The main interface for the OohSubscription
// This is the interface you are trying to import in your component
export interface OohSubscription {
  oohServiceId: OohServiceDetails; // This field is populated
  packageId: string | null;
  subscriptionId: string;
  status: 'active' | 'created' | 'cancelled'; // Or whatever statuses you have
  currentStart: string;
  currentEnd: string | null;
  paymentId: string | null;
  paymentStatus: string;
  paymentSignature: string;
  nextBillingDate: string | null;
  renewalLogs: RenewalLog[];
}