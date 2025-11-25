// import * as signalr from "@microsoft/signalr";

// const connection: signalr.HubConnection = new signalr.HubConnectionBuilder().withUrl("http://192.168.5.8/kanbanHub").withAutomaticReconnect().build();

// export default connection

import * as signalr from "@microsoft/signalr";

const connection = new signalr.HubConnectionBuilder()
  .withUrl("http://192.168.5.8/kanbanHub")
  .withAutomaticReconnect()
  .build();

export const startConnection = async () => {
  if (connection.state !== signalr.HubConnectionState.Disconnected) return;

  try {
    await connection.start();
    console.log("SignalR Connected");
  } catch (err) {
    console.error("SignalR Failed to Connect:", err);
  }
};

export default connection;
