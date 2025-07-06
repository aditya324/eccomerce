import { BASEURL } from "@/constants";
import { Category, CategoryWithServicesResponse } from "@/types/category";
import { GetServicesResponse } from "@/types/service";
import { GoogleCredentialPayload } from "@/types/user";

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
    const res = await axios.post(`${BASEURL}/users/login`, formData, {
      withCredentials: true,
    });
     console.log("result", res.data);
    return res.data

   
  } catch (error) {
    throw new Error(`invalid credentials please check your credentials `);
  }
};

export const googleLogin = async ({ idToken }: GoogleCredentialPayload) => {
  try {
    const res = await axios.post(
      `${BASEURL}/users/google`,
      { idToken },
      { withCredentials: true }
    );

    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw new Error("failed to login please login later");
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

export const getCategoryBySlug = async (
  slug: string
): Promise<CategoryWithServicesResponse> => {
  try {
    console.log("before", slug);
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
