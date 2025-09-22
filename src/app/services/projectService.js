// projectService.js
import api from "@/app/lib/axios";

export const getProjects = () => api.get("/test02/get_all_project");
export const getProject = (id) => api.get(`/test02/get_project?id=${id}`);
export const createProject = (data) => api.post("/test02/create_project", data);
export const updateProject = (id, data) => api.patch(`/test02/patch_project?id=${id}`, data);
export const deleteProject = (id) => api.delete(`/test02/delete_project?id=${id}`);
