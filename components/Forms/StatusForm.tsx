import { useForm, FormProvider } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";

interface StatusFormData {
  statusName: string;
}

interface StatusFormProps {
  onSubmit: (data: StatusFormData) => void;
  defaultValues?: StatusFormData;
}

const StatusForm = ({ onSubmit, defaultValues }: StatusFormProps) => {
  const methods = useForm<StatusFormData>({
    defaultValues: defaultValues || {
      statusName: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="rounded-lg shadow-sm">
              {/* Header */}
              <section className="border-b border-gray-200">
                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                  Status Details
                </header>

                {/* Fields */}
                <div className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <TextFieldComponent
                      label="Status Name"
                      name="statusName"
                      register={register}
                      errors={errors}
                      placeholder="Enter Status Name"
                      required
                      height="50px"
                    />
                  </div>
                </div>
              </section>

              {/* Submit */}
              <div className="p-6">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  {defaultValues ? "Update Status" : "Add Status"}
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
  );
};

export default StatusForm;
