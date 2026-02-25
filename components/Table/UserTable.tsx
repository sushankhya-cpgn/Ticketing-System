// export default UserTable;
// src/pages/UserTable.tsx

// import React, { useState } from "react";
// import { CircularProgress, Pagination, Button } from "@mui/material";
// import VirtualizedTable, { type Column } from "./VirtualizedTable";
// import { useNavigate } from "react-router-dom";
// import { useDataTable } from "../../hooks/useDataTable";
// import { Edit, FilePlus } from "lucide-react";
// import TableFilterBar from "./TableFilterBar";
// import Modal from "../Modal/Modal";
// import AssignUserTask from "../Tasks/AssignUserTask"
// import api from "../../src/api/axiosClient";
// import ProtectedAction from "../Auth/ProtectedAction";
// import Cookies from "js-cookie";

// interface UserRecord {
//   userID: number;
//   displayName: string;
//   userName: string;
//   email: string;
//   roleName: string;
//   userStatusName: string;
// }

// interface Task {
//   id: string;
//   name: string;
// }

// const UserTablePage: React.FC = () => {
//   const navigate = useNavigate();
//   const token = Cookies.get("accessToken") ?? "";

//   const {
//     loading,
//     rows,
//     totalCount,
//     page,
//     setPage,
//     pageSize,
//     setPageSize,
//     searchTerm,
//     setSearchTerm,
//     setOrderBy,
//     columnFilters,
//     setColumnFilters,
//   } = useDataTable<UserRecord>({
//     apiUrl: "/User/GetAllUserslist",
//     token,
//     defaultPageSize: 10,
//   });

//   const [assignTask, setAssignTask] = useState<UserRecord | null>(null);
//   const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
//   const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
//    const access_token = Cookies.get("accessToken");

//   // useEffect(() => {
//   //   // example: if you want to fetch role options for filters, do it here
//   // }, []);

//   const fetchTasksForUser = async (user: UserRecord) => {
//     setAssignTask(user);
//     setAvailableTasks([]);
//     setAssignedTasks([]);

//     try {
//       const [assignedRes, availableRes] = await Promise.all([
//         api.get(`/UserTask/assigned/${user.userID}`, { headers: { Authorization: `Bearer ${token}` } }),
//         api.get(`/UserTask/available/${user.userID}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       if (assignedRes.data?.isSucceed) {
//         setAssignedTasks(assignedRes.data.data.map((t: any) => ({ id: String(t.taskID), name: t.taskName })));
//       }

//       if (availableRes.data?.isSucceed) {
//         setAvailableTasks(availableRes.data.data.map((t: any) => ({ id: String(t.taskID), name: t.taskName })));
//       }
//     } catch (err) {
//       console.error("fetchTasksForUser error:", err);
//     }
//   };

//   const columns: Column<UserRecord>[] = [
//     { label: "ID", field: "userID", flex: 1, sortable: true },
//     { label: "Name", field: "displayName", flex: 2, sortable: true },
//     { label: "Username", field: "userName", flex: 2 },
//     { label: "Email", field: "email", flex: 3 },
//     { label: "Role", field: "roleName", flex: 2, sortable: true },
//     { label: "Status", field: "userStatusName", flex: 1, sortable: true },
//     {
//       label: "Actions",
//       field: "userID",
//       flex: 2,
//       render: (row) => (
//         <div className="flex gap-2">
//           <ProtectedAction permission="Edit User" title="Edit User" onClick={() => navigate(`/customers/edituser/${row.userID}`)}>
//             <Button size="small" variant="text"><Edit size={18} /></Button>
//           </ProtectedAction>

//           <ProtectedAction permission="Assign UserTask" title="Assign Tasks" onClick={() => fetchTasksForUser(row)}>
//             <Button size="small" variant="text"><FilePlus size={18} /></Button>
//           </ProtectedAction>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="w-full">
//       <Modal
//         isOpen={Boolean(assignTask)}
//         onClose={() => setAssignTask(null)}
//         title={`Assign Tasks to: ${assignTask?.userName}`}
//         size="full"
//         closeOnOverlayClick={false}
//       >
//         <div className="w-full flex justify-center">
//               <AssignUserTask
//               userId={assignTask?.userID ?? 0}
//               accessToken={access_token ?? ""}
//               availableTasks={availableTasks}
//               assignedTasks={assignedTasks}
//               setAvailableTasks={setAvailableTasks}
//               setAssignedTasks={setAssignedTasks}
//             />
//         </div>
//       </Modal>

//       <TableFilterBar
//         searchText={searchTerm}
//         setSearchText={setSearchTerm}
//         dropdownFields={["roleName", "userStatusName"]}
//         selectOptions={{
//           userStatusName: [
//             { label: "Active", value: "Active" },
//             { label: "Inactive", value: "Inactive" },
//           ],
//         }}
//         // onDropdownChange={(field:any, value:any) => {
//         //   setColumnFilters({ ...columnFilters, [field]: value });
//         // }}
//         onAddClick={() => navigate("/customers/adduser")}
//         addButtonLabel="Add User"
//         addButtonPermission="Create User"
//         pageSize={pageSize}
//         setPageSize={(s) => setPageSize(s)}
//         setPage={setPage}
//       />

//       {loading ? (
//         <div className="flex items-center justify-center h-[60vh]">
//           <CircularProgress />
//         </div>
//       ) : (
//         <>
//           <VirtualizedTable
//             data={rows}
//             columns={columns}
//             loading={loading}
//             // onSort={(field, order) => {
//             //   // field is a keyof UserRecord
//             //   // transform to API OrderBy string like "displayName asc"
//             //   setOrderBy(`${String(field)} ${order}`);
//             // }}
//             onRowClick={() => {}}
//             height={520}
//           />

//           <div className="w-[95%] mx-auto flex items-center justify-between mt-2 text-sm">
//             <div>Showing {rows.length} of {totalCount}</div>
           
//               <Pagination
//                 count={Math.max(1, Math.ceil(totalCount / (pageSize as number)))}
//                 page={page}
//                 onChange={(e, p) => setPage(p)}
//                 size="small"
//               />
     
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserTablePage;


import React, { useState } from "react";
import { CircularProgress, Button, Box } from "@mui/material";
import { DataGrid, type GridColDef, type GridSortModel, type GridPaginationModel } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import { Edit, FilePlus } from "lucide-react";
import TableFilterBar from "./TableFilterBar";
import Modal from "../Modal/Modal";
import AssignUserTask from "../Tasks/AssignUserTask";
import api from "../../src/api/axiosClient";
import ProtectedAction from "../Auth/ProtectedAction";
import Cookies from "js-cookie";

interface UserRecord {
  userID: number;
  displayName: string;
  userName: string;
  email: string;
  roleName: string;
  userStatusName: string;
}

interface Task {
  id: string;
  name: string;
}

const UserTablePage: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken") ?? "";

  const {
    loading,
    rows,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    setOrderBy,
  } = useDataTable<UserRecord>({
    apiUrl: "/User/GetAllUserslist",
    token,
    defaultPageSize: 10,
  });

  const [assignTask, setAssignTask] = useState<UserRecord | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const access_token = Cookies.get("accessToken");

  const fetchTasksForUser = async (user: UserRecord) => {
    setAssignTask(user);
    setAvailableTasks([]);
    setAssignedTasks([]);
    try {
      const [assignedRes, availableRes] = await Promise.all([
        api.get(`/UserTask/assigned/${user.userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/UserTask/available/${user.userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (assignedRes.data?.isSucceed) {
        setAssignedTasks(
          assignedRes.data.data.map((t: any) => ({
            id: String(t.taskID),
            name: t.taskName,
          }))
        );
      }

      if (availableRes.data?.isSucceed) {
        setAvailableTasks(
          availableRes.data.data.map((t: any) => ({
            id: String(t.taskID),
            name: t.taskName,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Columns
  const columns: GridColDef<UserRecord>[] = [
    { field: "userID", headerName: "ID", flex: 1, sortable: true },
    { field: "displayName", headerName: "Name", flex: 2, sortable: true },
    { field: "userName", headerName: "Username", flex: 2 },
    { field: "email", headerName: "Email", flex: 3 },
    { field: "roleName", headerName: "Role", flex: 2, sortable: true },
    // { field: "userStatusName", headerName: "Status", flex: 1, sortable: true },
      {
      field: "userStatusName",
      headerName: "Status",
      flex: 1,
      sortable: true,
      renderCell: (params) => (
        <span className={`font-medium ${params.value ? "text-green-600" : "text-red-600"}`}>
          {params.value ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 2,
      renderCell: (params) => (
        <div className="flex gap-2">
          <ProtectedAction
            permission="Edit User"
            title="Edit User"
            onClick={() => navigate(`/customers/edituser/${params.row.userID}`)}
          >
            <Button size="small" variant="text">
              <Edit size={18} />
            </Button>
          </ProtectedAction>

          <ProtectedAction
            permission="Assign UserTask"
            title="Assign Tasks"
            onClick={() => fetchTasksForUser(params.row)}
          >
            <Button size="small" variant="text">
              <FilePlus size={18} />
            </Button>
          </ProtectedAction>
        </div>
      ),
    },
  ];

  // DataGrid pagination model
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: page - 1,
    pageSize: pageSize,
  });

  return (
    <div className="w-full">
      {/* Modal */}
      <Modal
        isOpen={Boolean(assignTask)}
        onClose={() => setAssignTask(null)}
        title={`Assign Tasks to: ${assignTask?.userName}`}
        size="full"
        closeOnOverlayClick={false}
      >
        <div className="w-full flex justify-center">
          <AssignUserTask
            userId={assignTask?.userID ?? 0}
            accessToken={access_token ?? ""}
            availableTasks={availableTasks}
            assignedTasks={assignedTasks}
            setAvailableTasks={setAvailableTasks}
            setAssignedTasks={setAssignedTasks}
          />
        </div>
      </Modal>

      {/* Filter */}
      <TableFilterBar
        searchText={searchTerm}
        setSearchText={setSearchTerm}
        dropdownFields={["roleName", "userStatusName"]}
        selectOptions={{
          userStatusName: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ],
        }}
        onAddClick={() => navigate("/customers/adduser")}
        addButtonLabel="Add User"
        addButtonPermission="Create User"
        pageSize={pageSize}
        setPageSize={(s) => setPageSize(s)}
        setPage={setPage}
      />

      {/* DataGrid */}
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          rowCount={totalCount}
          getRowId={(row) => row.userID}
          pagination
          paginationMode="server"
          sortingMode="client"
          disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 50]}   // 👈 THIS enables the dropdown

          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel(model);
            if (model.pageSize !== pageSize) setPageSize(model.pageSize);
            setPage(model.page + 1);
          }}
         
          
        />
      </Box>
    </div>
  );
};

export default UserTablePage;
