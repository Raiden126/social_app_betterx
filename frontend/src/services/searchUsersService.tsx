import {
  getAllUsers,
  viewProfile,
  followUser,
} from "@/api/searchusers/searchusers";

export const searchUsersService = {
  getAllUsers: async () => {
    try {
      return await getAllUsers();
    } catch (error) {
      throw error;
    }
  },

  viewProfile: async (username: string) => {
    try {
      return await viewProfile(username);
    } catch (error) {
      throw error;
    }
  },

  followUser: async (user_id: string) => {
    try {
      return await followUser(user_id);
    } catch (error) {
      throw error;
    }
  },
};
