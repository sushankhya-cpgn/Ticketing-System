import api from "./axiosClient";

export const UserApi = {
    getAllUsers: () => api.get("/User/GetAllUserslist"),
    getUserById: (id: string) => api.get("/User/GetUserById", { params: { userId:id } }),
    createUser: (payload: any) => api.post("/User/CreateUser", payload),
    updateUser: (id: string, payload: any) => api.post("/User/updateUser", payload, { params: { id } }),
}