import { registerUser, loginUser, verifyOtp, resendOtp, forgotPassword, resetPassword } from "@/api/auth/auth";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";

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

  googleLogin: () => {
    window.location.href = `${API_BASE}/google`;
  },
  githubLogin: () => {
    window.location.href = `${API_BASE}/github`;
  },
};
