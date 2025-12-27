import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { Edit, Trash2 } from "lucide-react";
import { useDataTable } from "../../hooks/useDataTable";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import Modal from "../Modal/Modal";
import ProtectedAction from "../Auth/ProtectedAction";
import Cookies from "js-cookie";
import { TicketPriorityApi } from "../../src/api/ticketpriorityApi";

interface PriorityRecord {
  priorityID: string;
  priorityName: string;
  isActive: boolean;
}


const PriorityTable: React.FC = () => {
  const navigate = useNavigate();
  const addPriority = () => navigate("/ticket/priority/addpriority");
  const handleEdit = (priority: PriorityRecord) =>
    navigate(`/ticket/priority/editpriority/${priority.priorityID}`);

  const [deletePriority, setDeletePriority] =
    useState<PriorityRecord | null>(null);

    const access_token = Cookies.get("accessToken");


  // ✅ MUST be BEFORE columns
  const handleDelete = (priority: PriorityRecord) => {
    setDeletePriority(priority);
  };

const handleConfirmDelete = async () => {
    if (!deletePriority) return;

    try {
      await TicketPriorityApi.deleteTicketPriority(deletePriority.priorityID);
      setDeletePriority(null);
      refetch(); // Refresh without full reload
    } catch (error) {
      console.error("Failed to delete priority:", error);
      alert("Could not delete priority. Please try again.");
    }
  };

  const {
    loading,
    rows,
    refetch,
  
  } = useDataTable<PriorityRecord>({
    apiUrl: "/TicketPriority/GetAllTicketPriority", 
    token: access_token,
  });

  const columns: Column<PriorityRecord>[] = [
    { label: "Priority ID", field: "priorityID", flex: 1 },
    { label: "Priority Name", field: "priorityName", flex: 2 },
    { label: "Is Active", field: "isActive", flex: 1, render: (row) => (row.isActive ? "Yes" : "No") },
    {
      label: "Actions",
      field: "priorityID",
      flex: 1,
      render: (row) => (
        <div className="flex gap-4">
          <ProtectedAction title="Edit Priority" permission="Edit Ticket Priority">
            <Edit
              size={18}
              className="text-blue-600 cursor-pointer"
              onClick={() => handleEdit(row)}
            />
          
          </ProtectedAction>
          <ProtectedAction title="Delete Priority" permission="Delete Ticket Priority">
            <Trash2
              size={18}
              className="text-red-600 cursor-pointer"
              onClick={() => handleDelete(row)}
            />
          </ProtectedAction>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <CircularProgress />
      </div>
    );
  }

  const tableData = rows;

  return (
    <>
      {/* ✅ Delete Modal */}
      <Modal
        isOpen={Boolean(deletePriority)}
        onClose={() => setDeletePriority(null)}
        title={`Delete Priority: ${deletePriority?.priorityName}`}
      >
        <div className="space-y-4 flex flex-col items-center">
          <p className="text-center text-sm">
            Are you sure you want to delete{" "}
            <strong>{deletePriority?.priorityName}</strong>? This action cannot
            be undone.
          </p>

          <div className="flex gap-4">
            <ButtonComponent
              variant="outlined"
              sx={{ bgcolor: "grey", ":hover": { bgcolor: "black" } }}
              onClick={() => setDeletePriority(null)}
            >
              Cancel
            </ButtonComponent>

            <DeleteButtonComponent onClick={handleConfirmDelete}>
              <Trash2 size={18} /> Delete
            </DeleteButtonComponent>
          </div>
        </div>
      </Modal>

      <div className="w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <ProtectedAction permission="Create Ticket Priority" title="Add Priority">
              <ButtonComponent
                onClick={addPriority}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Add Priority
              </ButtonComponent>
            </ProtectedAction>
          </div>

        </div>

        <VirtualizedTable<PriorityRecord> data={tableData} columns={columns} />

      
      </div>
    </>
  );
};

export default PriorityTable;
