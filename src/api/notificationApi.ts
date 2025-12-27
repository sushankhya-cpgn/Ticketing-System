import api from "./axiosClient";

const BASE = "/Notifications";

export const fetchNotifications = () => 
  api.get(BASE);

export const markAsRead = (id:any) => 
  api.post(`${BASE}/${id}/read`);

export const fetchunreadCount = () => 
  api.get(`${BASE}/unread-count`);
