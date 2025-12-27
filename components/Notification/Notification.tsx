// import { useEffect, useState, useRef } from "react";
// import { fetchNotifications, fetchunreadCount, markAsRead } from "../../src/api/notificationApi";
// import notificationConnection, { startNotificationConnection } from "../../src/services/signalR/notification";
// import { Bell } from "lucide-react";


// export interface NotificationType {
//   notificationId: number;
//   userId: number;
//   actorUserId: number;
//   type: string;
//   title: string;
//   message: string;
//   payload: string;
//   channel: string;
//   priority: number;
//   isRead: boolean;
//   createdAt: string;
// }


// export default function NotificationBell() {
//   const [notifications, setNotifications] = useState<NotificationType[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef(null);

//   useEffect(() => {
//   const loadUnread = async () => {
//     try {
//       const res = await fetchunreadCount();
//       console.log(res.data);
//       setUnreadCount(res.data.data.unreadCount);
//     } catch {
//       // fallback if API not available
//       console.warn("Unread count API failed");
//     }
//   };

//   loadUnread();
// }, []);

//   // Load NOTIFICATIONS when user opens dropdown
//   const handleBellClick = async () => {
//     setOpen(prev => !prev);

// if (!open) {
//   const res = await fetchNotifications();
//   setNotifications(res.data.data.items);

// //   const unreadRes = await fetchunreadCount();
// //   setUnreadCount(unreadRes.data);
// }
//   };

//   // REALTIME SIGNALR
//   useEffect(() => {
//     startNotificationConnection();

//     notificationConnection.on("ReceiveNotification", (n) => {
//       setNotifications((prev) => [n, ...prev]);
//       setUnreadCount(prev => prev + 1);
//     });

//     return () => {
//       notificationConnection.off("ReceiveNotification");
//     };
//   }, []);

//   // MARK READ
//   const handleNotificationClick = async (n:any) => {
//     if (!n.isRead) {
//       await markAsRead(n.notificationId);

//       setNotifications((prev:any) =>
//         prev.map((item:any) =>
//           item.notificationId === n.notificationId
//             ? { ...item, isRead: true }
//             : item
//         )
//       );

//       setUnreadCount(prev => Math.max(prev - 1, 0));
//     }
//   };



//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={handleBellClick}
//         className="relative p-2 rounded hover:bg-gray-200"
//       >
//         <Bell size={20} />
        
//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
//             {unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded p-2 z-50">
//           <h3 className="font-semibold text-sm mb-2">Notifications</h3>

//           {notifications.length === 0 ? (
//             <p className="text-gray-500 text-sm">No notifications</p>
//           ) : (
//             <ul className="max-h-60 overflow-y-auto">
//               {notifications.map((n) => (
//                 <li
//                   key={n.notificationId}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`p-2 border-b last:border-0 cursor-pointer text-sm
//                     ${n.isRead ? "bg-gray-50" : "bg-white font-semibold"}
//                     hover:bg-gray-100`}
//                 >
//                   <div className="font-medium">{n.title}</div>
//                   <div className="text-gray-600">{n.message}</div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(n.createdAt).toLocaleString()}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// import { useEffect, useState, useRef } from "react";
// import {
//   fetchNotifications,
//   fetchunreadCount,
//   markAsRead
// } from "../../src/api/notificationApi";
// import notificationConnection from "../../src/services/signalR/notification";
// import { Bell } from "lucide-react";

// export interface NotificationType {
//   notificationId: number;
//   userId: number;
//   actorUserId: number;
//   type: string;
//   title: string;
//   message: string;
//   payload: string;
//   channel: string;
//   priority: number;
//   isRead: boolean;
//   createdAt: string;
// }

// export default function NotificationBell() {
//   const [notifications, setNotifications] = useState<NotificationType[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [open, setOpen] = useState(false);

//   const dropdownRef = useRef<HTMLDivElement>(null);

//   /* ---------------- LOAD UNREAD COUNT ON MOUNT ---------------- */
//   useEffect(() => {
//     const loadUnread = async () => {
//       try {
//         const res = await fetchunreadCount();
//         setUnreadCount(res.data.data.unreadCount);
//       } catch (err) {
//         console.warn("Unread count API failed", err);
//       }
//     };

//     loadUnread();
//   }, []);

//   /* ---------------- OPEN DROPDOWN + LOAD NOTIFICATIONS ---------------- */
//   const handleBellClick = async () => {
//     setOpen(prev => !prev);

//     if (!open) {
//       const res = await fetchNotifications();
//       const items = res.data.data.items;

//       setNotifications(items);
//       setUnreadCount(items.filter((n: NotificationType) => !n.isRead).length);
//     }
//   };

//   /* ---------------- SIGNALR REALTIME ---------------- */
//   useEffect(() => {
//   const handler = (n: NotificationType) => {
//     setNotifications(prev => [n, ...prev]);
//     setUnreadCount(prev => prev + 1);
//   };

//   notificationConnection.on("ReceiveNotification", handler);
//   return () => {
//     notificationConnection.off("ReceiveNotification", handler);
//   };
// }, []);

//   /* ---------------- MARK AS READ ---------------- */
//   const handleNotificationClick = async (n: NotificationType) => {
//     if (n.isRead) return;

//     await markAsRead(n.notificationId);

//     setNotifications(prev =>
//       prev.map(item =>
//         item.notificationId === n.notificationId
//           ? { ...item, isRead: true }
//           : item
//       )
//     );

//     setUnreadCount(prev => Math.max(prev - 1, 0));
//   };

//   /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={handleBellClick}
//         className="relative p-2 rounded hover:bg-gray-200"
//       >
//         <Bell size={20} />

//         {unreadCount > 0 && (
//           <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full px-1">
//             {unreadCount > 99 ? "99+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {open && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded p-2 z-50">
//           <h3 className="font-semibold text-sm mb-2">Notifications</h3>

//           {notifications.length === 0 ? (
//             <p className="text-gray-500 text-sm">No notifications</p>
//           ) : (
//             <ul className="max-h-60 overflow-y-auto">
//               {notifications.map(n => (
//                 <li
//                   key={n.notificationId}
//                   onClick={() => handleNotificationClick(n)}
//                   className={`p-2 border-b cursor-pointer text-sm
//                     ${n.isRead ? "bg-gray-50" : "bg-white font-semibold"}
//                     hover:bg-gray-100`}
//                 >
//                   <div className="font-medium">{n.title}</div>
//                   <div className="text-gray-600">{n.message}</div>
//                   <div className="text-xs text-gray-400">
//                     {new Date(n.createdAt).toLocaleString()}
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// src/components/NotificationBell.tsx
import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../../src/context/NotificationContext";

const pageSize = 20; // Must match the pageSize used in your context

const NotificationBell: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    archive,
    loading,
    fetchNotifications,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1); // Track current page for "Load more"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNotifications(nextPage);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform translate-x-1 -translate-y-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => {
                    markAllAsRead();
                    // Optionally close dropdown after action
                    // setOpen(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <p className="text-center py-8 text-gray-500">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No notifications
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.notificationId}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                      !notif.isRead ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {notif.title}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {notif.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {notif.createdAt}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex gap-3 text-xs">
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.notificationId)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => {
                          archive(notif.notificationId);
                          // Optionally close dropdown
                          // setOpen(false);
                        }}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Load More */}
          {notifications.length >= pageSize * page && (
            <div className="px-4 py-3 border-t border-gray-200 text-center">
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;