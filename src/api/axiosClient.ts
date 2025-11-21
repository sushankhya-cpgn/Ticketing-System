// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL as string,
// });

// export default api;



import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://192.168.5.8/api",
  timeout: 10000,
});

// REQUEST interceptor → Attach Access Token automatically
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE interceptor → Auto refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // If token expired
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");
        const res = await axios.post("http://192.168.5.8/api/Auth/refresh-token", {
          refreshToken,
        });

        Cookies.set("accessToken", res.data.data.accessToken);

        original.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        return api(original);
      } catch (err) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        toast.error("Session expired. Please log in again.");
        console.error("Refresh token failed:", err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
