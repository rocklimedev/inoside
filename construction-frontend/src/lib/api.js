import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

const api = axios.create({ baseURL: API });

export const listProjects = () => api.get("/projects").then((r) => r.data);
export const getProject = (id) => api.get(`/projects/${id}`).then((r) => r.data);
export const createProject = (data) => api.post("/projects", data).then((r) => r.data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data);
export const deleteProject = (id) => api.delete(`/projects/${id}`).then((r) => r.data);
export const duplicateProject = (id) => api.post(`/projects/${id}/duplicate`).then((r) => r.data);

export const getRates = () => api.get("/rates").then((r) => r.data);
export const updateRates = (rates) => api.put("/rates", { rates }).then((r) => r.data);
export const resetRates = () => api.post("/rates/reset").then((r) => r.data);

export const getStats = () => api.get("/stats").then((r) => r.data);

export default api;
