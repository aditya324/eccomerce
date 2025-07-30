export interface ServicePackage {
  _id: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
}

export interface Faq {
  _id: string;
  question: string;
  answer: string;
}

export interface Service {
  _id: string;
  title: string;
  slug: string;
  categoryId: string;
  vendorName: string;
  price: number;
  thumbnail: string;
  videoUrl: string;
  includes: string[];
  description: string;
  packages: ServicePackage[];
  faqs: Faq[];
  rating: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetServicesResponse {
  message: string;
  service: Service[];
}



interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string; // Or Date
  [key: string]: any;
}

// NOTE: The structure for this is still a sample.
// Adjust it to match your actual data.
interface ServiceItem {
  _id: string;
  name: string;
  description: string;
  // ... other properties
}

interface CategoryWithServices {
  data: Category;
  services: ServiceItem[];
}


export interface OOHService {
  _id: string;
  title: string;
  slug?: string;
  price: number;
  isOOH?: boolean; // ← Add this
  packages?: { price: number }[];
}