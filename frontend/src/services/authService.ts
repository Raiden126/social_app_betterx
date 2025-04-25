import { registerUser, loginUser } from "@/api/auth/auth";
import { LoginData, RegisterData, AuthResponse } from "@/types/auth";

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
};
