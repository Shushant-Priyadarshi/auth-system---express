import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials:true,
})

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/user/login") && 
      !originalRequest.url.includes("/user/register") &&
      !originalRequest.url.includes("/user/verify-otp") &&
      !originalRequest.url.includes("/refresh-access-token")
    ) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post("/user/refresh-access-token");
        return axiosInstance(originalRequest); // retry original request
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
