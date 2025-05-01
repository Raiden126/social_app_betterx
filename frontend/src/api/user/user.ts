import axiosInstance from "@/utils/axiosInstance";

export const getAuthUserProfile = async () => {
    try {
        const response = await axiosInstance.get("/v1/users/get-auth-user");
        return response.data;
    } catch (error: any) {
        console.error("Error fetching user profile:", error);
        throw error.response?.data || error.message;
    }
}

export const updateUserProfile = async (userData: any) => {
    try {
        const response = await axiosInstance.put("/v1/users/update-user", userData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error: any) {
        console.error("Error updating user profile:", error);
        throw error.response?.data || error.message;
    }
}