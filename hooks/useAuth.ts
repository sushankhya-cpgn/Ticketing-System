
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import type { RootState } from "../app/store";

export default function useAuth() {
  const {  loading } = useSelector((state: RootState) => state.auth);

  const cookieToken = Cookies.get("accessToken");

  // authenticated if token exists in redux OR cookies
  const isAuthenticated =  !!cookieToken;

  return {
    isAuthenticated,
    loading,
  };
}
