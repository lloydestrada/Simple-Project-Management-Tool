//Member
import api from "@/app/lib/axios";

export const getMembers = () => api.get("/test01/get_all_member");

export const getMember = (id) => api.get(`/test01/get_member?id=${id}`);

export const createMember = (data) => api.post("/test01/create_member", data);

export const updateMember = (id, data) => api.patch(`/test01/update_member?id=${id}`, data);

export const deleteMember = (id) => api.delete(`/test01/delete_member?id=${id}`);
