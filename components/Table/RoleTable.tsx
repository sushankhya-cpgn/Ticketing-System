
// // import React, { useState } from "react";
// // import { CircularProgress, Pagination } from "@mui/material";
// // import VirtualizedTable, { type Column } from "./VirtualizedTable";
// // import { useNavigate } from "react-router-dom";
// // import { useDataTable } from "../../hooks/useDataTable";
// // import TableFilterBar from "../Table/TableFilterBar";
// // import Modal from "../Modal/Modal";
// // import AssignTasks from "../Tasks/AssignTasks";
// // import api from "../../src/api/axiosClient";
// // import { Edit, FilePlus} from "lucide-react";
// // import Cookies from "js-cookie";
// // import ProtectedAction from "../Auth/ProtectedAction";


// // interface RoleRecord {
// //   roleID: number;
// //   roleName: string;
// //   roleKey: string;
// //   color: string;
// //   roleStatus: boolean;
// // }

// // interface Task {
// //   id: string;
// //   name: string;
// // }

// // // Mock payloads


// // const RoleTable: React.FC = () => {
// //   const navigate = useNavigate();
// //     const access_token = Cookies.get("accessToken");

// //   const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
// //   const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
// //   const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

// //   const {
// //     loading,
// //     paginatedRows,
// //     filteredRows,
// //     searchField,
// //     setSearchField,
// //     searchText,
// //     setSearchText,
// //     searchSelect,
// //     setSearchSelect,
// //     page,
// //     setPage,
// //     pageSize,
// //     setPageSize,
// //   } = useDataTable<RoleRecord>({
// //     apiUrl: "/Role/GetAllRoles",
// //     token: access_token,
// //     searchableFields: ["roleName", "roleKey", "roleStatus"],
// //     defaultSearchField: "roleName",
// //   });

// //   const addRole = () => navigate("/role/addrole");
// //   const handleEdit = (role: RoleRecord) => navigate(`/role/editrole/${role.roleID}`);

// //   // Use mock payloads instead of API
// //   const handleAssignRoleTask = async (role: RoleRecord) => {
// //     setAssignTask(role); // Open modal

// //     // clear previous tasks
// //     setAvailableTasks([]);
// //     setAssignedTasks([]);

// //     try {
// //       const [assignedRes, availableRes] = await Promise.all([
// //         api.get(`/RoleTask/assigned/${role.roleID}`, {
// //           headers: {
// //             Authorization: `Bearer ${access_token}`,
// //           },
// //         }),
// //         api.get(`/RoleTask/available/${role.roleID}`, {
// //           headers: {
// //             Authorization: `Bearer ${access_token}`,
// //           },
// //         })
// //       ]);

// //       // Assigned tasks
// //       if (assignedRes.data.isSucceed) {
// //         setAssignedTasks(
// //           assignedRes.data.data.map((t: any) => ({
// //             id: t.taskID.toString(),
// //             name: t.taskName,
// //           }))
// //         );
// //       }

// //       // Available tasks
// //       if (availableRes.data.isSucceed) {
// //         setAvailableTasks(
// //           availableRes.data.data.map((t: any) => ({
// //             id: t.taskID.toString(),
// //             name: t.taskName,
// //           }))
// //         );
// //       }
// //     } catch (error: any) {
// //       console.error("Error fetching role tasks:", error);
// //     }
// //   };


// //   const columns: Column<RoleRecord>[] = [
// //     { label: "ID", field: "roleID", flex: 0.7 },
// //     { label: "Role Name", field: "roleName", flex: 2 },
// //     { label: "Role Key", field: "roleKey", flex: 1 },
// //     {
// //       label: "Color",
// //       field: "color",
// //       flex: 1,
// //       render: row => (
// //         <div
// //           style={{
// //             width: 20,
// //             height: 20,
// //             backgroundColor: row.color,
// //             borderRadius: "50%",
// //           }}
// //         />
// //       ),
// //     },
// //     {
// //       label: "Status",
// //       field: "roleStatus",
// //       flex: 1,
// //       render: row => (row.roleStatus ? "Active" : "Inactive"),
// //     },
// //     {
// //       label: "Actions",
// //       field: "roleID",
// //       flex: 1.5,
// //       render: row => (
// //         <div className="flex gap-8">
// //           <ProtectedAction
// //         permission="Edit Role"
// //         title="Edit Role"
// //         onClick={() => handleEdit(row)}
// //       >
// //         <Edit size={18} style={{ color: "#2563eb" }} />
// //       </ProtectedAction>
// //         <ProtectedAction
// //         permission="Assign RoleTask"
// //         title="Assign Tasks"
// //         onClick={() => handleAssignRoleTask(row)}
// //       >
// //         <FilePlus size={18} style={{ color: "#2563eb" }} />
// //       </ProtectedAction>
// //         </div>
// //       ),
// //     },
// //   ];

// //   if (loading)
// //     return (
// //       <div className="flex items-center justify-center h-[70vh]">
// //         <CircularProgress />
// //       </div>
// //     );

// //   return (
// //     <div className="w-full">
// //       {/* Assign Task Modal */}
// //       <Modal
// //         isOpen={Boolean(assignTask)}
// //         onClose={() => {
// //           setAssignTask(null);
// //           setAvailableTasks([]);
// //           setAssignedTasks([]);
// //         }}
// //         title={`Assign Tasks to: ${assignTask?.roleName}`}
// //         size="full"
// //         closeOnOverlayClick={false}
// //       >
// //         <div className="w-full flex falex-col items-center">
// //           <div className="w-full max-w-4xl px-6">
// //             <AssignTasks
// //               roleId={assignTask?.roleID ?? 0}
// //               availableTasks={availableTasks}
// //               assignedTasks={assignedTasks}
// //               accessToken={access_token ?? ""}
// //               setAvailableTasks={setAvailableTasks}
// //               setAssignedTasks={setAssignedTasks}
// //               onSave={tasks => {
// //                 console.log("Saved assigned tasks:", tasks);
// //               }}
// //             />
// //           </div>
// //         </div>
// //       </Modal>

// //       {/* Filter Bar */}
// //       <TableFilterBar
// //         searchField={searchField}
// //         setSearchField={setSearchField}
// //         searchText={searchText}
// //         setSearchText={setSearchText}
// //         searchSelect={searchSelect}
// //         setSearchSelect={setSearchSelect}
// //         pageSize={pageSize}
// //         setPageSize={setPageSize}
// //         setPage={setPage}
// //         dropdownFields={["roleStatus"]}
// //         fieldOptions={[
// //           { label: "Role Name", value: "roleName" },
// //           { label: "Role Key", value: "roleKey" },
// //           { label: "Status", value: "roleStatus" },
// //         ]}
// //         selectOptions={{
// //           roleStatus: [
// //             { label: "Active", value: "true" },
// //             { label: "Inactive", value: "false" },
// //           ],
// //         }}
// //         addButtonLabel="Add Role"
// //         onAddClick={addRole}
// //         addButtonPermission="Create Role"
// //       />

// //       <VirtualizedTable<RoleRecord> data={paginatedRows} columns={columns} />

// //       {/* Pagination */}
// //       <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
// //         <div>
// //           Showing {paginatedRows.length} of {filteredRows.length}
// //         </div>

// //         {pageSize !== "all" && (
// //           <Pagination
// //             count={Math.ceil(filteredRows.length / (pageSize as number))}
// //             page={page}
// //             onChange={(e, newPage) => setPage(newPage)}
// //             size="small"
// //             sx={{
// //               "& .MuiPaginationItem-root": {
// //                 color: "var(--text-foreground)",
// //               },
// //               "& .MuiPaginationItem-root.Mui-selected": {
// //                 backgroundColor: "var(--background-logo)",
// //                 color: "var(--text-foreground)",
// //               },
// //             }}
// //           />
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default RoleTable;

// import React, { useState } from "react";
// import { CircularProgress, Pagination } from "@mui/material";
// import VirtualizedTable, { type Column } from "./VirtualizedTable";
// import { useNavigate } from "react-router-dom";
// import { useDataTable } from "../../hooks/useDataTable";
// import TableFilterBar from "../Table/TableFilterBar"; // ← Make sure this is the updated server-side version
// import Modal from "../Modal/Modal";
// import AssignTasks from "../Tasks/AssignTasks";
// import api from "../../src/api/axiosClient";
// import { Edit, FilePlus } from "lucide-react";
// import Cookies from "js-cookie";
// import ProtectedAction from "../Auth/ProtectedAction";

// interface RoleRecord {
//   roleID: number;
//   roleName: string;
//   roleKey: string;
//   color: string;
//   roleStatus: boolean;
// }

// interface Task {
//   id: string;
//   name: string;
// }

// const RoleTable: React.FC = () => {
//   const navigate = useNavigate();
//   const access_token = Cookies.get("accessToken") ?? "";

//   const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
//   const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
//   const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

//   const {
//     loading,
//     rows: data,
//     totalCount,
//     page,
//     setPage,
//     pageSize,
//     setPageSize,
//     searchTerm,
//     setSearchTerm,
//     columnFilters,
//     setColumnFilters,
//     refetch,
//   } = useDataTable<RoleRecord>({
//     apiUrl: "/Role/GetAllRoles",
//     token: access_token,
//     defaultPageSize: 50,
//   });

//   const addRole = () => navigate("/role/addrole");
//   const handleEdit = (role: RoleRecord) => navigate(`/role/editrole/${role.roleID}`);

//   const handleAssignRoleTask = async (role: RoleRecord) => {
//     setAssignTask(role);
//     setAvailableTasks([]);
//     setAssignedTasks([]);

//     try {
//       const [assignedRes, availableRes] = await Promise.all([
//         api.get(`/RoleTask/assigned/${role.roleID}`, {
//           headers: { Authorization: `Bearer ${access_token}` },
//         }),
//         api.get(`/RoleTask/available/${role.roleID}`, {
//           headers: { Authorization: `Bearer ${access_token}` },
//         }),
//       ]);

//       if (assignedRes.data.isSucceed) {
//         setAssignedTasks(
//           assignedRes.data.data.map((t: any) => ({
//             id: String(t.taskID),
//             name: t.taskName,
//           }))
//         );
//       }

//       if (availableRes.data.isSucceed) {
//         setAvailableTasks(
//           availableRes.data.data.map((t: any) => ({
//             id: String(t.taskID),
//             name: t.taskName,
//           }))
//         );
//       }
//     } catch (error) {
//       console.error("Error fetching role tasks:", error);
//     }
//   };

//   const columns: Column<RoleRecord>[] = [
//     { label: "ID", field: "roleID", flex: 0.7, sortable: true },
//     { label: "Role Name", field: "roleName", flex: 2, sortable: true },
//     { label: "Role Key", field: "roleKey", flex: 1.5, sortable: true },
//     {
//       label: "Color",
//       field: "color",
//       flex: 1,
//       render: (row) => (
//         <div
//           style={{
//             width: 24,
//             height: 24,
//             backgroundColor: row.color || "#888",
//             borderRadius: "50%",
//             border: "2px solid rgba(255,255,255,0.3)",
//             boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
//           }}
//         />
//       ),
//     },
//     {
//       label: "Status",
//       field: "roleStatus",
//       flex: 1,
//       sortable: true,
//       render: (row) => (
//         <span className={row.roleStatus ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
//           {row.roleStatus ? "Active" : "Inactive"}
//         </span>
//       ),
//     },
//     {
//       label: "Actions",
//       field: "roleID" as keyof RoleRecord,
//       flex: 1.8,
//       render: (row) => (
//         <div className="flex gap-6">
//           <ProtectedAction permission="Edit Role" title="Edit Role" onClick={() => handleEdit(row)}>
//             <Edit size={18} className="text-blue-600 hover:text-blue-800 cursor-pointer" />
//           </ProtectedAction>

//           <ProtectedAction permission="Assign RoleTask" title="Assign Tasks" onClick={() => handleAssignRoleTask(row)}>
//             <FilePlus size={18} className="text-indigo-600 hover:text-indigo-800 cursor-pointer" />
//           </ProtectedAction>
//         </div>
//       ),
//     },
//   ];

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[70vh]">
//         <CircularProgress />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* Assign Task Modal */}
//       <Modal
//         isOpen={Boolean(assignTask)}
//         onClose={() => {
//           setAssignTask(null);
//           setAvailableTasks([]);
//           setAssignedTasks([]);
//         }}
//         title={`Assign Tasks to Role: ${assignTask?.roleName}`}
//         size="full"
//         closeOnOverlayClick={false}
//       >
//         <div className="w-full flex justify-center py-6">
//           <div className="w-full max-w-5xl">
//             <AssignTasks
//               roleId={assignTask?.roleID ?? 0}
//               availableTasks={availableTasks}
//               assignedTasks={assignedTasks}
//               accessToken={access_token}
//               setAvailableTasks={setAvailableTasks}
//               setAssignedTasks={setAssignedTasks}
//               onSave={() => {
//                 setAssignTask(null);
//                 refetch(); // Optional: refresh list if tasks affect visibility
//               }}
//             />
//           </div>
//         </div>
//       </Modal>

//       {/* Updated Filter Bar – Server-Side Ready */}
//       <TableFilterBar
//         searchText={searchTerm}
//         setSearchText={setSearchTerm}
//           dropdownFields={["roleName", "userStatusName"]}
//         selectOptions={{
//           userStatusName: [
//             { label: "Active", value: "Active" },
//             { label: "Inactive", value: "Inactive" },
//           ],
//         }}
//         // columnFilters={columnFilters}
//         // setColumnFilters={setColumnFilters}
//         // filterableColumns={[
//         //   {
//         //     field: "roleStatus",
//         //     label: "Status",
//         //     options: [
//         //       { label: "All", value: "" },
//         //       { label: "Active", value: "true" },
//         //       { label: "Inactive", value: "false" },
//         //     ],
//         //   },
//         // ]}
//         onAddClick={addRole}
//         addButtonLabel="Add Role"
//         addButtonPermission="Create Role"
//         pageSize={pageSize}
//         setPageSize={setPageSize}
//         setPage={setPage}
//       />

//       {/* Table */}
//       <VirtualizedTable
//         data={data}
//         columns={columns}
//         height={580}
//         onSort={(field, order) => {
//           // Optional: send to backend via orderBy if you add it later
//           console.log("Sort:", field, order);
//         }}
//       />

//       {/* Pagination */}
//       <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-4 pb-4">
//         <div>
//           Showing {data.length} of {totalCount} roles
//           {totalCount !== data.length && pageSize !== "all" && ` (Page ${page})`}
//         </div>

//         {pageSize !== "all" && totalCount > 0 && (
//           <Pagination
//             count={Math.ceil(totalCount / (pageSize as number))}
//             page={page}
//             onChange={(_, p) => setPage(p)}
//             size="medium"
//             sx={{
//               "& .MuiPaginationItem-root": {
//                 color: "var(--text-foreground)",
//               },
//               "& .MuiPaginationItem-root.Mui-selected": {
//                 backgroundColor: "var(--background-logo)",
//                 color: "white",
//               },
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default RoleTable;

// RoleTable.tsx — IDENTICAL UX to UserTablePage
import React, { useState } from "react";
import { Button, CircularProgress, Pagination } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import TableFilterBar from "../Table/TableFilterBar";
import Modal from "../Modal/Modal";
import AssignTasks from "../Tasks/AssignTasks";
import api from "../../src/api/axiosClient";
import { Edit, FilePlus } from "lucide-react";
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

const RoleTable: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken") ?? "";

  const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
  const [availableTasks, setAvailableTasks] = useState<Task[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);

  // Server-side data table
  const {
    loading,
    rows: data,
    totalCount,
    page,
    setPage,
    pageSize,
    setPageSize,
    searchTerm,
    setSearchTerm,
    columnFilters,
    setColumnFilters,
  } = useDataTable<RoleRecord>({
    apiUrl: "/Role/GetAllRoles",
    token,
    defaultPageSize: 50,
  });

  const handleAssignRoleTask = async (role: RoleRecord) => {
    setAssignTask(role);
    setAvailableTasks([]);
    setAssignedTasks([]);

    try {
      const [assignedRes, availableRes] = await Promise.all([
        api.get(`/RoleTask/assigned/${role.roleID}`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/RoleTask/available/${role.roleID}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (assignedRes.data.isSucceed) {
        setAssignedTasks(assignedRes.data.data.map((t: any) => ({ id: String(t.taskID), name: t.taskName })));
      }
      if (availableRes.data.isSucceed) {
        setAvailableTasks(availableRes.data.data.map((t: any) => ({ id: String(t.taskID), name: t.taskName })));
      }
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  const columns: Column<RoleRecord>[] = [
    { label: "ID", field: "roleID", flex: 0.7 },
    { label: "Role Name", field: "roleName", flex: 2, sortable: true },
    { label: "Role Key", field: "roleKey", flex: 1.5 },
    {
      label: "Color",
      field: "color",
      flex: 1,
      render: (row) => (
        <div
          className="w-6 h-6 rounded-full border-2 border-gray-300 shadow-sm"
          style={{ backgroundColor: row.color || "#94a3b8" }}
        />
      ),
    },
    {
      label: "Status",
      field: "roleStatus",
      flex: 1,
      render: (row) => (
        <span className={`font-medium ${row.roleStatus ? "text-green-600" : "text-red-600"}`}>
          {row.roleStatus ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      label: "Actions",
      field: "roleID" as keyof RoleRecord,
      flex: 2,
      render: (row) => (
        <div className="flex gap-6">
          <ProtectedAction permission="Edit Role" title="Edit Role" onClick={() => navigate(`/role/editrole/${row.roleID}`)}>
             <Button size="small" variant="text"><Edit size={18}  /></Button> 
          </ProtectedAction>

          <ProtectedAction permission="Assign RoleTask" title="Assign Tasks" onClick={() => handleAssignRoleTask(row)}>
            <Button size="small" variant="text"> <FilePlus size={18}  /></Button>
          </ProtectedAction>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {/* Assign Task Modal */}
      <Modal
        isOpen={Boolean(assignTask)}
        onClose={() => setAssignTask(null)}
        title={`Assign Tasks to: ${assignTask?.roleName}`}
        size="full"
        closeOnOverlayClick={false}
      >
        <div className="w-full flex justify-center py-8">
          <div className="w-full max-w-5xl">
            <AssignTasks
              roleId={assignTask?.roleID ?? 0}
              availableTasks={availableTasks}
              assignedTasks={assignedTasks}
              accessToken={token}
              setAvailableTasks={setAvailableTasks}
              setAssignedTasks={setAssignedTasks}
            />
          </div>
        </div>
      </Modal>

      {/* EXACT SAME FILTER BAR AS USERTABLE */}
      <TableFilterBar
        searchText={searchTerm}
        setSearchText={setSearchTerm}
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
        // Bridge dropdown → columnFilters so server filtering works!
        // onDropdownChange={(field, value) => {
        //   setColumnFilters((prev) => ({
        //     ...prev,
        //     [field]: value || "", // send empty string to clear filter
        //   }));
        // }}
        onAddClick={() => navigate("/role/addrole")}
        addButtonLabel="Add Role"
        addButtonPermission="Create Role"
        pageSize={pageSize}
        setPageSize={setPageSize}
        setPage={setPage}
      />

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <CircularProgress />
        </div>
      ) : (
        <>
          <VirtualizedTable
            data={data}
            columns={columns}
            height={520}
            // onSort={(field, order) => {
            //   // Optional: implement server sorting later
            // }}
          />

          <div className="w-[95%] mx-auto flex items-center justify-between mt-2 text-sm">
            <div>Showing {data.length} of {totalCount}</div>

            {pageSize !== "all" && (
              <Pagination
                count={Math.ceil(totalCount / (pageSize as number))}
                page={page}
                onChange={(_, p) => setPage(p)}
                size="small"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RoleTable;