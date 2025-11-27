import api from "./axiosClient";

export const TagApi = {
    createTag: (data: any) =>
        api.post("/Tags/CreateTags", data),

    getTagById: (id: string) =>
        api.get(`/Tags/GetById/${id}`),

    updateTag: (id: string, data: any) =>
        api.put("/Tags/UpdateTags", data, {
            params: { id }
        }),

    getAllTags: () =>
        api.get("/Tags/GetAll"),

    deleteTag: (id: number) =>
        api.delete(`/Tags/${id}`, {
            // params: { id }
        })
};
