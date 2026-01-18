import api from "./axiosClient";


export const TicketDashboardApi = {
    getTicketAssignmentStats: () =>
        api.get("/TicketDasboard/assignments"),

     getSummary: () =>
        api.get("/TicketDasboard/summary"),

     getDailyTrends: () =>
        api.get("/TicketDasboard/daily-trend"),
     
     getWorkLoadPriority: () =>
        api.get("/TicketDasboard/workload-by-priority"),
};