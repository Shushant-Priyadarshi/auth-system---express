import { axiosInstance } from "@/lib/axios";


export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/user/user-profile");
  return response.data.data;
};

