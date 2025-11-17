// import React, { useEffect, useState } from "react";
// import { CircularProgress, Pagination, Button } from "@mui/material";
// import VirtualizedTable, { type Column } from "./VirtualizedTable";
// import { useNavigate } from "react-router-dom";
// import { useDataTable } from "../../hooks/useDataTable";
// import { useSelector } from "react-redux";
// import type { RootState } from "../../app/store";
// import TableFilterBar from "../Table/TableFilterBar";
// import Modal from "../Modal/Modal";
// import AssignTasks from "../Tasks/AssignTasks";

// interface RoleRecord {
//     roleID: number;
//     roleName: string;
//     roleKey: string;
//     color: string;
//     roleStatus: boolean;
// }

// const RoleTable: React.FC = () => {
//     const navigate = useNavigate();
//     const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
//     const { access_token } = useSelector(
//         (state: RootState) => state.auth
//     );

//     const dropdownFields = ["roleStatus"];

//      const [availableTasks, setAvailableTasks] = useState([
//     { id: "1", name: "Create User" },
//     { id: "2", name: "Manage Projects" },
//     { id: "3", name: "View Reports" },
//   ]);

//   const [assignedTasks, setAssignedTasks] = useState([
//     { id: "4", name: "Edit Profile" },
//   ]);



//     const {
//         loading,
//         paginatedRows,
//         filteredRows,
//         searchField, setSearchField,
//         searchText, setSearchText,
//         searchSelect, setSearchSelect,
//         page, setPage,
//         pageSize, setPageSize,
//     } = useDataTable<RoleRecord>({
//         apiUrl: "/Role/GetAllRoles",
//         token: access_token,
//         searchableFields: ["roleName", "roleKey", "roleStatus"],
//         defaultSearchField: "roleName",
//     });

//     const addRole = () => {

//         navigate("/role/addrole")
//     };

//     const handleEdit = (role: RoleRecord) => {
//         navigate(`/role/editrole/${role.roleID}`);
//     };

//    const handleAssignRoleTask = async (role: RoleRecord) => {
//     setAssignTask(role); // Open modal first (optional)

//     try {
//         const response = await fetch(`/api/RoleTask/assigned/${role.roleID}`, {
//             headers: {
//                 Authorization: `Bearer ${access_token}`,
//             },
//         });

//         const result = await response.json();

//         if (result.isSucceed) {
//             const assignedTaskIds: number[] = result.data;
//             const assigned = availableTasks.filter(task => assignedTaskIds.includes(Number(task.id)));
//             const available = availableTasks.filter(task => !assignedTaskIds.includes(Number(task.id)));

//             setAssignedTasks(assigned);
//             setAvailableTasks(available);
//         }
//     } catch (error) {
//         console.error("Failed to fetch assigned tasks", error);
//     }
// };


//     const columns: Column<RoleRecord>[] = [
//         { label: "ID", field: "roleID", flex: 0.7 },
//         { label: "Role Name", field: "roleName", flex: 2 },
//         { label: "Role Key", field: "roleKey", flex: 1 },
//         {
//             label: "Color",
//             field: "color",
//             flex: 1,
//             render: (row) => (
//                 <div
//                     style={{
//                         width: 20,
//                         height: 20,
//                         backgroundColor: row.color,
//                         borderRadius: "50%",
//                     }}
//                 />
//             ),
//         },
//         {
//             label: "Status",
//             field: "roleStatus",
//             flex: 1,
//             render: (row) => (row.roleStatus ? "Active" : "Inactive"),
//         },
//         {
//             label: "Actions",
//             field: "roleID",
//             flex: 1.5,
//             render: (row) => (
//                 <>
//                     <Button size="small" variant="text" onClick={() => handleEdit(row)}>
//                         Edit
//                     </Button>
//                     <Button size="small" variant="text" onClick={() => handleAssignRoleTask(row)}>
//                         Assign Task
//                     </Button>
//                 </>
//             ),
//         },
//     ];

//     if (loading)
//         return (
//             <div className="flex items-center justify-center h-[70vh]">
//                 <CircularProgress />
//             </div>
//         );

//     return (
//         <div className="w-full">


// <Modal
//   isOpen={Boolean(assignTask)}
//   onClose={() => setAssignTask(null)}
//   title={`Assign Tasks to: ${assignTask?.roleName}`}
//   size="full" 
//   closeOnOverlayClick = {false}
// >
//   <div className="w-full flex flex-col items-center">
//     <div className="w-full max-w-4xl px-6">
//       <AssignTasks
//         availableTasks={availableTasks}
//         assignedTasks={assignedTasks}
//         setAvailableTasks={setAvailableTasks}
//         setAssignedTasks={setAssignedTasks}
//       />
//     </div>

//   </div>
// </Modal>

//             <TableFilterBar
//                 searchField={searchField}
//                 setSearchField={setSearchField}
//                 searchText={searchText}
//                 setSearchText={setSearchText}
//                 searchSelect={searchSelect}
//                 setSearchSelect={setSearchSelect}
//                 pageSize={pageSize}
//                 setPageSize={setPageSize}
//                 setPage={setPage}
//                 dropdownFields={["roleStatus"]}
//                 fieldOptions={[
//                     { label: "Role Name", value: "roleName" },
//                     { label: "Role Key", value: "roleKey" },
//                     { label: "Status", value: "roleStatus" },
//                 ]}
//                 selectOptions={{
//                     roleStatus: [
//                         { label: "Active", value: "true" },
//                         { label: "Inactive", value: "false" },
//                     ],
//                 }}
//                 addButtonLabel="Add Role"
//                 onAddClick={addRole}
//             />

//             <VirtualizedTable<RoleRecord> data={paginatedRows} columns={columns} />

//             <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
//                 <div>Showing {paginatedRows.length} of {filteredRows.length}</div>

//                 {pageSize !== "all" && (
//                     <Pagination
//                         count={Math.ceil(filteredRows.length / (pageSize as number))}
//                         page={page}
//                         onChange={(e, newPage) => setPage(newPage)}
//                         size="small"
//                         sx={{
//                             "& .MuiPaginationItem-root": {
//                                 color: "var(--text-foreground)", // your text color in dark mode
//                             },
//                             "& .MuiPaginationItem-root.Mui-selected": {
//                                 backgroundColor: "var(--background-logo)", // selected page background
//                                 color: "var(--text-foreground)", // selected page text
//                             },
//                         }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default RoleTable;

// RoleTable.tsx
import React, { useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import TableFilterBar from "../Table/TableFilterBar";
import Modal from "../Modal/Modal";
import AssignTasks from "../Tasks/AssignTasks";
import api from "../../src/api/axiosClient";
import { Edit, FilePlus} from "lucide-react";
import Cookies from "js-cookie";
import ProtectedAction from "../Auth/ProtectedAction";


interface RoleRecord {
  roleID: number;
  roleName: string;
  roleKey: string;
  color: string;
  roleStatus: boolean;
}

interface Task {
  id: string;
  name: string;
}

// Mock payloads


const RoleTable: React.FC = () => {
  const navigate = useNavigate();
    const access_token = Cookies.get("accessToken");

  const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

  const {
    loading,
    paginatedRows,
    filteredRows,
    searchField,
    setSearchField,
    searchText,
    setSearchText,
    searchSelect,
    setSearchSelect,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useDataTable<RoleRecord>({
    apiUrl: "/Role/GetAllRoles",
    token: access_token,
    searchableFields: ["roleName", "roleKey", "roleStatus"],
    defaultSearchField: "roleName",
  });

  const addRole = () => navigate("/role/addrole");
  const handleEdit = (role: RoleRecord) => navigate(`/role/editrole/${role.roleID}`);

  // Use mock payloads instead of API
  const handleAssignRoleTask = async (role: RoleRecord) => {
    setAssignTask(role); // Open modal

    // clear previous tasks
    setAvailableTasks([]);
    setAssignedTasks([]);

    try {
      const [assignedRes, availableRes] = await Promise.all([
        api.get(`/RoleTask/assigned/${role.roleID}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
        api.get(`/RoleTask/available/${role.roleID}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      ]);

      // Assigned tasks
      if (assignedRes.data.isSucceed) {
        setAssignedTasks(
          assignedRes.data.data.map((t: any) => ({
            id: t.taskID.toString(),
            name: t.taskName,
          }))
        );
      }

      // Available tasks
      if (availableRes.data.isSucceed) {
        setAvailableTasks(
          availableRes.data.data.map((t: any) => ({
            id: t.taskID.toString(),
            name: t.taskName,
          }))
        );
      }
    } catch (error: any) {
      console.error("Error fetching role tasks:", error);
    }
  };


  const columns: Column<RoleRecord>[] = [
    { label: "ID", field: "roleID", flex: 0.7 },
    { label: "Role Name", field: "roleName", flex: 2 },
    { label: "Role Key", field: "roleKey", flex: 1 },
    {
      label: "Color",
      field: "color",
      flex: 1,
      render: row => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: row.color,
            borderRadius: "50%",
          }}
        />
      ),
    },
    {
      label: "Status",
      field: "roleStatus",
      flex: 1,
      render: row => (row.roleStatus ? "Active" : "Inactive"),
    },
    {
      label: "Actions",
      field: "roleID",
      flex: 1.5,
      render: row => (
        <div className="flex gap-8">
          <ProtectedAction
        permission="Edit Role"
        title="Edit Role"
        onClick={() => handleEdit(row)}
      >
        <Edit size={18} style={{ color: "#2563eb" }} />
      </ProtectedAction>
        <ProtectedAction
        permission="Assign RoleTask"
        title="Assign Tasks"
        onClick={() => handleAssignRoleTask(row)}
      >
        <FilePlus size={18} style={{ color: "#2563eb" }} />
      </ProtectedAction>
        </div>
      ),
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircularProgress />
      </div>
    );

  return (
    <div className="w-full">
      {/* Assign Task Modal */}
      <Modal
        isOpen={Boolean(assignTask)}
        onClose={() => {
          setAssignTask(null);
          setAvailableTasks([]);
          setAssignedTasks([]);
        }}
        title={`Assign Tasks to: ${assignTask?.roleName}`}
        size="full"
        closeOnOverlayClick={false}
      >
        <div className="w-full flex falex-col items-center">
          <div className="w-full max-w-4xl px-6">
            <AssignTasks
              roleId={assignTask?.roleID ?? 0}
              availableTasks={availableTasks}
              assignedTasks={assignedTasks}
              accessToken={access_token ?? ""}
              setAvailableTasks={setAvailableTasks}
              setAssignedTasks={setAssignedTasks}
              onSave={tasks => {
                console.log("Saved assigned tasks:", tasks);
              }}
            />
          </div>
        </div>
      </Modal>

      {/* Filter Bar */}
      <TableFilterBar
        searchField={searchField}
        setSearchField={setSearchField}
        searchText={searchText}
        setSearchText={setSearchText}
        searchSelect={searchSelect}
        setSearchSelect={setSearchSelect}
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
        dropdownFields={["roleStatus"]}
        fieldOptions={[
          { label: "Role Name", value: "roleName" },
          { label: "Role Key", value: "roleKey" },
          { label: "Status", value: "roleStatus" },
        ]}
        selectOptions={{
          roleStatus: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ],
        }}
        addButtonLabel="Add Role"
        onAddClick={addRole}
        addButtonPermission="Create Role"
      />

      <VirtualizedTable<RoleRecord> data={paginatedRows} columns={columns} />

      {/* Pagination */}
      <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
        <div>
          Showing {paginatedRows.length} of {filteredRows.length}
        </div>

        {pageSize !== "all" && (
          <Pagination
            count={Math.ceil(filteredRows.length / (pageSize as number))}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            size="small"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "var(--text-foreground)",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "var(--background-logo)",
                color: "var(--text-foreground)",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default RoleTable;

