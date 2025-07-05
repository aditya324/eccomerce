import { BASEURL } from "@/constants";
import { Category, CategoryWithServicesResponse } from "@/types/category";
import { GetServicesResponse } from "@/types/service";

import axios from "axios";

export const registerUser = async (formData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    console.log(formData);
    const res = await axios.post(`${BASEURL}/users/register`, formData);

    console.log("result", res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    console.log(formData);
    const res = await axios.post(`${BASEURL}/users/register`, formData);

    console.log("result", res.data);
  } catch (error) {
    console.log(error);
  }
};

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const res = await axios.get(`${BASEURL}/categories/getAllCategory`);
  
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getAllService = async (): Promise<GetServicesResponse> => {
  try {
    const res = await axios.get<GetServicesResponse>(
      `${BASEURL}/service/getAllService`
    );

    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch services");
  }
};

export const getCategoryBySlug =
  async (slug:string): Promise<CategoryWithServicesResponse> => {
    try {
      console.log("before", slug)
      const res = await axios.get<CategoryWithServicesResponse>(
        `${BASEURL}/categories/slug/${slug}`
      );

      console.log(res.data, "slug");
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error("failed to fetch Categories by slug");
    }
  };
