import apiClient from "./apiClient";

export const login = (data) => apiClient.post("/users/login", data);
export const register = (data) => apiClient.post("/users/register", data);
export const verify = () => apiClient.get("/users/verify");
export const logout = () => apiClient.post("/users/logout");
export const getCurrentUser = () => apiClient.get("/users/current-user");
export const updateAccount = (data) => apiClient.patch("/users/account/update", data);
export const changePassword = (data) => apiClient.post("/users/change-password", data);
export const getAllTeachers = () => apiClient.get("/users/getallteachers");
export const getAllStudents = () => apiClient.get("/users/getallstudents");

// Profile specific
export const getUserProfile = () => apiClient.get("/users/profile");
export const updateProfile = (data) => apiClient.patch("/users/profile/update", data);
export const updateAvatar = (formData) => apiClient.patch("/users/avatar/update", formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
