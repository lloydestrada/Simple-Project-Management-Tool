import api from "@/app/lib/axios";

export const signup = (userData) => {
  return api.post("/auth/signup", userData);
};
