import React, { useState } from "react";
import { CircularProgress, Pagination, Tooltip } from "@mui/material";
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

    // await api.delete(`/TicketStatus/Delete`, {
    //   headers: { Authorization: `Bearer ${access_token}` },
    //   params: { id: deleteStatus.statusID },
    // });
    const res = TicketStatusApi.deleteStatus(deleteStatus?.statusID)

    setDeleteStatus(null);
    console.log(res);
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
  } = useDataTable<StatusRecord>({
    apiUrl: "/TicketStatus/GetAll",
    token: access_token,
    searchableFields: ["statusID", "statusName", "isActive"],
    defaultSearchField: "statusName",
    
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

  const tableData = paginatedRows;

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
            { label: "Status ID", value: "statusID" },
            { label: "Status Name", value: "statusName" },
          ]}
          selectOptions={{
            isActive: [
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          }}
          onAddClick={addStatus}
          addButtonLabel="Add Status"
          addButtonPermission="Create Ticket Status"
        />

        <VirtualizedTable<StatusRecord> data={tableData} columns={columns} />

        <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
          <div>
            Showing {tableData.length} of {filteredRows.length}
          </div>

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

export default StatusTable;
