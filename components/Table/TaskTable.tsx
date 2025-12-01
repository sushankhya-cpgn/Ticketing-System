import React, { useState } from "react";
import {
    CircularProgress,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Pagination,
    Tooltip,
} from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import SelectSearch from "../Fields/SelectSearch";
import TextFieldComponent from "../Fields/TextFieldComponent";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Buttons/button";
import { useDataTable } from "../../hooks/useDataTable";
import { Edit, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import Modal from "../Modal/Modal";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import api from "../../src/api/axiosClient";
import ProtectedAction from "../Auth/ProtectedAction";

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
    const [deleteTask, setDeleteTask] = useState<TaskRecord | null>(null);
    const access_token = Cookies.get("accessToken");

    


    const {
        loading,
        paginatedRows,
        filteredRows,
        searchField,
        setSearchField,
        searchText,
        setSearchText,
        setSearchSelect,
        page,
        setPage,
        pageSize,
        setPageSize,
    } = useDataTable<TaskRecord>({
        apiUrl: "/Task/GetAllTasks",
        token: access_token,
        searchableFields: ["taskName", "taskDetail", "taskURL"],
        defaultSearchField: "taskName",
    });

    const addTask = () => navigate("/task/addtask");
    const handleEdit = (task: TaskRecord) => navigate(`/task/edit/${task.taskID}`);
    const handleDelete = (task: TaskRecord) => {
        setDeleteTask(task);
    }

    const handleConfirmDelete = async () => {
        if (!deleteTask) return;
        await api.delete(`/Task/Delete/${deleteTask?.taskID}`, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        setDeleteTask(null);
        window.location.reload();
    }



    const columns: Column<TaskRecord>[] = [
        { label: "ID", field: "taskID", flex: 0.5 },
        { label: "Key", field: "taskKey", flex: 1 },
        { label: "Task Name", field: "taskName", flex: 2 },
        { label: "Status", field: "taskStatus", flex: 1, render: (row) => (row.taskStatus ? "Active" : "Inactive") },
        { label: "Details", field: "taskDetail", flex: 3 },
        { label: "URL", field: "taskURL", flex: 2 },
        {
            label: "Actions",
            field: "taskID",
            flex: 2,
            render: (row) => (
                <div className="flex gap-8">

                    <ProtectedAction
                        permission="Edit UserTask"
                        title="Edit Tasks"
                        onClick={() => handleEdit(row)}
                    >
                        <Edit size={18} onClick={() => handleEdit(row)} style={{ color: "#2563eb" }} />
                    </ProtectedAction>
                    <ProtectedAction
                        permission="Delete UserTask"
                        title="Delete Task">
                    <Tooltip title="Delete Task">
                        <Trash2 size={18} className="text-red-600" onClick={() => handleDelete(row)} />
                    </Tooltip>
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
                isOpen={Boolean(deleteTask)}
                onClose={() => setDeleteTask(null)}
                title={`Delete Task: ${deleteTask?.taskName}`}
            >
                <div className="space-y-4 flex flex-col items-center">
                    <p className="text-center text-sm">
                        Are you sure you want to delete <strong>{deleteTask?.taskName}</strong>? This action
                        cannot be undone.
                    </p>

                    <div className="flex gap-4">
                        <ButtonComponent
                            variant="outlined"
                            sx={{ bgcolor: "grey", ":hover": { bgcolor: "black" } }}
                            onClick={() => setDeleteTask(null)}
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
                <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 border-b">

                    <div className="flex gap-4 flex-wrap items-center">
                        <SelectSearch
                            label="Field"
                            value={searchField}
                            onChange={(v) => {
                                setSearchField(v as keyof TaskRecord);
                                setSearchText("");
                                setSearchSelect("");
                                setPage(1);
                            }}
                            options={[
                                { label: "Task Name", value: "taskName" },
                                { label: "Detail", value: "taskDetail" },
                                { label: "URL", value: "taskURL" },
                            ]}
                            width="200px"
                        />

                        <TextFieldComponent
                            type="text"
                            label="Search"
                            name="search"
                            width="250px"
                            placeholder="Search tasks..."
                            value={searchText}
                            onChange={(e: any) => setSearchText(e.target.value)}
                            height="40px"
                        />
                    </div>

                    <div>
                        <ProtectedAction
                            permission="Create UserTask"
                            title="Add Task">
                        <ButtonComponent onClick={addTask} sx={{ backgroundColor: "green", marginRight: "20px" }}>
                            Add Task
                        </ButtonComponent>

                        </ProtectedAction>

                        <FormControl size="small">
                            <InputLabel>Rows</InputLabel>
                            <Select
                                label="Rows"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(e.target.value as number | "all");
                                    setPage(1);
                                }}
                                style={{ minWidth: 120 }}
                            >
                                {[50, 100, 200, "all"].map((size) => (
                                    <MenuItem key={size} value={size}>
                                        {size === "all" ? "All" : size}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

                </div>

                <VirtualizedTable<TaskRecord> data={paginatedRows} columns={columns} />

                <div className="w-[95%] mx-auto flex items-center justify-between text-sm mt-2">
                    <div>Showing {paginatedRows.length} of {filteredRows.length}</div>

                    {pageSize !== "all" && (
                        <Pagination
                            count={Math.ceil(filteredRows.length / (pageSize as number))}
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

export default TaskTable;
