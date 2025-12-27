import React, { useState } from "react";
import { CircularProgress, Tooltip } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { Edit, Trash2 } from "lucide-react";
import { useDataTable } from "../../hooks/useDataTable";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import Modal from "../Modal/Modal";
import ProtectedAction from "../Auth/ProtectedAction";
import Cookies from "js-cookie";
import { TicketStatusApi } from "../../src/api/ticketstatusApi";

interface StatusRecord {
  statusID: number;
  statusName: string;
  isActive: boolean;
}

const StatusTable: React.FC = () => {
  const navigate = useNavigate();
  const addStatus = () => navigate("/ticket/status/addstatus");
  const handleEdit = (status: StatusRecord) =>
    navigate(`/ticket/status/editstatus/${status.statusID}`);

  const [deleteStatus, setDeleteStatus] = useState<StatusRecord | null>(null);
  const access_token = Cookies.get("accessToken");

  // ✅ Handle Delete
  const handleDelete = (status: StatusRecord) => {
    setDeleteStatus(status);
  };



  const handleConfirmDelete = async () => {
    if (!deleteStatus) return;


    try {
      const res = await TicketStatusApi.deleteStatus(deleteStatus?.statusID)
      setDeleteStatus(null);
      console.log(res);
      refetch(); // Refresh without full reload
    } catch (error) {
      console.error("Failed to delete status:", error);
      alert("Could not delete status. Please try again.");
    }
  };

  const {
    loading,
    rows,
    refetch

  } = useDataTable<StatusRecord>({
    apiUrl: "/TicketStatus/GetAll",
    token: access_token,


  });

  const columns: Column<StatusRecord>[] = [
    { label: "Status ID", field: "statusID", flex: 1 },
    { label: "Status Name", field: "statusName", flex: 2 },

    {
      label: "Is Active",
      field: "isActive",
      flex: 1,
      render: (row) => (row.isActive ? "Yes" : "No"),
    },
    {
      label: "Actions",
      field: "statusID",
      flex: 1,
      render: (row) => (
        <div className="flex gap-4">
          <ProtectedAction title="Edit Status" permission="Edit Ticket Status">
            <Tooltip title="Edit Status">
              <Edit
                size={18}
                className="text-blue-600 cursor-pointer"
                onClick={() => handleEdit(row)}
              />
            </Tooltip>
          </ProtectedAction>

          <ProtectedAction title="Edit Status" permission="Delete Ticket Status">
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
        isOpen={Boolean(deleteStatus)}
        onClose={() => setDeleteStatus(null)}
        title={`Delete Status: ${deleteStatus?.statusName}`}
      >
        <div className="space-y-4 flex flex-col items-center">
          <p className="text-center text-sm">
            Are you sure you want to delete{" "}
            <strong>{deleteStatus?.statusName}</strong>? This action cannot be
            undone.
          </p>

          <div className="flex gap-4">
            <ButtonComponent
              variant="outlined"
              sx={{ bgcolor: "grey", ":hover": { bgcolor: "black" } }}
              onClick={() => setDeleteStatus(null)}
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
            <ProtectedAction permission="Create Ticket Status" title="Add Status">
              <ButtonComponent
                onClick={addStatus}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Add Status
              </ButtonComponent>
            </ProtectedAction>
          </div>

        </div>
        <VirtualizedTable<StatusRecord> data={tableData} columns={columns} />


      </div>
    </>
  );
};

export default StatusTable;
