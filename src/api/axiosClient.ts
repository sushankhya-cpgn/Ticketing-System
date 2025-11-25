// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL as string,
// });

// export default api;



// import axios from "axios";
// import Cookies from "js-cookie";
// import { toast } from "react-toastify";

// const api = axios.create({
//   baseURL: "http://192.168.5.8/api",
//   timeout: 10000,
// });

// // REQUEST interceptor → Attach Access Token automatically
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("accessToken");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // RESPONSE interceptor → Auto refresh token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const original = error.config;

//     // If token expired
//     if (error.response?.status === 401 && !original._retry) {
//       original._retry = true;

//       try {
//         const refreshToken = Cookies.get("refreshToken");
//         const res = await axios.post("http://192.168.5.8/api/Auth/refresh-token", {
//           refreshToken,
//         });

//         Cookies.set("accessToken", res.data.data.accessToken);

//         original.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
//         return api(original);
//       } catch (err) {
//         Cookies.remove("accessToken");
//         Cookies.remove("refreshToken");
//         window.location.href = "/login";
//         toast.error("Session expired. Please log in again.");
//         console.error("Refresh token failed:", err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


//ai

import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";


// Create axios instance
const api = axios.create({
  baseURL: "http://192.168.5.8/api",
  timeout: 10000,
});

// ----------------------------
// REQUEST INTERCEPTOR
// Attach access token to every request
// ----------------------------
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

// ----------------------------
// RESPONSE INTERCEPTOR
// Auto refresh token if expired
// ----------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Skip refresh for login & refresh-token endpoints
    if (
      original.url.includes("/Auth/login") ||
      original.url.includes("/Auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    // Handle 401 errors (token expired)
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          // No refresh token → just reject
          return Promise.reject(error);
        }

        // Call refresh token API
        const res = await axios.post("http://192.168.5.8/api/Auth/refresh-token", {
          refreshToken,
        });

        const newAccessToken = res.data.data.accessToken;

        // Update cookies
        Cookies.set("accessToken", newAccessToken, { expires: 7 });

        // Update original request with new token
        original.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(original);
      } catch (err) {
        // Refresh failed → logout
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("userInfo");

        toast.error("Session expired. Please log in again.");
        console.error("Refresh token failed:", err);

        // Let React handle redirect via ProtectedRoute
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
