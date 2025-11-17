// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserProfile, refreshtoken } from "../features/user/authActions";
// import type { AppDispatch, RootState } from "../app/store";

// export default function useAuth(){
//     const {refresh_token,access_token,userInfo,loading}  = useSelector((state:RootState)=>state.auth);
//     const [checkingToken, setCheckingToken] = useState<boolean>(true);
//     const dispatch = useDispatch<AppDispatch>();
    
//     useEffect(() => {
//         const checkAuth = () => {
//           // Check if refresh token is present and access token is absent.
//           if (!access_token && refresh_token) {
//             dispatch(refreshtoken());
//           }
          
//           // Get User Profile
//           if(access_token && userInfo && Object.keys(userInfo).length === 0){
//             dispatch(fetchUserProfile());
//           }
         
//         };
//         checkAuth();
//         setCheckingToken(false);
//       }, [access_token, dispatch, refresh_token,userInfo]);


//       return {checkingToken:checkingToken||loading,isAuthenticated:Boolean(access_token)};

// }

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Cookies from "js-cookie";
// import { fetchUserProfile, refreshtoken } from "../features/user/authActions";
// import type { AppDispatch, RootState } from "../app/store";

// export default function useAuth() {
//   const dispatch = useDispatch<AppDispatch>();
//   const userInfo = useSelector((state: RootState) => state.auth.userInfo);
//   const loading = useSelector((state: RootState) => state.auth.loading);

//   // Always read tokens from cookies — source of truth
//   const access_token = Cookies.get("access_token") || null;
//   const refresh_token = Cookies.get("refresh_token") || null;

//   const [isInitializing, setIsInitializing] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const initializeAuth = async () => {
//       try {
//         // Step 1: If no access token but have refresh token → refresh
//         if (!access_token && refresh_token) {
//           await dispatch(refreshtoken()).unwrap();
//           // After refresh, re-read access_token
//           if (!isMounted) return;
//           const newAccessToken = Cookies.get("access_token");
//           if (!newAccessToken) {
//             // Refresh failed → logout
//             dispatch({ type: "auth/logout/fulfilled" });
//             return;
//           }
//         }

//         // Step 2: If we have access token but no userInfo → fetch profile
//         const currentAccessToken = Cookies.get("access_token");
//         if (currentAccessToken && !userInfo) {
//           await dispatch(fetchUserProfile()).unwrap();
//         }
//       } catch (error) {
//         // Any error → treat as unauthenticated
//         console.error("Auth initialization failed:", error);
//       } finally {
//         if (isMounted) {
//           setIsInitializing(false);
//         }
//       }
//     };

//     initializeAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, [access_token, refresh_token, userInfo, dispatch]);

//   return {
//     isAuthenticated: !!access_token,
//     userInfo,
//     isLoading: isInitializing || loading,
//     access_token, 
//     refresh_token,
//   };
// }


//ai
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import Cookies from "js-cookie";
// import { fetchUserProfile, refreshtoken } from "../features/user/authActions";
// import type { AppDispatch, RootState } from "../app/store";

// export default function useAuth() {
//   const dispatch = useDispatch<AppDispatch>();
//   const userInfo = useSelector((state: RootState) => state.auth.userInfo);
//   const loading = useSelector((state: RootState) => state.auth.loading);

//   const access_token = Cookies.get("access_token") || null;
//   const refresh_token = Cookies.get("refresh_token") || null;

//   const [checkingToken, setCheckingToken] = useState(true);

//   useEffect(() => {
//     let isMounted = true;

//     const initializeAuth = async () => {
//       try {
//         // Refresh if access token missing but refresh token exists
//         if (!access_token && refresh_token) {
//           await dispatch(refreshtoken()).unwrap();
//         }

//         // Re-read access token from cookies
//         const currentAccessToken = Cookies.get("access_token");

//         if (!currentAccessToken) {
//           // No token → logout
//           dispatch({ type: "auth/logout/fulfilled" });
//         } else if (!userInfo) {
//           // Token exists but no user info → fetch profile
//           await dispatch(fetchUserProfile()).unwrap();
//         }
//       } catch (error) {
//         console.error("Auth initialization failed:", error);
//         dispatch({ type: "auth/logout/fulfilled" });
//       } finally {
//         if (isMounted) setCheckingToken(false);
//       }
//     };

//     initializeAuth();

//     return () => {
//       isMounted = false;
//     };
//   }, [access_token, refresh_token, userInfo, dispatch]);

//   return {
//     isAuthenticated: !!Cookies.get("access_token"),
//     userInfo,
//     checkingToken,
//     access_token,
//     refresh_token,
//     loading
//   };
// }
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../app/store";

export default function useAuth() {
  const { accessToken, loading } = useSelector((state: RootState) => state.auth);

  const cookieToken = Cookies.get("accessToken");

  // authenticated if token exists in redux OR cookies
  const isAuthenticated = !!accessToken || !!cookieToken;

  return {
    isAuthenticated,
    loading,
  };
}
