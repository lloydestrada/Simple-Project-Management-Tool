import api from "@/app/lib/axios";

export const getTasks = () => api.get("/test03/get_all_task");

export const getTask = (id) => api.get(`/test03/get_task?id=${id}`);

export const createTask = (data) => api.post("/test03/create_task", data);

export const updateTask = (id, data) => api.patch(`/test03/patch_task?id=${id}`, data);

export const deleteTask = (id) => api.delete(`/test03/delete_task?id=${id}`);
