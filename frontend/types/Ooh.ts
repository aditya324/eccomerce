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

