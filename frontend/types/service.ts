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
