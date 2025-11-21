import api from "./axiosClient";

export const TicketPriorityApi= {
    createTicketPriority:(data:any)=>api.post("/TicketPriority/CreateTicketPriority",data),
    getAllTicketPriority:()=>api.get("/TicketPriority/GetAllTicketPriority"),
    getByIdTicketPriority:(id:string|undefined)=>api.get(`/TicketPriority/GetById/${id}`),
    deleteTicketPriority:(id:string|undefined)=>api.delete("/TicketPriority/DeleteTicketPriority",{params:{id}}),
    updateTicketPriority:(id:string|undefined,data:any)=>api.put(`/TicketPriority/UpdateTicketPriority`,data,{params:{id}}),

}