import { useForm, FormProvider } from "react-hook-form";
import Layout from "../layout/Layout";
import TextFieldComponent from "../Fields/TextFieldComponent";
import FormHeader from "./Header";
import MydropZone from "../File Upload/fileupload";
import TextAreaComponent from "../Fields/TextAreaComponent";

interface TicketFormProps {
  onSubmit: (data: any) => void;
  defaultValues?: {
    // ticketID?: number;
    title?: string;
    description?: string;
    statusId?: number;
    priorityId?: number;
    assignedTo?: string;
    roleId?: number;
    attachments?: FileList;
  };
}

const CreateTicketForm = ({ onSubmit, defaultValues }: TicketFormProps) => {
  const methods = useForm({
    defaultValues: defaultValues || {
      title: "",
      description: "",
      statusId: "",
      priorityId: "",
      assignedTo: "",
      roleId: "",
      attachments: undefined
    }
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  return (
    <Layout>
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6" encType="multipart/form-data">
            <div className="rounded-lg shadow-sm">

              <section className="border-b border-gray-200">
                <FormHeader title={ defaultValues ? "Edit Ticket" : "Create Ticket"} />

                <div className="p-6 space-y-4">

                  {/* Title + Status */}
                  <div className="flex gap-2">
                    <TextFieldComponent
                      label="Title"
                      name="title"
                      register={register}
                      errors={errors}
                      placeholder="Enter ticket title"
                      required
                      height="50px"
                    />

                    <TextFieldComponent
                      label="Status ID"
                      name="statusId"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Select status"
                      required
                      height="50px"
                    />
                  </div>

                  {/* Priority + AssignedTo */}
                  <div className="flex gap-2">
                    <TextFieldComponent
                      label="Priority ID"
                      name="priorityId"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Select priority"
                      required
                      height="50px"
                    />

                    <TextFieldComponent
                      label="Assigned To"
                      name="assignedTo"
                      register={register}
                      errors={errors}
                      placeholder="Username / User ID"
                      required
                      height="50px"
                    />
                  </div>

                  {/* Role */}
                  <div className="flex gap-2">
                    <TextFieldComponent
                      label="Role ID"
                      name="roleId"
                      type="number"
                      register={register}
                      errors={errors}
                      placeholder="Enter role ID"
                      required
                      height="50px"
                    />
                  </div>

                 <TextAreaComponent label="Enter Description Here" placeholder="Description"/>

                  <MydropZone className='p-16 mt-10 border' />

                </div>
              </section>

              <div className="p-6">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  { defaultValues ? "Update Ticket" : "Create Ticket" }
                </button>
              </div>

            </div>
          </form>
        </FormProvider>
      </div>
    </Layout>
  );
};

export default CreateTicketForm;
