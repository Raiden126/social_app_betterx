import axiosInstance from "@/utils/axiosInstance";
import { LoginData, RegisterData, AuthResponse, ForgotPasswordData, ResetPasswordData } from "@/types/auth";

const API_BASE = import.meta.env.VITE_REACT_APP_API_ENDPOINT + "/api/users";

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

export const forgotPassword = async (userData: ForgotPasswordData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/users/forgot-password', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (userData: ResetPasswordData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/users/reset-password', userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}

export const verifyOtp = async (otp: string, email: string): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<AuthResponse>('/users/verify-user', { otp, email });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const resendOtp = async (email: string): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE}/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to resend OTP");
  }

  return response.json();
};
