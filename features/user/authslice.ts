import { createSlice } from "@reduxjs/toolkit";
import {
  userLogin,
  registerUser,
  fetchUserProfile,
  refreshtoken,
  userLogout,
} from "./authActions";
import Cookies from "js-cookie";

interface AuthState {
  loading: boolean;
  userInfo: Record<string, any> | null;
  access_token: string | null;
  refresh_token: string | null;
  error: string | null;
  success: boolean;
}

const initialState: AuthState = {
  loading: false,
  userInfo: Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo") as string)
    : null,
  access_token: Cookies.get("access_token") || null,
  refresh_token: Cookies.get("refresh_token") || null,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        // state.access_token = payload.access_token;
        // state.refresh_token = payload.refresh_token;
        state.access_token = payload.accessToken;
        state.refresh_token = payload.refreshToken;
      })
      .addCase(userLogin.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })
      // Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload;
      })
      .addCase(fetchUserProfile.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
      })
      // Refresh token
      .addCase(refreshtoken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshtoken.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.access_token = payload.accessToken;
        if (payload.refreshToken) {
          state.refresh_token = payload.refreshToken;
        }
      })
      .addCase(refreshtoken.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || null;
        state.access_token = null;
        state.refresh_token = null;
        state.userInfo = null;
      })
      // Logout
      .addCase(userLogout.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.access_token = null;
        state.refresh_token = null;
        state.success = false;
        state.userInfo = null;
      });
  },
});

export default authSlice.reducer;
