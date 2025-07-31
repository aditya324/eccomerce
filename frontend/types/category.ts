// types/category.ts
import { Service as FullService } from "@/types/service"; // Import the complete Service type

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CategoryWithServicesResponse {
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  services: FullService[]; // Use imported full Service
}
