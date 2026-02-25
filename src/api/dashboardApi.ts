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

   getSolvedList: () =>
      api.get("/TicketDashboard/today-solvedlist"),

   getPendingList: () => 
      api.get("/TicketDasboard/pendinglist"),

   getTodayActiveList: () =>
      api.get("/TicketDasboard/today-activelist"),

   getTodayDeadlineList: () => 
      api.get("/TicketDasboard/today-deadlinelist"),
   getTodayAssignmentList: ()=>
      api.get("/TicketDasboard/today-assignmentslist"),

   getProgressList:()=>
      api.get("/TicketDashboard/in-progresslist")
};