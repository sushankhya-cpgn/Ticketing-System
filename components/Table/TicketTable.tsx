import React, { useState } from "react";
import { CircularProgress, Pagination} from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { useNavigate } from "react-router-dom";
import { useDataTable } from "../../hooks/useDataTable";
import TableFilterBar from "./TableFilterBar";
import Cookies from "js-cookie";
import ProtectedAction from "../Auth/ProtectedAction";
import { Edit, Trash2 } from "lucide-react";
import Modal from "../Modal/Modal";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import api from "../../src/api/axiosClient";

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
    const [deleteTicket, setDeleteTicket] = useState<TicketRecord | null>(null);
    const access_token = Cookies.get("accessToken");

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
    } = useDataTable<TicketRecord>({
        apiUrl: "/Ticket/GetAll",
        token: access_token,
        searchableFields: ["title"],
        defaultSearchField: "title",
    });

    const addTicket = () => navigate("/ticket/createticket");
    const handleEdit = (ticket: TicketRecord) => navigate(`/ticket/editticket/${ticket.ticketID}`);
    const handleDelete = (ticket: TicketRecord) => {
        setDeleteTicket(ticket);
    }

    
    const handleConfirmDelete = async() =>{
            if(!deleteTicket) return;
            await api.delete(`/Ticket/Delete/${deleteTicket?.ticketID}`,{
                headers:{
                    Authorization:`Bearer ${access_token}`
                },
            });
            setDeleteTicket(null);
            window.location.reload();
    }



    const columns: Column<TicketRecord>[] = [
        { label: "TicketID", field: "ticketID", flex: 2 },
        { label: "Title", field: "title", flex: 4 },
        { label: "StatusName", field: "statusName", flex: 2 },
        { label: "PriorityName", field: "priorityName", flex: 3 },
        { label: "TagName", field: "tagNames", flex: 2 },
        { label: "CreatedBy", field: "createdByName", flex: 2 },
        { label: "AssignedTo", field: "assignedToName", flex: 2 },
        { label: "CreatedAt", field: "createdAt", flex: 2 },
        {
            label: "Actions",
            field: "ticketID",
            flex: 2,
            render: (row) => (
                <div className="flex gap-8">

                    <ProtectedAction
                        permission="Edit Ticket"
                        title="Edit Tasks"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit size={18} onClick={() => handleEdit(row)} style={{ color: "#2563eb" }} />
                    </ProtectedAction>
                    <ProtectedAction
                        permission="Delete Ticket"
                        title="Delete Task">
                        <Trash2 size={18} className="text-red-600" onClick={() => handleDelete(row)} />

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
        <>
            <Modal
                isOpen={Boolean(deleteTicket)}
                onClose={() => setDeleteTicket(null)}
                title={`Delete Task: ${deleteTicket?.title}`}
            >
                <div className="space-y-4 flex flex-col items-center">
                    <p className="text-center text-sm">
                        Are you sure you want to delete <strong>{deleteTicket?.title}</strong>? This action
                        cannot be undone.
                    </p>

                    <div className="flex gap-4">
                        <ButtonComponent
                            variant="outlined"
                            sx={{ bgcolor: "grey", ":hover": { bgcolor: "black" } }}
                            onClick={() => setDeleteTicket(null)}
                        >
                            Cancel
                        </ButtonComponent>

                        <DeleteButtonComponent
                            onClick={handleConfirmDelete}

                        >
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
                    dropdownFields={["roleName", "userStatusName"]}
                    fieldOptions={[
                        { label: "ticketID", value: "ticketID" },
                        { label: "title", value: "title" },
                        { label: "statusName", value: "statusName" },
                        { label: "priorityName", value: "priorityName" },
                        { label: "tagNames", value: "tagNames" },
                        { label: "createdByName", value: "createdByName" },
                        { label: "assignedToName", value: "assignedToName" }

                    ]}

                    onAddClick={addTicket}
                    addButtonLabel="Add Ticket"
                    addButtonPermission="Create Ticket"

                />

                <VirtualizedTable<TicketRecord> data={paginatedRows} columns={columns} />

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
        </>
    );
};

export default TicketTable;
