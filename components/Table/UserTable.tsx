import React, { useState } from "react";
import { CircularProgress, Pagination, Button } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import { Edit, FilePlus } from "lucide-react";
import TableFilterBar from "./TableFilterBar";
import Modal from "../Modal/Modal";
import AssignUserTask from "../Tasks/AssignUserTask"
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

const UserTable: React.FC = () => {
  const navigate = useNavigate();
  const access_token = Cookies.get("accessToken");
  const [assignTask, setAssignTask] = useState<UserRecord | null>(null);
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
    selectOptions,
  } = useDataTable<UserRecord>({
    apiUrl: "/User/GetAllUserslist",
    token: access_token,
    searchableFields: ["displayName", "userName", "email", "roleName", "userStatusName"],
    defaultSearchField: "displayName",
  });

  const addUser = () => navigate("/customers/adduser");
  const handleEdit = (user: UserRecord) => navigate(`/customers/edituser/${user.userID}`);
 
  const handleAssignUserTask = async (user: UserRecord) => {
    setAssignTask(user); // Open modal

    // clear previous tasks
    setAvailableTasks([]);
    setAssignedTasks([]);

    try {
      const [assignedRes, availableRes] = await Promise.all([
        api.get(`/UserTask/assigned/${user.userID}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
        api.get(`/UserTask/available/${user.userID}`, {
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

  const columns: Column<UserRecord>[] = [
    { label: "ID", field: "userID", flex: 0.5 },
    { label: "Name", field: "displayName", flex: 2 },
    { label: "Username", field: "userName", flex: 2 },
    { label: "Email", field: "email", flex: 3 },
    { label: "Role", field: "roleName", flex: 2 },
    { label: "Status", field: "userStatusName", flex: 1 },
    {
      label: "Actions",
      field: "userID",
      flex: 2,
      render: (row) => (
        <div className="flex gap-2">
          <ProtectedAction
            permission="Edit User"
            title="Edit User"
            onClick={() => handleEdit(row)}
          >
            <Button size="small" variant="text" >
              <Edit size={18} />
            </Button>
          </ProtectedAction>

             <ProtectedAction
            permission="Assign UserTask"
            title="Assign Tasks"
            onClick={() => handleAssignUserTask(row)}
          >
            <Button size="small" variant="text">
              <FilePlus size={18} />
            </Button>
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
      <Modal
        isOpen={Boolean(assignTask)}
        onClose={() => setAssignTask(null)}
        title={`Assign Tasks to: ${assignTask?.roleName}`}
        size="full"
        closeOnOverlayClick={false}
      >
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-4xl px-6">
            <AssignUserTask
              userId={assignTask?.userID ?? 0}
              accessToken={access_token ?? ""}
              availableTasks={availableTasks}
              assignedTasks={assignedTasks}
              setAvailableTasks={setAvailableTasks}
              setAssignedTasks={setAssignedTasks}
            />
          </div>

        </div>
      </Modal>
  
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
        dropdownFields={["roleName", "userStatusName"]}
        fieldOptions={[
          { label: "Name", value: "displayName" },
          { label: "Username", value: "userName" },
          { label: "Email", value: "email" },
          { label: "Role", value: "roleName" },
          { label: "Status", value: "userStatusName" },
        ]}
        selectOptions={{
          roleName: selectOptions?.roleName || [],       // from API if dynamic
          userStatusName: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ],
        }}
        onAddClick={addUser}
        addButtonLabel="Add User"
        addButtonPermission="Create User"
      />

      <VirtualizedTable<UserRecord> data={paginatedRows} columns={columns} />

      <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
        <div>Showing {paginatedRows.length} of {filteredRows.length}</div>
        {pageSize !== "all" && (
          <Pagination
            count={Math.ceil(filteredRows.length / (pageSize as number))}
            page={page}
            onChange={(e, p) => setPage(p)}
            size="small" />
        )}
      </div>
    </div>
  );
};

export default UserTable;
