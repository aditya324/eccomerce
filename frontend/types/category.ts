export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


export interface ServiceSummary {
  _id: string;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
  rating: number;
  isFeatured: boolean;
}

export interface CategoryWithServicesResponse {
  category: Category;
  services: ServiceSummary[];
}