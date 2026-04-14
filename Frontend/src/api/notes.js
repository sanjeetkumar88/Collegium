import apiClient from "./apiClient";

export const uploadNotes = (data) => apiClient.post("/notes/upload", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getNotes = (params) => apiClient.get("/notes/getnotes", { params });
export const getUserNotes = () => apiClient.get("/notes/getusernotes");
export const deleteNote = (id) => apiClient.delete(`/notes/deletenote/${id}`);
export const updateNote = (id, data) => apiClient.patch(`/notes/updatenote/${id}`, data);
