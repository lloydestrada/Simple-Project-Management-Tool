import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// helper: check if URL is auth-related
function isAuthRequest(config) {
  const url = config.url || "";
  return url.startsWith("/auth");
}

api.interceptors.request.use(
  (config) => {
    if (isAuthRequest(config)) {
      console.log("[axios.js] Skipping token for auth request:", config.url);
      return config;
    }

    const token = localStorage.getItem("token");
    console.log("[axios.js] Found token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "[axios.js] Attached Authorization header:",
        config.headers.Authorization
      );
    } else {
      console.warn("[axios.js] No token found, skipping Authorization header");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
