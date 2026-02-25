import React, { useState } from "react";
import { CircularProgress, Box } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Edit, Trash2 } from "lucide-react";

import { useDataTable } from "../../hooks/useDataTable";
import TableFilterBar from "./TableFilterBar";
import ProtectedAction from "../Auth/ProtectedAction";
import Modal from "../Modal/Modal";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import { TicketApi } from "../../src/api/ticketApi";

interface TicketRecord {
  ticketID: number;
  title: string;
  tagNames: string[];
  statusName: string;
  priorityName: string;
  createdByName: string;
  assignedToName: string;
  createdAt: string;
}

const TicketTable: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken") ?? "";

  const [deleteTicket, setDeleteTicket] = useState<TicketRecord | null>(null);

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
    refetch,
  } = useDataTable<TicketRecord>({
    apiUrl: "/Ticket/GetAll",
    token,
    defaultPageSize: 10,
  });

  const addTicket = () => navigate("/ticket/createticket");
  const handleEdit = (ticket: TicketRecord) =>
    navigate(`/ticket/editticket/${ticket.ticketID}`);

  const handleDelete = (ticket: TicketRecord) => {
    setDeleteTicket(ticket);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTicket) return;

    try {
      await TicketApi.deleteTicket(deleteTicket.ticketID);
      setDeleteTicket(null);
      refetch();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete ticket");
    }
  };

  // -----------------------------
  // DataGrid Columns
  // -----------------------------
  const columns: GridColDef<TicketRecord>[] = [
    { field: "ticketID", headerName: "Ticket ID", flex: 1 },

    { field: "title", headerName: "Title", flex: 2 },

    { field: "statusName", headerName: "Status", flex: 1 },

    { field: "priorityName", headerName: "Priority", flex: 1 },

    {
      field: "tagNames",
      headerName: "Tags",
      flex: 2,
      sortable: false,
      renderCell: (params) => (
        <div className="flex flex-wrap gap-1 h-full items-center">
          {params.row.tagNames?.length > 0 ? (
            params.row.tagNames.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium "
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-xs">No Tags</span>
          )}
        </div>
      ),
    },

    { field: "createdByName", headerName: "Created By", flex: 1 },

    { field: "assignedToName", headerName: "Assigned To", flex: 1 },

    { field: "createdAt", headerName: "Created At", flex: 1 },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const row = params.row;

        return (
          <div className="flex gap-6 items-center">

            <ProtectedAction
              permission="Edit Ticket"
              title="Edit Ticket"
              onClick={() => handleEdit(row)}
            >
              <Edit
                size={18}
                className="text-blue-600 cursor-pointer hover:text-blue-800"
                onClick={() => handleEdit(row)}
              />
            </ProtectedAction>

            <ProtectedAction
              permission="Delete Ticket"
              title="Delete Ticket"
            >
              <Trash2
                size={18}
                className="text-red-600 cursor-pointer hover:text-red-800"
                onClick={() => handleDelete(row)}
              />
            </ProtectedAction>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* ---------------- Delete Confirmation Modal ---------------- */}
      <Modal
        isOpen={Boolean(deleteTicket)}
        onClose={() => setDeleteTicket(null)}
        title={`Delete Ticket: ${deleteTicket?.title}`}
      >
        <div className="space-y-4 flex flex-col items-center py-4">
          <p className="text-center text-sm">
            Are you sure you want to delete{" "}
            <strong>{deleteTicket?.title}</strong>? This action cannot be undone.
          </p>

          <div className="flex gap-4">
            <ButtonComponent
              variant="outlined"
              sx={{ borderColor: "#666", color: "#666" }}
              onClick={() => setDeleteTicket(null)}
            >
              Cancel
            </ButtonComponent>

            <DeleteButtonComponent onClick={handleConfirmDelete}>
              <Trash2 size={18} className="mr-2" />
              Delete
            </DeleteButtonComponent>
          </div>
        </div>
      </Modal>

      <div className="w-full">

        {/* ---------------- Filter Bar ---------------- */}
        <TableFilterBar
          searchText={searchTerm}
          setSearchText={setSearchTerm}
          dropdownFields={["statusName", "priorityName"]}
          selectOptions={{
            statusName: [
              { label: "Open", value: "Open" },
              { label: "Closed", value: "Closed" },
            ],
            priorityName: [
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ],
          }}
          onAddClick={addTicket}
          addButtonLabel="Add Ticket"
          addButtonPermission="Create Ticket"
          pageSize={pageSize}
          setPageSize={setPageSize}
          setPage={setPage}
        />

        {/* ---------------- Loading ---------------- */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <CircularProgress />
          </div>
        ) : (
          <Box sx={{ height: "70vh", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}

              getRowId={(row) => row.ticketID}

              // 🔥 SERVER SIDE PAGINATION
              pagination
              paginationMode="server"
              rowCount={totalCount}

              pageSizeOptions={[5, 10, 20, 50, 100]}

              paginationModel={{
                page: page - 1,              // DataGrid is 0-based
                pageSize: pageSize as number,
              }}

              onPaginationModelChange={(model) => {
                // Page change
                if (model.page !== page - 1) {
                  setPage(model.page + 1);   // back to 1-based
                }

                // Page size change
                if (model.pageSize !== pageSize) {
                  setPageSize(model.pageSize);
                  setPage(1);               // reset to first page
                }
              }}

              disableRowSelectionOnClick
            />
          </Box>
        )}
      </div>
    </>
  );
};

export default TicketTable;
