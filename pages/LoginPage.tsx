import { z } from "zod";
import loginSchema from "../components/schema/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/authslice";
import { useNavigate } from "react-router-dom";
import TextFieldComponent from "../components/Fields/TextFieldComponent";
import CheckboxField from "../components/Fields/CheckBoxField";
import { type AppDispatch, type RootState } from "../app/store";
import ButtonComponent from "../components/Buttons/button";
import ThemeToggle from "../src/ThemeToggle";
import { toast } from "react-toastify";
// import Cookies from "js-cookie";
import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";

type LoginFormProps = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {  error } = useSelector(
    (state: RootState) => state.auth
  );

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // ---------------------------------------
  // SUBMIT FORM (new login flow)
  // ---------------------------------------
  const submitForm = async (data: LoginFormProps) => {
    try {
      const payload = { ...data };

      const result = await dispatch(loginUser(payload)).unwrap();

      toast.success(`Welcome, ${result.displayName}!`);
      navigate("/", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Invalid credentials");
    }
  };

  // ---------------------------------------
  // AUTO-LOGIN FROM COOKIES
  // ---------------------------------------
  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   if (token && accessToken) {
  //     navigate("/", { replace: true });
  //   }
  // }, [accessToken, navigate]);

  const { isAuthenticated, loading } = useAuth();

useEffect(() => {
  if (isAuthenticated && !loading) {
    navigate("/", { replace: true });
  }
}, [isAuthenticated, loading, navigate]);

if(loading || isAuthenticated){
  return(
     <div className="flex items-center justify-center h-[70vh]">
            <CircularProgress />
          </div>
  );
}

  return (
       <>
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--background)" }}
      >
        <div
          className="flex w-full max-w-4xl shadow-lg rounded-lg overflow-hidden h-[450px] gap-10"
          style={{ background: "var(--background-secondary)" }}
        >
          {/* Left Side - Logo */}
          <div
            className="w-1/2 flex justify-center pl-2 rounded-lg items-center"
            style={{ background: "var(--background-secondary)" }}
          >
            <img
              src="/images/logo2.png"
              alt="Logo"
              className="max-w-full max-h-[100px]"
              style={{ background: "var(--background-secondary)" }}
            />
          </div>

          {/* Right Side - Login Form */}
          <div
            className="w-1/2 flex items-center justify-center"
            style={{ background: "var(--background-secondary)" }}
          >
            <div className="w-full max-w-md p-6">
              <h2
                className="text-2xl font-bold text-center mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Login
              </h2>

              {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
              )}

              <form className="space-y-4" onSubmit={handleSubmit(submitForm)}>
                {/* Username */}
                <TextFieldComponent
                  label="Username"
                  name="username"
                  placeholder="vwrapcode.info@gmail.com"
                  register={register}
                  errors={errors}
                />

                {/* Password */}
                <div className="mt-5">
                  <TextFieldComponent
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    register={register}
                    errors={errors}
                  />
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <CheckboxField
                    label="Remember Me"
                    edit={rememberMe}
                    setEdit={setRememberMe}
                  />
                  <a
                    href="#"
                    className="text-xs hover:underline"
                    style={{ color: "var(--foreground)" }}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-4">
                  <ButtonComponent type="submit" width="100%" disabled={loading}>
                    {loading ? "Loading..." : "LOGIN"}
                  </ButtonComponent>
                </div>
              </form>

              <p
                className="text-center mt-4 text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Don’t have an account?{" "}
                <a
                  href="#"
                  className="hover:underline"
                  style={{ color: "var(--foreground)" }}
                >
                  Create an Account
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
