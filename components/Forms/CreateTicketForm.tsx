// import { useForm, FormProvider } from "react-hook-form";
// import Layout from "../layout/Layout";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import FormHeader from "./Header";
// import MydropZone from "../File Upload/fileupload";
// import TextAreaComponent from "../Fields/TextAreaComponent";
// import { useState } from "react";
// import MultiSelectChip from "../Fields/MultipleSelect";
// import SelectSearch from "../Fields/SelectSearch";

// interface TicketFormProps {
//   onSubmit: (data: any) => void;
//   defaultValues?: {
//     // ticketID?: number;
//     title?: string;
//     description?: string;
//     statusId?: number;
//     priorityId?: number;
//     assignedTo?: string;
//     roleId?: number;
//     attachments?: FileList;
//     tagIds?: number[];
//   };
// }

// const CreateTicketForm = ({ onSubmit, defaultValues }: TicketFormProps) => {
//   const methods = useForm({
//     defaultValues: defaultValues || {
//       title: "",
//       description: "",
//       statusId: "",
//       priorityId: "",
//       assignedTo: "",
//       roleId: "",
//       attachments: undefined,
//       tagIds: []
//     }
//   });

//   const { register, handleSubmit, formState: { errors } } = methods;
//   const [selectedTags, setSelectedTags] = useState<number[]>([]);
//   const tags = [
//     { tagID: 1, tagName: "Ok" },
//     { tagID: 4, tagName: "react" },
//   ];

//   const StatusOptions = [
//     { label: "Open", value: 1 },
//     { label: "In Progress", value: 2 },
//     { label: "Closed", value: 3 },
//   ];

//   return (
//     <Layout>
//       <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
//             <div className="rounded-lg shadow-sm">

//               <section className="border-b border-gray-200">
//                 <FormHeader title={defaultValues ? "Edit Ticket" : "Create Ticket"} />

//                 <div className="p-6 space-y-4">

//                   {/* Title + Status */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Title"
//                       name="title"
//                       register={register}
//                       errors={errors}
//                       placeholder="Enter ticket title"
//                       required
//                       height="50px"
//                     />
//                     <SelectSearch
//                       label="Status"
//                       name="StatusID"
//                       options={StatusOptions}
//                       required
//                       errors={errors}
//                       placeholder="Select Status"
//                       height="50px"
//                     />
//                   </div>

//                   {/* Priority + AssignedTo */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Priority ID"
//                       name="priorityId"
//                       type="number"
//                       register={register}
//                       errors={errors}
//                       placeholder="Select priority"
//                       required
//                       height="50px"
//                     />

//                     <TextFieldComponent
//                       label="Assigned To"
//                       name="assignedTo"
//                       register={register}
//                       errors={errors}
//                       placeholder="Username / User ID"
//                       required
//                       height="50px"
//                     />
//                   </div>

//                   {/* Role */}
//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Role ID"
//                       name="roleId"
//                       type="number"
//                       register={register}
//                       errors={errors}
//                       placeholder="Enter role ID"
//                       required
//                       height="50px"
//                     />
//                     <MultiSelectChip
//                       label="Ticket Tags"
//                       items={tags}
//                       labelKey="tagName"
//                       valueKey="tagID"
//                       value={selectedTags}
//                       onChange={setSelectedTags}
//                       width="100%"
                      
//                     />
//                   </div>

//                   <TextAreaComponent label="Enter Description Here" placeholder="Description" />

//                   <MydropZone className='p-16 mt-10 border' />

//                 </div>
//               </section>

//               <div className="p-6">
//                 <button
//                   type="submit"
//                   className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
//                 >
//                   {defaultValues ? "Update Ticket" : "Create Ticket"}
//                 </button>
//               </div>

//             </div>
//           </form>
//         </FormProvider>
//       </div>
//     </Layout>
//   );
// };

// export default CreateTicketForm;

// import React from "react";
// import { useForm, FormProvider } from "react-hook-form";
// import Layout from "../layout/Layout";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import FormHeader from "./Header";
// import MydropZone from "../File Upload/fileupload";
// import TextAreaComponent from "../Fields/TextAreaComponent";
// import MultiSelectChip from "../Fields/MultipleSelect";
// import SelectSearch from "../Fields/SelectSearch";

// interface TicketFormProps {
//   onSubmit: (data: any) => void;
//   defaultValues?: {
//     title?: string;
//     description?: string;
//     statusId?: number;
//     priorityId?: number;
//     assignedTo?: string;
//     roleId?: number;
//     tagIds?: number[];
//   };
// }

// const CreateTicketForm = ({ onSubmit, defaultValues }: TicketFormProps) => {
//   const methods = useForm({
//     defaultValues: defaultValues || {
//       title: "",
//       description: "",
//       statusId: "",
//       priorityId: "",
//       assignedTo: "",
//       roleId: "",
//       tagIds: [],
//     }
//   });

//   const { register, handleSubmit, formState: { errors } } = methods;

//   const tags = [
//     { tagID: 1, tagName: "Ok" },
//     { tagID: 4, tagName: "react" },
//   ];

//   const StatusOptions = [
//     { label: "Open", value: 1 },
//     { label: "In Progress", value: 2 },
//     { label: "Closed", value: 3 },
//   ];

//   return (
//     <Layout>
//       <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
//         <FormProvider {...methods}>
//           <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
//             <div className="rounded-lg shadow-sm">

//               <section className="border-b border-gray-200">
//                 <FormHeader title={defaultValues ? "Edit Ticket" : "Create Ticket"} />

//                 <div className="p-6 space-y-4">

//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Title"
//                       name="title"
//                       register={register}
//                       errors={errors}
//                       required
//                       placeholder="Enter ticket title"
//                       height="50px"
//                     />

//                     <SelectSearch
//                       label="Status"
//                       name="statusId"
//                       options={StatusOptions}
//                       required
//                       errors={errors}
//                       placeholder="Select Status"
//                       height="50px"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Priority ID"
//                       name="priorityId"
//                       type="number"
//                       register={register}
//                       errors={errors}
//                       required
//                       placeholder="Select priority"
//                       height="50px"
//                     />

//                     <TextFieldComponent
//                       label="Assigned To"
//                       name="assignedTo"
//                       register={register}
//                       errors={errors}
//                       required
//                       placeholder="Username / User ID"
//                       height="50px"
//                     />
//                   </div>

//                   <div className="grid grid-cols-2 gap-2">
//                     <TextFieldComponent
//                       label="Role ID"
//                       name="roleId"
//                       type="number"
//                       register={register}
//                       errors={errors}
//                       required
//                       placeholder="Enter role ID"
//                       height="50px"
//                     />

//                     <MultiSelectChip
//                       label="Ticket Tags"
//                       name="tagIds"
//                       items={tags}
//                       labelKey="tagName"
//                       valueKey="tagID"
//                       required
//                     />
//                   </div>

//                   <TextAreaComponent
//                     label="Enter Description Here"
//                     name="description"
//                     placeholder="Description"
//                   />

//                   <MydropZone className="p-16 mt-10 border" />

//                 </div>
//               </section>

//               <div className="p-6">
//                 <button
//                   type="submit"
//                   className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
//                 >
//                   {defaultValues ? "Update Ticket" : "Create Ticket"}
//                 </button>
//               </div>

//             </div>
//           </form>
//         </FormProvider>
//       </div>
//     </Layout>
//   );
// };

// export default CreateTicketForm;


import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Layout from "../layout/Layout";
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

  if (loading) return <Layout><div className="flex items-center justify-center min-h-screen">Loading options...</div></Layout>;
  if (apiError) return <Layout><div className="flex items-center justify-center min-h-screen text-red-600">{apiError}</div></Layout>;

  return (
    <Layout>
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
                  <MydropZone
                    onFilesChange={(files: File[]) => setValue("files", files)}
                    className="p-16 mt-4 border"
                  />

                </div>
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
    </Layout>
  );
};

export default CreateTicket;
