import { BASEURL } from "@/constants";

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
