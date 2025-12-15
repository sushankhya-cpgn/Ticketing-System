// TaskTable.tsx — No Filters, Clean & Professional
import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import Modal from "../Modal/Modal";
import ProtectedAction from "../Auth/ProtectedAction";
import Cookies from "js-cookie";
import api from "../../src/api/axiosClient";

interface TaskRecord {
  taskID: number;
  taskName: string;
  taskKey: number;
  taskStatus: boolean;
  taskDetail: string;
  taskURL: string;
}

const TaskTable: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken") ?? "";

  const [deleteTask, setDeleteTask] = useState<TaskRecord | null>(null);

  const {
    loading,
    rows: data,
    totalCount,
    refetch,
  } = useDataTable<TaskRecord>({
    apiUrl: "/Task/GetAllTasks",
    token,
    defaultPageSize: 50,
  });

  const handleEdit = (task: TaskRecord) => {
    navigate(`/task/edit/${task.taskID}`);
  };

  const handleDelete = (task: TaskRecord) => {
    setDeleteTask(task);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTask) return;

    try {
      await api.delete(`/Task/Delete/${deleteTask.taskID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteTask(null);
      refetch(); // Refresh data without reload
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const columns: Column<TaskRecord>[] = [
    { label: "ID", field: "taskID", flex: 0.6 },
    { label: "Key", field: "taskKey", flex: 0.8 },
    { label: "Task Name", field: "taskName", flex: 2.2, sortable: true },
    {
      label: "Status",
      field: "taskStatus",
      flex: 1,
      render: (row) => (
        <span className={`font-medium ${row.taskStatus ? "text-green-600" : "text-red-600"}`}>
          {row.taskStatus ? "Active" : "Inactive"}
        </span>
      ),
    },
    { label: "Details", field: "taskDetail", flex: 2.5 },
    {
      label: "URL",
      field: "taskURL",
      flex: 1.8,
      render: (row) => (
        <a
          
          className="text-blue-600 hover:underline text-sm truncate block max-w-full"
        >
          {row.taskURL || "-"}
        </a>
      ),
    },
    {
      label: "Actions",
      field: "taskID" as keyof TaskRecord,
      flex: 1.5,
      render: (row) => (
        <div className="flex gap-6">
          <ProtectedAction permission="Edit UserTask" title="Edit Task">
            <Edit
              size={18}
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
              onClick={() => handleEdit(row)}
            />
          </ProtectedAction>

          <ProtectedAction permission="Delete UserTask" title="Delete Task">
            <Trash2
              size={18}
              className="text-red-600 hover:text-red-800 cursor-pointer transition-colors"
              onClick={() => handleDelete(row)}
            />
          </ProtectedAction>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTask)}
        onClose={() => setDeleteTask(null)}
        title={`Delete Task: ${deleteTask?.taskName}`}
        size="sm"
      >
        <div className="py-6 px-8 text-center space-y-6">
          <div>
            <p className="text-gray-700">
              Are you sure you want to delete the task
            </p>
            <p className="font-semibold text-lg mt-2 text-red-600">
              {deleteTask?.taskName}
            </p>
          </div>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex justify-center gap-4 mt-6">
            <ButtonComponent
              variant="outlined"
              onClick={() => setDeleteTask(null)}
              sx={{
                borderColor: "#666",
                color: "#666",
                ":hover": { borderColor: "#333", bgcolor: "rgba(0,0,0,0.04)" },
              }}
            >
              Cancel
            </ButtonComponent>

            <DeleteButtonComponent onClick={handleConfirmDelete}>
              <Trash2 size={18} className="mr-2" />
              Delete Task
            </DeleteButtonComponent>
          </div>
        </div>
      </Modal>

      <div className="w-full">
        {/* Top Bar: Only Add Button + Page Size */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <ProtectedAction permission="Create UserTask" title="Add Task">
              <ButtonComponent
                onClick={() => navigate("/task/addtask")}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Add Task
              </ButtonComponent>
            </ProtectedAction>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">
              Total: <strong>{totalCount}</strong> task{totalCount !== 1 ? "s" : ""}
            </span>

          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <CircularProgress />
          </div>
        ) : (
          <>
            <VirtualizedTable data={data} columns={columns} height={580} />

            {/* Bottom Pagination */}
      
          </>
        )}
      </div>
    </>
  );
};

export default TaskTable;