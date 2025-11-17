// import { createSlice } from "@reduxjs/toolkit";
// import {
//   userLogin,
//   registerUser,
//   fetchUserProfile,
//   refreshtoken,
//   userLogout,
// } from "./authActions";
// import Cookies from "js-cookie";

// interface AuthState {
//   loading: boolean;
//   userInfo: Record<string, any> | null;
//   access_token: string | null;
//   refresh_token: string | null;
//   error: string | null;
//   success: boolean;

// }

// const initialState: AuthState = {
//   loading: false,
//   userInfo: Cookies.get("userInfo")
//     ? JSON.parse(Cookies.get("userInfo") as string)
//     : null,
//   access_token: Cookies.get("access_token") || null,
//   refresh_token: Cookies.get("refresh_token") || null,
//   error: null,
//   success: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(userLogin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(userLogin.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         // state.access_token = payload.access_token;
//         // state.refresh_token = payload.refresh_token;
//         state.access_token = payload.accessToken;
//         state.refresh_token = payload.refreshToken;
//       })
//       .addCase(userLogin.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(registerUser.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })
//       // Profile
//       .addCase(fetchUserProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUserProfile.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.userInfo = payload;
//       })
//       .addCase(fetchUserProfile.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })
//       // Refresh token
//       .addCase(refreshtoken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refreshtoken.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.access_token = payload.accessToken;
//         if (payload.refreshToken) {
//           state.refresh_token = payload.refreshToken;
//         }
//       })
//       .addCase(refreshtoken.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//         state.access_token = null;
//         state.refresh_token = null;
//         state.userInfo = null;
//       })
//       // Logout
//       .addCase(userLogout.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//         state.access_token = null;
//         state.refresh_token = null;
//         state.success = false;
//         state.userInfo = null;
//       });
//   },
// });

// export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";
// import {
//   userLogin,
//   registerUser,
//   fetchUserProfile,
//   refreshtoken,
//   userLogout,
// } from "./authActions";
// import Cookies from "js-cookie";

// interface AuthState {
//   loading: boolean;
//   access_token: string | null;
//   refresh_token: string | null;
//   error: string | null;
//   success: boolean;
//   userID:number | null;
// }

// const initialState: AuthState = {
//   loading: false,
//   access_token: Cookies.get("access_token") || null,
//   refresh_token: Cookies.get("refresh_token") || null,
//   error: null,
//   success: false,
//   userID: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(userLogin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(userLogin.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.access_token = payload.accessToken;
//         state.refresh_token = payload.refreshToken;
//         state.userID = payload.userID || null;
        
//       })
//       .addCase(userLogin.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(registerUser.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })
//       // Refresh token
//       .addCase(refreshtoken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refreshtoken.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.access_token = payload.accessToken;
//         if (payload.refreshToken) {
//           state.refresh_token = payload.refreshToken;
//         }
//       })
//       .addCase(refreshtoken.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//         state.access_token = null;
//         state.refresh_token = null;
//       })
//       // Logout
//       .addCase(userLogout.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//         state.access_token = null;
//         state.refresh_token = null;
//         state.success = false;
//       });
//   },
// });

// export default authSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";
// import {
//   userLogin,
//   registerUser,
//   refreshtoken,
//   userLogout,
// } from "./authActions";
// import Cookies from "js-cookie";

// interface AuthState {
//   loading: boolean;
//   access_token: string | null;
//   refresh_token: string | null;
//   error: string | null;
//   success: boolean;
//   userID: number | null;
// }

// const initialState: AuthState = {
//   loading: false,
//   access_token: Cookies.get("access_token") || null,
//   refresh_token: Cookies.get("refresh_token") || null,
//   error: null,
//   success: false,
//   userID: Cookies.get("userID") ? Number(Cookies.get("userID")) : null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // Login
//       .addCase(userLogin.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(userLogin.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.access_token = payload.accessToken;
//         state.refresh_token = payload.refreshToken;
//         state.userID = payload.userID || null;

//         // Persist userID in cookies
//         if (payload.userID) {
//           Cookies.set("userID", payload.userID.toString(), {
//             expires: 7,
//             secure: true,
//             sameSite: "Strict",
//           });
//         }
//       })
//       .addCase(userLogin.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })

//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerUser.fulfilled, (state) => {
//         state.loading = false;
//         state.success = true;
//       })
//       .addCase(registerUser.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//       })

//       // Refresh token
//       .addCase(refreshtoken.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(refreshtoken.fulfilled, (state, { payload }) => {
//         state.loading = false;
//         state.access_token = payload.accessToken;
//         if (payload.refreshToken) {
//           state.refresh_token = payload.refreshToken;
//         }
//       })
//       .addCase(refreshtoken.rejected, (state, { payload }) => {
//         state.loading = false;
//         state.error = payload || null;
//         state.access_token = null;
//         state.refresh_token = null;
//         state.userID = null;
//       })

//       // Logout
//       .addCase(userLogout.fulfilled, (state) => {
//         state.loading = false;
//         state.error = null;
//         state.access_token = null;
//         state.refresh_token = null;
//         state.success = false;
//         state.userID = null;

//         // Remove userID cookie
//         Cookies.remove("userID");
//       });
//   },
// });

// export default authSlice.reducer;

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
// ----------------------------
// LOGIN Thunk
// ----------------------------
// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post("/Auth/login", credentials);
//       const data = response.data.data;

     

//       Cookies.set("accessToken", data.accessToken);
//       Cookies.set("refreshToken", data.refreshToken);

     

//       // ⭐ Store user info here
//       Cookies.set(
//         "userInfo",
//         JSON.stringify({
//           userID: data.userID,
//           displayName: data.displayName,
//           role: data.role,
//         })
//       );

//       return data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err.response?.data?.message || "Login failed. Try again."
//       );
//     }
//   }
// );

export const loginUser = createAsyncThunk(
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

