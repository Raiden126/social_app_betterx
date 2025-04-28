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
    const response = await axiosInstance.post<AuthResponse>(
      "/users/login",
      userData,
      { withCredentials: true }
    );
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
    const response = await axiosInstance.post<AuthResponse>(
      "/users/verify-user",
      { otp, email },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const resendOtp = async (email: string): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(`${API_BASE}/resend-otp`, email, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.status) {
    throw new Error("Failed to resend OTP");
  }

  return response.data;
};

export const logOut = async () => {
  try {
    const response = await axiosInstance.post('/users/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
}