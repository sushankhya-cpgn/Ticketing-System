import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";
import TextAreaComponent from "../Fields/TextAreaComponent";
import MultiSelectChip from "../Fields/MultipleSelect";
import SelectSearch from "../Fields/SelectSearch";
import MydropZone from "../File Upload/fileupload";
import api from "../../src/api/axiosClient";
import FormHeader from "./Header";

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

                {/* File Upload */}
                {/* <MydropZone
                    onFilesChange={(files: File[]) => setValue("files", files)}
                    className="p-16 mt-4 border"
                  /> */}

                <MydropZone
                  acceptedTypes={["image/*", "application/pdf"]}
                  onFilesChange={(files) => setValue("files", files)}
                  className="p-16 mt-4 border"
                />
              </div>

{defaultValues?.attachments && defaultValues.attachments.length > 0 && (
  <div className="mt-6 p-4">
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      Previously uploaded documents ({defaultValues.attachments.length})
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {defaultValues.attachments.map((attachment: any) => {
        const isImage = attachment.url.match(/\.(jpeg|jpg|gif|png|webp)$/i);
        const fileName = attachment.url.split('/').pop()?.split('_').slice(1).join('_') || 'file';

        return (
          <div
            key={attachment.attachmentID}
            className="relative border rounded-lg overflow-hidden bg-gray-50 group"
          >
            {isImage ? (
              <img
                src={attachment.url}
                alt="attachment"
                className="w-full h-32 object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-200">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            )}

            <div className="p-2 text-xs text-center text-gray-600 truncate">
              {fileName}
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-gray-800 px-3 py-1 rounded text-xs font-medium hover:bg-gray-100"
              >
                View
              </a>
            </div>
          </div>
        );
      })}
    </div>
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
