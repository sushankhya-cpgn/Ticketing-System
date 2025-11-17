import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Layout from "../../components/layout/Layout";
import TextFieldComponent from "../../components/Fields/TextFieldComponent";
import SelectSearch from "../../components/Fields/SelectSearch";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import Cookies from "js-cookie";

interface Role {
    roleID: number;
    roleName: string;
}

interface UserStatus {
    userStatusID: number;
    userStatusName: string;
}

interface ApiResponse<T> {
    isSucceed: boolean;
    statusCode: number;
    message: string;
    data: T[];
}

export default function AddUserForm() {
    const methods = useForm({
        defaultValues: {
            displayName: "",
            email: "",
            mobile: "",
            userName: "",
            userPassword: "",
            confirmPassword: "",
            roleID: "",
            clientID: "",
            userStatusID: "",
            branchCode: "",
            msUserID: "",
            isWebUser: true,
        },
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    // ─────── State for API data ───────
    const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
    const [userStatusOptions, setUserStatusOptions] = useState<{ label: string; value: number }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const navigate = useNavigate()
//   const { access_token } = useSelector(
//     (state: RootState) => state.auth
//   );

    const access_token = Cookies.get("accessToken");
  

    // ─────── Sample branch options (static) ───────
    const branchOptions = [
        { label: "Branch 001 - Kathmandu", value: "001" },
        { label: "Branch 002 - Pokhara", value: "002" },
        { label: "Branch 003 - Lalitpur", value: "003" },
        { label: "Branch 004 - Bhaktapur", value: "004" },
    ];

    // ─────── Fetch roles & statuses ───────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setApiError(null);

                const [roleRes, statusRes] = await Promise.all([
                    api.get<ApiResponse<Role>>("/Utility/roles"),
                    api.get<ApiResponse<UserStatus>>("/Utility/userstatuses"),
                ]);

                // Roles
                if (roleRes.data.isSucceed) {
                    const roles = roleRes.data.data.map((r) => ({
                        label: r.roleName,
                        value: r.roleID,
                    }));
                    setRoleOptions(roles);
                } else {
                    throw new Error(roleRes.data.message);
                }

                // User Statuses
                if (statusRes.data.isSucceed) {
                    const statuses = statusRes.data.data.map((s) => ({
                        label: s.userStatusName,
                        value: s.userStatusID,
                    }));
                    setUserStatusOptions(statuses);
                } else {
                    throw new Error(statusRes.data.message);
                }
            } catch (err: any) {
                console.error("API Error:", err);
                setApiError(err.response?.data?.message || err.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const onSubmit = async (data: any) => {
        console.log("Form submitted:", data);
        try {
           const res =  await api.post("/User/CreateUser", data, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                }
    
            })
                console.log(res);
                toast.success("User Created Successfully");
                navigate("/customers")
    
        } catch (error: unknown) {
            console.error("Submit Error:", error);
            if (axios.isAxiosError(error)) {
                const message = (error.response?.data as any)?.message ?? error.message;
                console.log("This is the message")
                toast.error(message);
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error(String(error));
            }
        }
    
    };

    const password = watch("userPassword");

    // ─────── Render loading / error state ───────
    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-lg font-medium text-gray-600">Loading options...</div>
                </div>
            </Layout>
        );
    }

    if (apiError) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-red-600 bg-red-50 p-4 rounded-lg">
                        <strong>Error:</strong> {apiError}
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="rounded-lg shadow-sm">
                            {/* ─────── User Details ─────── */}
                            <section className="border-b border-gray-200">
                                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                                    User Details
                                </header>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 gap-4">
                                        <TextFieldComponent
                                            label="Display Name"
                                            name="displayName"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Display Name"
                                            required
                                            height="50px"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <TextFieldComponent
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Email Address"
                                            required
                                            validation={{
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address",
                                                },
                                            }}
                                            height="50px"
                                        />
                                        <TextFieldComponent
                                            label="Mobile Number"
                                            name="mobile"
                                            type="tel"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Mobile Number"
                                            required
                                            validation={{
                                                pattern: {
                                                    value: /^[0-9]{10}$/,
                                                    message: "Invalid mobile number (10 digits required)",
                                                },
                                            }}
                                            height="50px"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ─────── Login Credentials ─────── */}
                            <section className="border-b border-gray-200">
                                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                                    Login Credentials
                                </header>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <TextFieldComponent
                                            label="Username"
                                            name="userName"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Username"
                                            required
                                            height="50px"
                                        />
                                        <TextFieldComponent
                                            label="MS User ID"
                                            name="msUserID"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter MS User ID"
                                            height="50px"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <TextFieldComponent
                                            label="Password"
                                            name="userPassword"
                                            type="password"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Password"
                                            required
                                            validation={{
                                                minLength: {
                                                    value: 6,
                                                    message: "Password must be at least 6 characters",
                                                },
                                            }}
                                            height="50px"
                                        />
                                        <TextFieldComponent
                                            label="Confirm Password"
                                            name="confirmPassword"
                                            type="password"
                                            register={register}
                                            errors={errors}
                                            placeholder="Confirm Password"
                                            required
                                            validation={{
                                                validate: (value:any) => value === password || "Passwords do not match",
                                            }}
                                            height="50px"
                                        />
                                    </div>

                                    <div className="flex items-center pt-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                {...register("isWebUser")}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Is Web User</span>
                                        </label>
                                    </div>
                                </div>
                            </section>

                            {/* ─────── Corporate Details ─────── */}
                            <section className="border-b border-gray-200">
                                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                                    Corporate Details
                                </header>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <SelectSearch
                                            label="Role"
                                            name="roleID"
                                            options={roleOptions}
                                            required
                                            errors={errors}
                                            placeholder="Select Role"
                                            height="50px"
                                        />
                                        <TextFieldComponent
                                            label="Client ID"
                                            name="clientID"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Client ID"
                                            height="50px"
                                        />
                                        <SelectSearch
                                            label="User Status"
                                            name="userStatusID"
                                            options={userStatusOptions}
                                            required
                                            errors={errors}
                                            placeholder="Select User Status"
                                            height="50px"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <SelectSearch
                                            label="Branch Code"
                                            name="branchCode"
                                            options={branchOptions}
                                            errors={errors}
                                            placeholder="Select Branch"
                                            height="50px"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* ─────── Submit ─────── */}
                            <div className="p-6">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                                >
                                    Add User
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Layout>
    );
}