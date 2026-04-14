import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Potentially clear auth state or redirect to login
      console.warn("Unauthorized, please log in.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
