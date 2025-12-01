import React, { useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { Edit, Trash2 } from "lucide-react";
import TableFilterBar from "./TableFilterBar";
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

    // await api.delete(`/TicketPriority/DeleteTicketPriority`, {
    //   headers: { Authorization: `Bearer ${access_token}` },
    //   params: { id: deletePriority.priorityID }, // ✅ Correct param
    // });
    TicketPriorityApi.deleteTicketPriority(deletePriority.priorityID)

    setDeletePriority(null);
    window.location.reload();
  };

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
  } = useDataTable<PriorityRecord>({
    apiUrl: "/TicketPriority/GetAllTicketPriority", 
    token: access_token,
    searchableFields: ["priorityID", "priorityName","isActive"],
    defaultSearchField: "priorityName",
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

  const tableData = paginatedRows;

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
          dropdownFields={["isActive"]}
          fieldOptions={[
            { label: "Priority ID", value: "priorityID" },
            { label: "Priority Name", value: "priorityName" },
          ]}
        selectOptions={{
          isActive: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ],
        }}
          onAddClick={addPriority}
          addButtonLabel="Add Priority"
          addButtonPermission="Create Ticket Priority"
        />

        <VirtualizedTable<PriorityRecord> data={tableData} columns={columns} />

        <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
          <div>Showing {tableData.length} of {filteredRows.length}</div>

          {pageSize !== "all" && (
            <Pagination
              count={Math.ceil(filteredRows.length / Number(pageSize))}
              page={page}
              onChange={(e, p) => setPage(p)}
              size="small"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PriorityTable;
