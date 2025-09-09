//Login
import api from "@/app/lib/axios";

export const login = (credentials) => api.post("/testlogin", credentials);
