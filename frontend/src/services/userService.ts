import { getAuthUserProfile, updateUserProfile } from "@/api/user/user";

export const userService = {
    getAuthUserProfile: async () => {
        return await getAuthUserProfile();
    },
    
    updateUserProfile: async (userData: any) => {
        return await updateUserProfile(userData);
    }
}