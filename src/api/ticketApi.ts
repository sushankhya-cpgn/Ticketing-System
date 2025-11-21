import api from "./axiosClient";

export const TicketApi = {

    createTicket:(payload:any)=>
        api.post("/Ticket/Create",payload)
    ,

    getAllTicket:()=>
        api.get("/Ticket/GetAll")
    ,
    getTicketById:(id:string|undefined)=>
        api.get(`/Ticket/GetById/${id}`)
    ,
    updateTicket:(id:string|undefined,payload:any)=>
        api.put(`/Ticket/Update/${id}`,payload)
    ,
    deleteTicket:(id:number|undefined)=>
        api.delete(`/Ticket/Delete/${id}`)
    ,

}