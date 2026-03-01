import {  z } from "zod";
import loginSchema from "../components/schema/loginSchema";
import forgotPasswordSchema from "../components/schema/forgotPasswordSchema"
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
import LoginCard from "../components/Card/LoginCard"
import ThemeToggle from "../src/ThemeToggle";
import { toast } from "react-toastify";
import useAuth from "../hooks/useAuth";
import { CircularProgress } from "@mui/material";
import { UserApi } from "../src/api/userApi";

type LoginFormProps = z.infer<typeof loginSchema>;
type ForgotPasswordProps = z.infer<typeof forgotPasswordSchema>;

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { error } = useSelector(
    (state: RootState) => state.auth
  );

  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [forgotpassword, setForgotPassword] = useState<boolean>(false)


  // For Login Form
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors:loginErrors },
  } = useForm<LoginFormProps>({
    resolver: zodResolver(loginSchema),
    mode: "onChange"
  })

  // For Forgot Password Form

  const {
    register: forgotpasswordRegister,
    handleSubmit: handleforgetPasswordSubmit,
    formState: { errors:forgotPasswordErrors,isSubmitting: isForgotSubmitting },
  } = useForm<ForgotPasswordProps>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange"
  })

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

  const handleForgotPassword = () => {
    setForgotPassword(true);
  }


  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  const sendLink = async (data: { email: string }) => {
    try {
      console.log(data.email)
      await UserApi.forgetPassword(data.email);
      toast.success("Verification link sent to your email");

    }
    catch (error:any) {
      toast.error(error.response.data.message)
      console.error(error.response.data.message);
    }
  }

  return (
    <>
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <LoginCard>
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
        {!forgotpassword ?
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

              <form className="space-y-4" onSubmit={handleLoginSubmit(submitForm)}>
                {/* Username */}
                <TextFieldComponent
                  label="Username"
                  name="username"
                  placeholder="vwrapcode.info@gmail.com"
                  register={loginRegister}
                  errors={loginErrors}
                />

                {/* Password */}
                <div className="mt-5">
                  <TextFieldComponent
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    register={loginRegister}
                    errors={loginErrors}
                  />
                </div>

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between">
                  <CheckboxField
                    label="Remember Me"
                    edit={rememberMe}
                    setEdit={setRememberMe}
                  />
                  <p
                    className="text-xs hover:underline cursor-pointer "
                    style={{ color: "var(--foreground)" }}
                    onClick={handleForgotPassword}
                  >
                    Forgot password?
                  </p>
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
          : (
            <div className="w-full max-w-md p-6 flex flex-col pt-20">
              <h2
                className="text-2xl font-bold text-center mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Forgot Password
              </h2>


              <p
                className="text-sm text-center mb-6 opacity-80"
                style={{ color: "var(--foreground)" }}
              >
                Enter your email address and we’ll send you an email with a reset link to reset your password. <strong>Please click on the link to change the password.</strong>
              </p>
              <form onSubmit={handleforgetPasswordSubmit(sendLink)}>
                <TextFieldComponent
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  register={forgotpasswordRegister}
                  errors={forgotPasswordErrors}
                />
                <div className=" flex gap-3 mt-3">
                  <ButtonComponent type="submit" width="50%" loading={isForgotSubmitting}>
                    {!isForgotSubmitting?'Send Link':'Sending Link'}
                  </ButtonComponent>

                  <button
                    type="button"
                    className="text-sm hover:underline mt-2 w-1/2"
                    style={{ color: "var(--foreground)" }}
                    onClick={() => setForgotPassword(false)}

                  >

                    Back to login
                  </button>

                </div>

              </form>
            </div>

          )
        }
      </LoginCard>
    </>


  );
}
