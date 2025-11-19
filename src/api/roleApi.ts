import api from "./axiosClient";

export const RoleApi = {
    create: (payload:any) => api.post("/Role/CreateRole", payload),
    getAll: () => api.get("/Role/GetAllRoles"),
    getById: (id: string) => api.get("/Role/GetRoleById", { params: { id } }),
    update: (id: string, payload:any) => api.post("/Role/UpdateRole", payload, { params: { id } }),
}