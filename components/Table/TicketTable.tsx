import React, {  useState } from "react";
import { CircularProgress, Pagination } from "@mui/material";
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
    const [deleteTicket, setDeleteTicket] = useState<TicketRecord | null>(null);
    const token = Cookies.get("accessToken") ?? "";


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
        columnFilters,
        setColumnFilters,
        refetch
    } = useDataTable<TicketRecord>({
        apiUrl: "/Ticket/GetAll",
        token,
        defaultPageSize: 10,
    });

    const addTicket = () => navigate("/ticket/createticket");
    const handleEdit = (ticket: TicketRecord) => navigate(`/ticket/editticket/${ticket.ticketID}`);
    const handleDelete = (ticket: TicketRecord) => {
        setDeleteTicket(ticket);
    }


    const handleConfirmDelete = async () => {
        if (!deleteTicket) return;
        // await api.delete(`/Ticket/Delete/${deleteTicket?.ticketID}`,{
        //     headers:{
        //         Authorization:`Bearer ${access_token}`
        //     },
        // });
        await TicketApi.deleteTicket(deleteTicket?.ticketID)
        setDeleteTicket(null);
        refetch();
    }



    const columns: Column<TicketRecord>[] = [
        { label: "TicketID", field: "ticketID", flex: 2 },
        { label: "Title", field: "title", flex: 4 },
        { label: "StatusName", field: "statusName", flex: 2 },
        { label: "PriorityName", field: "priorityName", flex: 3 },
        // { label: "TagName", field: "tagNames", flex: 2 },
        {
            label: "TagName",
            field: "tagNames",
            flex: 3,
            render: (row) => (
                <div className="flex flex-wrap gap-1">
                    {row.tagNames?.length > 0 ? (
                        row.tagNames.map((tag, i) => (
                            <span
                                key={i}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
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

 

    return (

        <>
            {/* Delete Confirmation Modal */}
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
                {/* Always render filter bar — even during loading */}
                <TableFilterBar
                    searchText={searchTerm}
                    setSearchText={setSearchTerm}
                    dropdownFields={["statusName", "priorityName"]} // adjust as needed
                    selectOptions={{
                        statusName: [
                            { label: "Open", value: "Open" },
                            { label: "Closed", value: "Closed" },
                            // ... add your actual statuses
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

                {/* Show loading spinner INSIDE table area only */}
                {loading ? (
                    <div className="flex items-center justify-center h-[60vh]">
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <VirtualizedTable<TicketRecord> data={rows} columns={columns} />

                        <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
                            <div>Showing {rows.length} of {totalCount}</div>

                            {pageSize !== "all" && (
                                <Pagination
                                    count={Math.max(1, Math.ceil(totalCount / (pageSize as number)))}
                                    page={page}
                                    onChange={(e, p) => setPage(p)}
                                    size="small"
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </>

    );
};

export default TicketTable;
