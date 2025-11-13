import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type { AppDispatch, RootState } from "../../app/store";
import api from "../../src/api/axiosClient";

interface LoginParams {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
  displayName: string;
  role: string;
}

interface ApiResponse<T> {
  isSucceed: boolean;
  statusCode: number;
  message: string;
  data: T;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

// const backendURL = "http://192.168.1.25:5056";

// Global variables to handle race conditions
let refreshPromise: Promise<any> | null = null;
let isRefreshing = false;

// Helper function to safely refresh token
const safeRefreshToken = async (dispatch: AppDispatch) => {
  if (refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = dispatch(refreshtoken());

  try {
    const result = await refreshPromise;
    return result;
  } finally {
    refreshPromise = null;
    isRefreshing = false;
  }
};

// LOGIN
export const userLogin = createAsyncThunk<
  LoginResponse,
  LoginParams,
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    const { data } = await api.post<ApiResponse<LoginResponse>>(
      '/Auth/login',
      { username, password },
      { headers: { "Content-Type": "application/json" } }
    );

   

    if (!data.isSucceed) {
      return rejectWithValue(data.message || "Login failed");
    }

    const userData = data.data;
    console.log(userData)

   const  roleTasks = await api.get(
      '/Auth/me',
      {
        headers:{
          Authorization:`Bearer ${userData?.accessToken}`
        }
      }
     
    );

    console.log(roleTasks.data.data.roleTasks)

    // Store tokens in cookies
    Cookies.set("access_token", userData.accessToken, {
      expires: 1 / 24,
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("refresh_token", userData.refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });
    // Cookies.set("userInfo", JSON.stringify(userData.displayName), {
    //   expires: 7,
    //   secure: true,
    //   sameSite: "Strict",
    // });
    Cookies.set("userInfo", JSON.stringify(userData), {
  expires: 7,
  secure: true,
  sameSite: "Strict",
});

console.log("All tasks", roleTasks.data.data.allTasks)

localStorage.setItem("Tasks",JSON.stringify( roleTasks.data.data.allTasks));

    // Cookies.set("task",JSON.stringify(roleTasks.data.data.allTasks), {
    //   expires: 7,
    //   secure: false,
    //   sameSite: "Strict",
    // });

    return userData;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || err.message || "Login Failed");
  }
});

// REGISTER
export const registerUser = createAsyncThunk<
  unknown,
  { firstName: string; email: string; password: string },
  { rejectValue: string }
>("auth/register", async ({ firstName, email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `$/api/v1/users`,
      { name: firstName, email, password },
      { headers: { "Content-type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    if (err.response?.data?.message) return rejectWithValue(err.response.data.message);
    return rejectWithValue(err.message);
  }
});

// FETCH USER PROFILE
export const fetchUserProfile = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string; dispatch: AppDispatch; state: RootState }
>("auth/fetchProfile", async (_, { rejectWithValue, dispatch }) => {
  try {
    let token = Cookies.get("access_token");

    // If no access token, attempt refresh
    if (!token) {
      const refresh_token = Cookies.get("refresh_token");
      if (refresh_token) {
        const refreshResult = await safeRefreshToken(dispatch);

        if (refreshtoken.fulfilled.match(refreshResult)) {
          token = Cookies.get("access_token");
          if (!token) {
            await dispatch(userLogout());
            return rejectWithValue("Session expired. Please login again.");
          }
        } else {
          await dispatch(userLogout());
          return rejectWithValue("Token refresh failed. Please login again.");
        }
      } else {
        await dispatch(userLogout());
        return rejectWithValue("No access or refresh token available.");
      }
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await api.get<ApiResponse<LoginResponse>>(`/Auth/me`, config);

    if (!data.isSucceed) {
      return rejectWithValue(data.message || "Failed to fetch user profile");
    }

    const userData = data.data;
    console.log('user data: ',userData)
    const existingUserInfo = Cookies.get("userInfo");
    if (existingUserInfo !== JSON.stringify(userData)) {
      Cookies.set("userInfo", JSON.stringify(userData), { expires: 7, secure: true, sameSite: "Strict" });
    }

    return userData;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;

    // Handle 401 with retry logic
    if (err.response?.status === 401) {
      try {
        const refreshResult = await safeRefreshToken(dispatch);
        if (refreshtoken.fulfilled.match(refreshResult)) {
          const new_access_token = Cookies.get("access_token");
          if (!new_access_token) {
            await dispatch(userLogout());
            return rejectWithValue("Session expired. Please login again.");
          }

          const retryConfig = { headers: { Authorization: `Bearer ${new_access_token}` } };
          const { data } = await api.get<ApiResponse<LoginResponse>>('Auth/me', retryConfig);

          if (!data.isSucceed) {
            return rejectWithValue(data.message || "Failed to fetch user profile");
          }

          const userData = data.data;
          const existingUserInfo = Cookies.get("userInfo");
          if (existingUserInfo !== JSON.stringify(userData)) {
            Cookies.set("userInfo", JSON.stringify(userData), { expires: 7, secure: true, sameSite: "Strict" });
          }

          return userData;
        } else {
          await dispatch(userLogout());
          return rejectWithValue("Token refresh failed. Please login again.");
        }
      } catch {
        await dispatch(userLogout());
        return rejectWithValue("Session expired. Please login again.");
      }
    }

    await dispatch(userLogout());
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// REFRESH TOKEN
export const refreshtoken = createAsyncThunk<
  RefreshTokenResponse,
  void,
  { rejectValue: string }
>("auth/refreshToken", async (_, { rejectWithValue }) => {
  try {
    const refresh_token = Cookies.get("refresh_token");
    if (!refresh_token) {
      Cookies.remove("access_token");
      return rejectWithValue("No refresh token available");
    }

    const { data } = await api.post<ApiResponse<RefreshTokenResponse>>(
      '/Auth/refresh-token',
      { refreshToken: refresh_token },
      { headers: { "Content-type": "application/json" } }
    );

    if (!data.isSucceed) {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      return rejectWithValue(data.message || "Token refresh failed");
    }

    const tokens = data.data;

    Cookies.set("access_token", tokens.accessToken, { expires: 1 / 24, secure: true, sameSite: "Strict" });
    if (tokens.refreshToken)
      Cookies.set("refresh_token", tokens.refreshToken, { expires: 7, secure: true, sameSite: "Strict" });

    return tokens;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // Cookies.remove("userInfo");
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

// LOGOUT
export const userLogout = createAsyncThunk<null, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      refreshPromise = null;
      isRefreshing = false;
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.remove("userInfo");
      localStorage.removeItem("Tasks");
      return null;
    } catch (error) {
      const err = error as Error;
      return rejectWithValue(err.message);
    }
  }
);

// Utility to check refresh status
export const getRefreshStatus = () => ({ isRefreshing, refreshPromise });
