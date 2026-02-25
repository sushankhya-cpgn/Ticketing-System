import api from "./axiosClient";

export const UserApi = {
    getAllUsers: () => api.get("/User/GetAllUserslist"),
    getUserById: (id: string) => api.get("/User/GetUserById", { params: { userId: id } }),
    createUser: (payload: any) => api.post("/User/CreateUser", payload),
    updateUser: (id: string, payload: any) => api.post("/User/updateUser", payload, { params: { id } }),
    forgetPassword: (email: string) => api.post("/User/forget-password", {
        email: email
    }),
    resetPassword: (email: string, token: string, newPassword: string, confirmPassword: string) => api.post("/User/reset-password",
        {
            email: email,
            token: token,
            newPassword: newPassword,
            ConfirmPassword: confirmPassword
        })
}