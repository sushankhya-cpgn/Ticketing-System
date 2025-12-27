// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { startSignalRConnection, stopSignalRConnection } from "../services/signalR/notification";
import api from "../api/axiosClient";
// Your axios/instance for API calls
interface NotificationListDto {
  notificationId: number;
  userId: number;
  actorUserId?: number;
  type: string;
  title: string;
  message: string;
  payload: string; // JSON string, parse if needed
  channel: string;
  priority: number;
  isRead: boolean;
  createdAt: string;
 
}

interface NotificationContextType {
  notifications: NotificationListDto[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (page?: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  archive: (notificationId: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode; userId: number; accessToken: string }> = ({
  children,
  userId,
  accessToken,
}) => {
  const [notifications, setNotifications] = useState<NotificationListDto[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const pageSize = 20;

  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/Notifications`);
      console.log("notifications response",response.data.data.items);
      const unreadresponse = await api.get('/Notifications/unread-count');
      setUnreadCount(unreadresponse.data.data.unreadCount);
      console.log("unread count response",unreadresponse.data.data.unreadCount);
    //   if (pageNum === 1) {
        setNotifications(response.data.data.items);
    //   } else {
        // setNotifications(prev => [...prev, ...response.data.data.Items]);
    //   }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    await api.post(`/notifications/mark-read`, { userId, notificationId });
    setNotifications(prev => prev.map(n => n.notificationId === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    await api.post(`/notifications/read-all`, { userId });
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const archive = async (notificationId: number) => {
    await api.post(`/notifications/archive`, { userId, notificationId });
    setNotifications(prev => prev.filter(n => n.notificationId !== notificationId));
  };

 useEffect(() => {
  fetchNotifications();

  startSignalRConnection(
    accessToken,
    (newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    //   setUnreadCount(c => c + 1); // 🔑 IMPORTANT
    },
    (count) => setUnreadCount(count),
    (notificationId) => {
      setNotifications(prev =>
        prev.map(n =>
          n.notificationId === notificationId
            ? { ...n, isRead: true }
            : n
        )
      );
    },
    () => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    },
    (notificationId) => {
      setNotifications(prev =>
        prev.filter(n => n.notificationId !== notificationId)
      );
    }
  );

  return () => {
    stopSignalRConnection(); // only on logout / app close
  };
}, []); // ✅ EMPTY dependency array

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      archive,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};