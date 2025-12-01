import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";
import TextAreaComponent from "../Fields/TextAreaComponent";
import MultiSelectChip from "../Fields/MultipleSelect";
import SelectSearch from "../Fields/SelectSearch";
import MydropZone from "../File Upload/fileupload";
import api from "../../src/api/axiosClient";
import FormHeader from "./Header";
import Modal from "../Modal/Modal";
import AttachmentCard from "../Card/AttachmentCard"

interface ApiResponse<T> {
  isSucceed: boolean;
  statusCode: number;
  message: string;
  data: T[];
}

interface Role {
  roleID: number;
  roleName: string;
}

interface TicketStatus {
  statusID: number;
  statusName: string;
}

interface TicketPriority {
  priorityID: number;
  priorityName: string;
}

interface TicketTag {
  tagID: number;
  tagName: string;
}

interface AssignedUser {
  userID: number;
  displayName: string;
}

interface CreateTicketFormProps {
  defaultValues?: any;
  onSubmit: (data: any) => void;
}

const CreateTicket: React.FC<CreateTicketFormProps> = ({ defaultValues, onSubmit }) => {
  const methods = useForm({
    defaultValues: defaultValues || {
      title: "",
      statusID: "",
      priorityID: "",
      assignedTo: "",
      roleID: "",
      tagIDs: [],
      description: "",
      files: [],
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue } = methods;

  const [roleOptions, setRoleOptions] = useState<{ label: string; value: number }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ label: string; value: number }[]>([]);
  const [priorityOptions, setPriorityOptions] = useState<{ label: string; value: number }[]>([]);
  const [tagOptions, setTagOptions] = useState<{ label: string; value: number }[]>([]);
  const [assignedToOptions, setAssignedToOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [existingAttachments,setExistingAttachments] = useState(defaultValues?.attachments || []);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);




const handleConfirmDelete = async () => {
  if (!selectedAttachment) return;

  try {
    await api.delete(`/Ticket/DeleteAttachment/${selectedAttachment.attachmentID}`);

    setExistingAttachments((prev:any) =>
      prev.filter((att:any) => att.attachmentID !== selectedAttachment.attachmentID)
    );

    setDeleteModalOpen(false);
    setSelectedAttachment(null);

  } catch (error: any) {
    console.error("Failed to delete attachment:", error);
    alert(error?.response?.data?.message || "Failed to delete file");
  }
};



  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        setLoading(true);
        setApiError(null);

        const [rolesRes, statusRes, priorityRes, tagsRes, assignedRes] = await Promise.all([
          api.get<ApiResponse<Role>>("/Utility/roles"),
          api.get<ApiResponse<TicketStatus>>("/Utility/ticketStatus"),
          api.get<ApiResponse<TicketPriority>>("/Utility/ticketPriority"),
          api.get<ApiResponse<TicketTag>>("/Utility/ticketTag"),
          api.get<ApiResponse<AssignedUser>>("/Utility/ticketAssignedTo"),
        ]);

        if (rolesRes.data.isSucceed) setRoleOptions(rolesRes.data.data.map(r => ({ label: r.roleName, value: r.roleID })));
        if (statusRes.data.isSucceed) setStatusOptions(statusRes.data.data.map(s => ({ label: s.statusName, value: s.statusID })));
        if (priorityRes.data.isSucceed) setPriorityOptions(priorityRes.data.data.map(p => ({ label: p.priorityName, value: p.priorityID })));
        if (tagsRes.data.isSucceed) setTagOptions(tagsRes.data.data.map(t => ({ label: t.tagName, value: t.tagID })));
        if (assignedRes.data.isSucceed) setAssignedToOptions(assignedRes.data.data.map(u => ({ label: u.displayName, value: u.userID })));

      } catch (err: any) {
        console.error(err);
        setApiError(err?.response?.data?.message || err.message || "Failed to load dropdowns");
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading options...</div>;
  if (apiError) return <div className="flex items-center justify-center min-h-screen text-red-600">{apiError}</div>;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <Modal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  title="Delete Attachment?"
  size="sm"
>
  <div className="text-center">
    <p className="mb-4 text-gray-700">
      Are you sure you want to delete 
      <span className="font-semibold"> {selectedAttachment?.url?.split('/').pop()}?</span>
    </p>

    <div className="flex justify-center gap-4 mt-4">
      <button
        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => setDeleteModalOpen(false)}
      >
        Cancel
      </button>

      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={handleConfirmDelete}
      >
        Delete
      </button>
    </div>
  </div>
</Modal>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
          <div className="rounded-lg shadow-sm">

            {/* Ticket Details */}
            <section className="border-b border-gray-200">
              <FormHeader title={defaultValues ? "Edit Ticket" : "Create Ticket"} />
              <div className="p-6 space-y-4">

                {/* Row 1: Title & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <TextFieldComponent
                    label="Title"
                    name="title"
                    register={register}
                    errors={errors}
                    required
                    placeholder="Enter ticket title"
                    height="50px"
                  />
                  <SelectSearch
                    label="Status"
                    name="statusID"
                    options={statusOptions}
                    required
                    errors={errors}
                    placeholder="Select Status"
                    height="50px"
                  />
                </div>

                {/* Row 2: Priority & Assigned To */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <SelectSearch
                    label="Priority"
                    name="priorityID"
                    options={priorityOptions}
                    required
                    errors={errors}
                    placeholder="Select Priority"
                    height="50px"
                  />
                  <SelectSearch
                    label="Assigned To"
                    name="assignedTo"
                    options={assignedToOptions}
                    required
                    errors={errors}
                    placeholder="Select User"
                    height="50px"
                  />
                </div>

                {/* Row 3: Role & Tags */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <SelectSearch
                    label="Role"
                    name="roleID"
                    options={roleOptions}
                    required
                    errors={errors}
                    placeholder="Select Role"
                    height="50px"
                  />
                  <MultiSelectChip
                    label="Tags"
                    name="tagIDs"
                    items={tagOptions}
                    labelKey="label"
                    valueKey="value"
                    required
                  />
                </div>

                {/* Description */}
                <TextAreaComponent
                  label="Description"
                  name="description"
                  placeholder="Enter ticket description"
                  register={register}
                  errors={errors}
                  required
                />

                <MydropZone
                  acceptedTypes={["image/*", "application/pdf"]}
                  onFilesChange={(files) => setValue("files", files)}
                  className="p-16 mt-4 border"
                />
              </div>

{defaultValues?.attachments && defaultValues.attachments.length > 0 && (
  <div className="p-4">
      {existingAttachments.length > 0 && (
  <div className="mt-6 p-4">
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      Previously uploaded documents ({existingAttachments.length})
    </h3>

    <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4">
        {existingAttachments.map((attachment: any) => (
    <AttachmentCard
      key={attachment.attachmentID}
      attachment={attachment}
      onDelete={(att:any) => {
        setSelectedAttachment(att);
        setDeleteModalOpen(true);
      }}
      width="w-40"
      showDelete={true}
    />
  ))}
    </div>
  </div>
)}

    </div>
)}
            </section>

            {/* Submit */}
            <div className="p-6">
              <button
                type="submit"
                className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
              >
                {defaultValues ? "Update Ticket" : "Create Ticket"}
              </button>
            </div>

          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateTicket;
