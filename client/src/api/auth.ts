import type { LoginResponse } from "@/features/response";
import { axiosInstance } from "@/lib/axios.ts";
import type { CredentialResponse } from "@react-oauth/google";

//login user
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/user/login", {
    email,
    password,
  });
  return response.data;
};

//signup user
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

//verify otp
export const verifyOTP = async (email: string, otp: string) => {
  const response = await axiosInstance.post("/user/verify-otp", {
    email,
    otp,
  });
  return response.data;
};

//logout user
export const logoutUser = async () => {
  await axiosInstance.post("/user/logout");
};

//forgot password
export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post("/user/forgot-password", { email });
  return response.data;
};

//change password
export const changePassword = async (token: string, newPassword: string) => {
  const response = await axiosInstance.post("/user/change-password", {
    token,
    newPassword,
  });
  return response.data;
};

//google login
 export const handleGoogleSuccess = async (credentialResponse:CredentialResponse) => {
  const res = await axiosInstance.post("/user/google-login",{
    credential: credentialResponse.credential
  })
  return res.data
};
