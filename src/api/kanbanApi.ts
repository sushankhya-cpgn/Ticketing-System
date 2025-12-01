import api from "./axiosClient";

export const KanBanApi = {
    getAll : ()=> api.get("/Kanban/Board"),
    getById : (id:string)=> api.get(`/Kanban/GetDetailsById/${id}`)
};