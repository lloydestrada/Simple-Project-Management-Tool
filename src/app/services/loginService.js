import api from "@/app/lib/axios";

export const login = async (credentials) => {
  const res = await api.post("/auth/login", credentials);

  if (res.data.success) {
    localStorage.setItem("token", res.data.token);


    localStorage.setItem(
      "user",
      JSON.stringify({
        userId: res.data.user_id,
        username: res.data.username,
      })
    );
  }

  return res;
};
