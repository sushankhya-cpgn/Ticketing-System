import api from "./axiosClient";

export const TicketStatusApi = {
  createStatus: (data: any) =>
    api.post("/TicketStatus/Create", data),

  getAllStatus: () =>
    api.get("/TicketStatus/GetAll"),

  getStatusById: (id: string|undefined) =>
    api.get(`/TicketStatus/GetById`, {
      params: { id },
}),

  updateStatus: (id: string|undefined, data: any) =>
    api.put("/TicketStatus/Update", data, {
      params: { id },
}),

  deleteStatus: (id: number|undefined) =>
  {
    const res = api.delete(`/TicketStatus/${id}`, {
      // params: { id },
    })
    return res;
  }
};
