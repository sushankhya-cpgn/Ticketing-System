
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import Cookies from "js-cookie";
import api from "../../src/api/axiosClient";

const accessTokenFromCookie = Cookies.get("accessToken") || null;
const refreshTokenFromCookie = Cookies.get("refreshToken") || null;
const userInfoCookie = Cookies.get("userInfo");
const parsedUserInfo = userInfoCookie ? JSON.parse(userInfoCookie) : null;

// ----------------------------
// Types
// ----------------------------
interface AuthState {
  loading: boolean;
  userID: number | null;
  displayName: string | null;
  role: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  expiration: string | null;
  error: string | null;
}

// ----------------------------
// Initial State
// ----------------------------
const initialState: AuthState = {
  loading: false,
  userID: parsedUserInfo?.userID || null,
  displayName: parsedUserInfo?.displayName || null,
  role: parsedUserInfo?.role || null,
  accessToken: accessTokenFromCookie,
  refreshToken: refreshTokenFromCookie,
  expiration: null,
  error: null,
};

interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiration: string;
  displayName: string;
  role: string;
  userID: number;
}

interface MeResponse {
  allTasks?: any[];
}
// ----------------------------
// LOGIN Thunk
// ----------------------------

export const loginUser = createAsyncThunk<
  LoginResponse & MeResponse,   // return type
  LoginCredentials,             // argument type
  { rejectValue: string }       // error type
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // 1️⃣ Login
      const loginResponse = await api.post("/Auth/login", credentials);
      const data = loginResponse.data.data;

      // Save tokens
      Cookies.set("accessToken", data.accessToken);
      Cookies.set("refreshToken", data.refreshToken);

      // Save user info
      Cookies.set(
        "userInfo",
        JSON.stringify({
          userID: data.userID,
          displayName: data.displayName,
          role: data.role,
        })
      );


      const meResponse = await api.get("/Auth/me", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      console.log(meResponse.data);

      const meData = meResponse.data.data;

      console.log(meData);

      // Save tasks to localStorage
      if (meData) {
        localStorage.setItem("tasks", JSON.stringify(meData.allTasks));
      }

      // Optionally update user info from /auth/me if needed
      return {
        ...data,
        ...meData, // merge additional fields like tasks, expiration, etc.
      };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed. Try again."
      );
    }
  }
);



// ----------------------------
// LOGOUT Thunk
// ----------------------------
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  localStorage.removeItem("tasks");

  return true;
});

// ----------------------------
// Slice
// ----------------------------
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.userID = null;
      state.displayName = null;
      state.role = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiration = null;
      state.error = null;

      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
    },
  },

  extraReducers: (builder) => {
    builder
      // =======================
      // LOGIN
      // =======================
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.userID = action.payload.userID;
        state.displayName = action.payload.displayName;
        state.role = action.payload.role;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.expiration = action.payload.expiration;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // =======================
      // LOGOUT
      // =======================
      .addCase(logoutUser.fulfilled, (state) => {
        state.userID = null;
        state.displayName = null;
        state.role = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiration = null;
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;

