import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

// Query APIs
export const queryAPI = {
  ask: (question, documentIds = []) =>
    api.post("/query/ask", { question, documentIds }),
  askStream: (question, documentIds = []) =>
    api.post("/query/ask-stream", { question, documentIds })
};

// Document APIs
export const documentAPI = {
  list: () => api.get("/documents"),
  getDetails: (documentId) => api.get(`/documents/${documentId}`),
  delete: (documentId) => api.delete(`/documents/${documentId}`),
  share: (documentId, userIds) =>
    api.post(`/documents/${documentId}/share`, { userIds })
};

// Upload APIs
export const uploadAPI = {
  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard/overview"),
  getStats: (startDate, endDate) =>
    api.get("/admin/stats", { params: { startDate, endDate } }),
  getUsers: (page = 1, limit = 10, role = "", search = "") =>
    api.get("/admin/users", { params: { page, limit, role, search } }),
  getUserStats: (userId) => api.get(`/admin/user/${userId}`),
  getDocumentStats: (documentId) => api.get(`/admin/document/${documentId}`),
  updateUserRole: (userId, role, permissions) =>
    api.put(`/admin/user/${userId}/role`, { role, permissions }),
  deactivateUser: (userId) => api.put(`/admin/user/${userId}/deactivate`),
  activateUser: (userId) => api.put(`/admin/user/${userId}/activate`),
  grantAccess: (userId, documentId) =>
    api.post("/admin/access/grant", { userId, documentId }),
  revokeAccess: (userId, documentId) =>
    api.post("/admin/access/revoke", { userId, documentId }),
  getHealth: () => api.get("/admin/health"),
  getAuditLogs: (page = 1, limit = 20) =>
    api.get("/admin/logs/audit", { params: { page, limit } })
};

export default api;
