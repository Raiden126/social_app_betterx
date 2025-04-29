import { registerUser, loginUser, verifyOtp, resendOtp, forgotPassword, resetPassword, logOut } from "@/api/auth/auth";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";
import axiosInstance from "@/utils/axiosInstance";

const API_BASE = import.meta.env.VITE_REACT_APP_API_ENDPOINT + "/api/users";
export const authService = {
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      return await registerUser(userData);
    } catch (error) {
      throw error;
    }
  },

  login: async (userData: LoginData): Promise<AuthResponse> => {
    try {
      return await loginUser(userData);
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (userData: { email: string }): Promise<AuthResponse> => {
    try {
      return await forgotPassword(userData);
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (userData: { token: string; password: string; newPassword: string }): Promise<AuthResponse> => {
    try {
      return await resetPassword(userData);
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (otp: string, email: string): Promise<AuthResponse> => {
    try {
      return await verifyOtp(otp, email);
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (email: string): Promise<AuthResponse> => {
    try {
      return await resendOtp(email);
    } catch (error) {
      throw error;
    }
  },

  refreshToken: async () => {
    try {
      await axiosInstance.post('/users/refresh-token');
    } catch (error: any) {
      throw error?.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await logOut();
    } catch (error: any) {
      throw error?.response?.data || error.message;
    }
  },

  googleLogin: () => {
    window.location.href = `${API_BASE}/google`;
  },
  githubLogin: () => {
    window.location.href = `${API_BASE}/github`;
  },

  getProfile: async () => {
      const response = await axiosInstance.get('/users/me', { withCredentials: true });
      return response.data;
  }
};
