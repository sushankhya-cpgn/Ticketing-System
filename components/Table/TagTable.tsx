import React, { useState } from "react";
import {
    CircularProgress,
    Pagination,
    Tooltip
} from "@mui/material";
import VirtualizedTable, { type Column } from "./VirtualizedTable";
import { Edit, Trash2 } from "lucide-react";
import TableFilterBar from "./TableFilterBar";
import { useDataTable } from "../../hooks/useDataTable";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../Buttons/button";
import DeleteButtonComponent from "../Buttons/DeleteButton";
import api from "../../src/api/axiosClient";
import Modal from "../Modal/Modal";
import ProtectedAction from "../Auth/ProtectedAction";

interface TagRecord {
    tagID: number;
    tagName: string;
}



const TagTable: React.FC = () => {
    const navigate = useNavigate();
    const addTag = () => navigate("/ticket/tag/addtag");
     const handleEdit = (tag: TagRecord) => navigate(`/ticket/tag/edittag/${tag.tagID}`);
    const [deleteTag, setDeleteTag] = useState<TagRecord | null>(null);
     
    const { access_token } = useSelector((state: RootState) => state.auth);
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
    } = useDataTable<TagRecord>({
        apiUrl: "/Tags/GetAllTags", // Change URL later
        token: access_token,
        searchableFields: ["tagID", "tagName"],
        defaultSearchField: "tagName",
    });

    const columns: Column<TagRecord>[] = [
        { label: "Tag ID", field: "tagID", flex: 1 },
        { label: "Tag Name", field: "tagName", flex: 2 },
        {
            label: "Actions",
            field: "tagID",
            flex: 1,
            render: (row) => (
                <div className="flex gap-4">
                    <ProtectedAction title="Edit Tag" permission="Edit Tag">
                        <Edit size={18} className="text-blue-600 cursor-pointer" onClick={() => handleEdit(row)}/>
                            </ProtectedAction>
                    <Tooltip title="Delete Tag">
                        <Trash2 size={18} className="text-red-600 cursor-pointer" onClick={() => handleDelete(row)}/>
                    </Tooltip>
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

        const handleDelete = (tag: TagRecord) => {
        setDeleteTag(tag);
    }

    const handleConfirmDelete = async() =>{
            if(!deleteTag) return;
            await api.delete('/Tags/DeleteTags',{
                headers:{
                    Authorization:`Bearer ${access_token}`
                },
                params:{id:deleteTag?.tagID}
            });
            setDeleteTag(null);
            window.location.reload();
    }


    return (
        <>
               <Modal
                isOpen={Boolean(deleteTag)}
                onClose={() => setDeleteTag(null)}
                title={`Delete Task: ${deleteTag?.tagName}`}
            >
                <div className="space-y-4 flex flex-col items-center">
                    <p className="text-center text-sm">
                        Are you sure you want to delete <strong>{deleteTag?.tagName}</strong>? This action
                        cannot be undone.
                    </p>

                    <div className="flex gap-4">
                        <ButtonComponent
                           variant="outlined"
                           sx={{bgcolor:"grey", ":hover":{bgcolor:"black"}}}
                            onClick={() => setDeleteTag(null)}
                        >
                            Cancel
                        </ButtonComponent>

                        <DeleteButtonComponent
                            onClick={handleConfirmDelete}
                            
                        >
                            <Trash2 size={18}  /> Delete
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
                dropdownFields={[]}
                fieldOptions={[
                    { label: "Tag ID", value: "tagID" },
                    { label: "Tag Name", value: "tagName" },
                ]}
                onAddClick={addTag}
                addButtonLabel="Add Tags"
            />

            <VirtualizedTable<TagRecord> data={tableData} columns={columns} />

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

export default TagTable;
