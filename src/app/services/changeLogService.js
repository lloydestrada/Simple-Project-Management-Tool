import api from "@/app/lib/axios";

export const getChangeLogs = () => api.get("/test04/get_all_logs");

export const getLogsByTask = (taskId) => api.get(`/test04/get_logs_by_task?taskId=${taskId}`);

export const getLogsByUser = (userId) => api.get(`/test04/get_logs_by_user?userId=${userId}`);

export const createChangeLog = (data) => api.post("/test04/create_changelog", data);
