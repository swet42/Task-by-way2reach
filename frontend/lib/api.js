import axios from "axios";

const BASE_URL = "/api";
const ORG_ID = process.env.NEXT_PUBLIC_ORG_ID || "org2";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "x-organization-id": ORG_ID },
});

export const taskApi = {
  list: (page = 1, limit = 6) =>
    client.get("/tasks", { params: { page, limit } }),

  create: (data) =>
    client.post("/tasks", data),

  update: (id, data) =>
    client.put(`/tasks/${id}`, data),

  delete: (id) =>
    client.delete(`/tasks/${id}`),
};

export const commentApi = {
  list: (taskId, page = 1, limit = 10) =>
    client.get(`/tasks/${taskId}/comments`, { params: { page, limit } }),

  add: (taskId, text) =>
    client.post(`/tasks/${taskId}/comments`, { text }),

  update: (taskId, commentId, text) =>
    client.put(`/tasks/${taskId}/comments/${commentId}`, { text }),

  delete: (taskId, commentId) =>
    client.delete(`/tasks/${taskId}/comments/${commentId}`),
};
