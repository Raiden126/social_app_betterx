import axiosInstance from "@/utils/axiosInstance";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/users/register', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (userData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/users/login', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
