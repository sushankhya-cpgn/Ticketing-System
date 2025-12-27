import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import "./App.css";

import React, { Suspense, useEffect } from "react";
import LoginPage from "../pages/LoginPage";
import useAuth from "../hooks/useAuth";
import CircularLoader from "../components/Loader/CircularLoader";
import CreateUserPage from "../pages/User/CreateUser";
import EditUserPage from "../pages/User/EditUser";
import RolePage from "../pages/Role/RolePage";
import CreateRole from "../pages/CreateRole";
import EditRolePage from "../pages/Role/EditRole";
import TaskPage from "../pages/Task/TaskPage";
import CreateTaskPage from "../pages/Task/AddTask";
import EditTaskPage from "../pages/Task/EditTask";
import TagsPage from "../pages/Ticket/TagsPage";
import AddTag from "../pages/Ticket/AddTag";
import EditTagPage from "../pages/Ticket/EditTag";
import StatusPage from "../pages/Ticket/StatusPage";
import PriorityPage from "../pages/Ticket/PriorityPage";
import AddPriority from "../pages/Ticket/AddPriority";
import EditPriorityPage from "../pages/Ticket/EditPriority";
import AddStatus from "../pages/Ticket/AddStatus";
import EditStatusPage from "../pages/Ticket/EditStatus";
import CreateTicketPage from "../pages/Ticket/CreateTicketPage";
import EditTicketPage from "../pages/Ticket/EditTicket";
import TicketPage from "../pages/Ticket/TicketPage";
import Layout from "../components/layout/Layout";
import { NotificationProvider } from "./context/NotificationContext";
// import { startSignalRConnection, stopSignalRConnection } from "./services/signalRService"; // or your connection file
import { useSelector } from "react-redux"; // if user/token in Redux
// import notificationConnection, { startNotificationConnection } from "./services/signalR/notification";
import Cookies from "js-cookie";




const DashboardPage = React.lazy(() => import("../pages/Dashboard"));
const ReportPage = React.lazy(() => import("../pages/Report"));
const CustomersPage = React.lazy(() => import("../pages/User/Customers"));
const SettingsPage = React.lazy(() => import("../pages/Settings"));
const KanbanBoard = React.lazy(() => import("../pages/Board/BoardPage"));



// function ProtectedRoute() {
//   const { isAuthenticated, loading } = useAuth();
//   const accessToken = Cookies.get("accessToken") ?? "";
//   const userID = useSelector((state: any) => state.auth.userID); // Adjust based on your Redux setup

//   if (loading) {
//     return (
//       <div className="h-screen w-screen flex justify-center items-center text-7xl">
//         <CircularLoader />
//       </div>
//     );
//   }

//   // return isAuthenticated ? 
//   // <Layout>
//   // <Outlet /> 
//   // </Layout>: <Navigate to="/login" replace />;
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }
//   return (
//     <NotificationProvider userId={userID} accessToken={accessToken}>
//       <Layout>
//         <Outlet />
//       </Layout>
//     </NotificationProvider>
//   );
// }


function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  const accessToken = Cookies.get("accessToken") ?? "";
  const userID = useSelector((state: any) => state.auth.userID);

  if (loading) {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <CircularLoader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrap Layout + children (Outlet) together
  return (
   <NotificationProvider userId={userID} accessToken={accessToken}>
      <Layout>
       <Outlet/>
      </Layout>
    </NotificationProvider>
  );
}
function App() {
//   useEffect(() => {
//   startNotificationConnection();
// }, []);

// useEffect(() => {
//   const handler = (count: number) => {
//     console.log("📩 UnreadCountUpdated received:", count);
//   };

//   notificationConnection.off("UnreadCountUpdated");
//   notificationConnection.on("UnreadCountUpdated", handler);

//   return () => {
//     notificationConnection.off("UnreadCountUpdated", handler);
//   };
// }, []);
  return (
    // <ThemeProvider>
    <Router>
      <Suspense fallback={<CircularLoader />}>
        <Routes>
        
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/" element={<InsuranceForm />} /> */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/adduser" element={<CreateUserPage/>}/>
            <Route path = "/customers/edituser/:id" element={<EditUserPage/>}/>
            <Route path = '/role' element={<RolePage/>}/>
            <Route path="/role/addrole" element={<CreateRole/>}/>
            <Route path = "/role/editrole/:roleId" element={<EditRolePage/>}/>
            <Route path = "/task" element={<TaskPage/>}/>
            <Route path = "/task/addtask" element={<CreateTaskPage/>}/>
            <Route path="/task/edit/:taskid" element = {<EditTaskPage/>}/>
            <Route path="/ticket/tag" element={<TagsPage/>}/>
            <Route path="/ticket/tag/addtag" element={<AddTag />} />
            <Route path="/ticket/tag/edittag/:tagid" element={<EditTagPage />} />
            <Route path="/ticket/priority" element={<PriorityPage/>}/>
            <Route path="/ticket/priority/addpriority" element={<AddPriority/>}/>
            <Route path="/ticket/priority/editpriority/:pid" element={<EditPriorityPage/>}/>
            <Route path="/ticket/status" element={<StatusPage/>}/>
            <Route path="/ticket/status/addstatus" element={<AddStatus/>}/>
            <Route path="/ticket/status/editstatus/:sid" element={<EditStatusPage/>}/>
            <Route path="/ticket" element={<TicketPage/>}/>
            <Route path="/ticket/createticket" element={<CreateTicketPage/>}/>
            <Route path="/ticket/editticket/:ticketid" element={<EditTicketPage/>}/>
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/board" element={<KanbanBoard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
    // </ThemeProvider>
  );
}



export default App;


