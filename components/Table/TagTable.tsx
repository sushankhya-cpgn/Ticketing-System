// TagTable.tsx
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
import { TagApi } from "../../src/api/tagApi";

interface TagRecord {
  tagID: number;
  tagName: string;
}

const TagTable: React.FC = () => {
  const navigate = useNavigate();
  const token = Cookies.get("accessToken") ?? "";

  const [deleteTag, setDeleteTag] = useState<TagRecord | null>(null);

  const {
    loading,
    rows: data,
    totalCount,
    refetch,
  } = useDataTable<TagRecord>({
    apiUrl: "/Tags/GetAllTags",
    token,
    defaultPageSize: 50,
  });

  const handleEdit = (tag: TagRecord) => {
    navigate(`/ticket/tag/edittag/${tag.tagID}`);
  };

  const handleDelete = (tag: TagRecord) => {
    setDeleteTag(tag);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTag) return;

    try {
      await TagApi.deleteTag(deleteTag.tagID);
      setDeleteTag(null);
      refetch(); // Refresh list without full page reload
    } catch (error) {
      console.error("Failed to delete tag:", error);
      alert("Failed to delete tag. Please try again.");
    }
  };

  const columns: Column<TagRecord>[] = [
    { label: "Tag ID", field: "tagID", flex: 1 },
    { label: "Tag Name", field: "tagName", flex: 3 },
    {
      label: "Actions",
      field: "tagID" as keyof TagRecord,
      flex: 1.5,
      render: (row) => (
        <div className="flex gap-6">
          <ProtectedAction permission="Edit Tags" title="Edit Tag">
            <Edit
              size={18}
              className="text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
              onClick={() => handleEdit(row)}
            />
          </ProtectedAction>

          <ProtectedAction permission="Delete Tags" title="Delete Tag">
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
        isOpen={Boolean(deleteTag)}
        onClose={() => setDeleteTag(null)}
        title={`Delete Tag: ${deleteTag?.tagName}`}
        size="sm"
      >
        <div className="py-6 px-8 text-center space-y-6">
          <p className="text-gray-700">
            Are you sure you want to delete the tag{" "}
            <strong >{deleteTag?.tagName}</strong>?
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>

          <div className="flex justify-center gap-4 mt-6">
              
                      <ButtonComponent
                        variant="outlined"
                        sx={{ bgcolor: "grey", ":hover": { bgcolor: "black" } }}
                        onClick={() => setDeleteTag(null)}
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
        {/* Top Bar: Only Add Button + Page Size */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-50/50">
          <div className="flex items-center gap-4">
            <ProtectedAction permission="Create Tags" title="Add Tag">
              <ButtonComponent
                onClick={() => navigate("/ticket/tag/addtag")}
                sx={{ backgroundColor: "green", color: "white" }}
              >
                Add Tag
              </ButtonComponent>
            </ProtectedAction>
          </div>

        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* Table */}
            <VirtualizedTable data={data} columns={columns} height={580} />

            {/* Bottom Info + Pagination */}
            <div className="w-[95%] mx-auto flex items-center justify-between mt-4 pb-6 text-sm text-gray-600">
              <div>
                Showing {data.length} of {totalCount} tag{totalCount !== 1 ? "s" : ""}
              </div>

              
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default TagTable;