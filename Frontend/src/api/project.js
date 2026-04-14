import apiClient from "./apiClient";

export const createProject = (data) => apiClient.post("/devproject/create-project", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const getProjects = (params) => apiClient.get("/devproject/getallproject", { params });
export const getProjectDetail = (id) => apiClient.get(`/devproject/getprojectdetail/${id}`);
export const joinProjectRequest = (id, data) => apiClient.post(`/devproject/join-project/${id}`, data);
export const handleJoinRequest = (id, data) => apiClient.post(`/devproject/approve-join-request/${id}`, data);
export const getProjectMembers = (id) => apiClient.get(`/devproject/getprojectmembers/${id}`);
export const leaveProject = (id) => apiClient.post(`/devproject/leave-project/${id}`);
export const deleteProject = (id) => apiClient.delete(`/devproject/delete-project/${id}`);
export const getJoinRequests = (id) => apiClient.get(`/devproject/getjoinrequests/${id}`);
export const updateProjectCoverImage = (id, data) => apiClient.patch(`/devproject/update-cover-image/${id}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
export const updateProjectDetails = (id, data) => apiClient.patch(`/devproject/update-project-details/${id}`, data);
