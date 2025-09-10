import api from "@/app/lib/axios";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);
  if (res.data.success) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};
