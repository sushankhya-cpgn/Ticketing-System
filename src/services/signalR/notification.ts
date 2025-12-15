// import * as signalr from "@microsoft/signalr";

// const notificationConnection = new signalr.HubConnectionBuilder()
//   .withUrl("http://192.168.5.8/notificationHub") 
//   .withAutomaticReconnect()
//   .build();

// export const startNotificationConnection = async () => {
//   if (notificationConnection.state !== signalr.HubConnectionState.Disconnected) return;

//   try {
//     await notificationConnection.start();
//     console.log("NotificationHub Connected");
//   } catch (err) {
//     console.error("NotificationHub Failed to Connect:", err);
//   }
// };

// export default notificationConnection;
// import * as signalR from "@microsoft/signalr";
//  import Cookies from "js-cookie";

// const notificationConnection = new signalR.HubConnectionBuilder()
//   .withUrl("http://192.168.5.8/notificationHub",{
//     accessTokenFactory: () => {
//       // Return the access token here. For example, retrieve it from localStorage or a cookie.
//       return Cookies.get("accessToken") || "";
//     }
//   })
//   .configureLogging(signalR.LogLevel.Trace)
//   .withAutomaticReconnect()
//   .build();

// export const startNotificationConnection = async () => {
//   if (notificationConnection.state !== signalR.HubConnectionState.Disconnected)
//     return;

//   try {
//     await notificationConnection.start();
//     console.log("NotificationHub Connected");
//   } catch (err) {
//     console.error("NotificationHub Failed:", err);
//   }
// };

// export default notificationConnection;

// First, install the required package:
// npm install @microsoft/signalr

// src/services/signalRService.ts
import * as signalR from "@microsoft/signalr";

// src/types/notification.ts
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
let connection: signalR.HubConnection | null = null;

export const startSignalRConnection = (
  accessToken: string,
  onReceiveNotification: (notification: NotificationListDto) => void,
  onUnreadCountUpdated: (count: number) => void,
  onNotificationRead: (notificationId: number) => void,
  onAllRead: () => void,
  onNotificationArchived: (notificationId: number) => void
) => {
  // if (connection) return connection;
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
  return connection;
}

  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://192.168.5.8/notificationHub", { // Adjust to your hub endpoint, e.g., https://yourapi.com/hubs/notification
      accessTokenFactory: () => accessToken,
    })
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveNotification", (notification: NotificationListDto) => {
    console.log("📩 New notification from socket:", notification);
    onReceiveNotification(notification);
  });

  connection.on("UnreadCountUpdated", (count: number) => {
    onUnreadCountUpdated(count);
  });

  connection.on("NotificationRead", (data: { NotificationId: number }) => {
    onNotificationRead(data.NotificationId);
  });

  connection.on("AllNotificationsRead", () => {
    onAllRead();
  });

  connection.on("NotificationArchived", (data: { NotificationId: number }) => {
    onNotificationArchived(data.NotificationId);
  });

  connection.start()
    .then(() => console.log("SignalR Connected"))
    .catch(err => console.error("SignalR Connection Error: ", err));

  return connection;
};

export const stopSignalRConnection = () => {
  if (connection) {
    connection.stop();
    connection = null;
  }
};
