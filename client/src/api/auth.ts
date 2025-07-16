import type { LoginResponse } from "@/features/response";
import { axiosInstance } from "@/lib/axios.ts";

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {

    const response = await axiosInstance.post("/user/login", {
      email,
      password,
    });
   return response.data
};

export const SignUpUser = async (
  name: string,
  email: string,
  password: string
) => {
    const response = await axiosInstance.post("/user/register", {
      name,
      email,
      password,
    });
    return response.data;
};

export const verifyOTP = async (email: string, otp: string) => {
    const response = await axiosInstance.post("/user/verify-otp", {
      email,
      otp,
    });
    return response.data;
};

export const logoutUser = async () => {
  await axiosInstance.post("/user/logout");
  
};
