import apiClient from "./apiClient";

export const login = (data) => apiClient.post("/users/login", data);
export const register = (data) => apiClient.post("/users/register", data);
export const logout = () => apiClient.post("/users/logout");
export const getCurrentUser = () => apiClient.get("/users/current-user");
export const updateAccount = (data) => apiClient.patch("/users/update-account", data);
export const changePassword = (data) => apiClient.post("/users/change-password", data);
export const getAllTeachers = () => apiClient.get("/users/getallteachers");
export const getAllStudents = () => apiClient.get("/users/getallstudents");
