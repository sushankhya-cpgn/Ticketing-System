import LoginCard from "../components/Card/LoginCard";
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import TextFieldComponent from "../components/Fields/TextFieldComponent";
import ButtonComponent from "../components/Buttons/button";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { UserApi } from "../src/api/userApi";

type ForgotPasswordForm = {
    password: string;
    confirmpassword: string;
};

export default function ChangePasswordPage() {
    const { error } = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordForm>();

    const changePassword = async(data: ForgotPasswordForm) => {
        try{
        console.log(data);
        const res = await UserApi.resetPassword(email || "",token || "",data.password,data.confirmpassword)
        console.log(res)
        navigate("/login");
        }
        catch(error:any){
            toast.error("Something went wrong")
            console.error(error);
        }
    };

    return (
        <LoginCard>
            {/* Left Side */}
            <div
                className="w-1/2 flex justify-center pl-2 rounded-lg items-center"
                style={{ background: "var(--background-secondary)" }}
            >
                <img
                    src="/images/logo2.png"
                    alt="Logo"
                    className="max-w-full max-h-[100px]"
                />
            </div>

            {/* Right Side */}
            <form
                onSubmit={handleSubmit(changePassword)}
                className="w-full max-w-md p-6 flex flex-col pt-20"
            >
                <h2
                    className="text-2xl font-bold text-center mb-2"
                    style={{ color: "var(--foreground)" }}
                >
                    Forgot Password
                </h2>
                <div className=" flex flex-col justify-center h-1/2">
                <div>
                <TextFieldComponent
                    type="password"
                    name="password"
                    label="Password"
                    placeholder="••••••••"
                    register={register}
                    errors={errors}
                />
                </div>

                <div  className="mt-5">
                <TextFieldComponent
                    type="password"
                    name="confirmpassword"
                    label="ConfirmPassword"
                    placeholder="••••••••"
                    register={register}
                    errors={errors}
                />
                </div>

            </div>
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <div className="flex gap-3">
                    <ButtonComponent type="submit" width="50%">
                        Save Changes
                    </ButtonComponent>

                    <button
                        type="button"
                        className="text-sm hover:underline mt-2 w-1/2"
                        style={{ color: "var(--foreground)" }}
                        onClick={() => navigate("/login")}
                    >
                        Back to login
                    </button>
                </div>
            </form>
        </LoginCard>
    );
}
