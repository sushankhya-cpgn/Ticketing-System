import { useForm, FormProvider } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";

interface TagFormData {
  tagName: string;
}

interface TagFormProps {
  onSubmit: (data: TagFormData) => void;
  defaultValues?: TagFormData;
}

const AddTagForm = ({ onSubmit, defaultValues }: TagFormProps) => {
  const methods = useForm<TagFormData>({
    defaultValues: defaultValues || {
      tagName: "",
    },
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="rounded-lg shadow-sm">

              <section className="border-b border-gray-200">
                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                  Tag Details
                </header>

                <div className="p-6 space-y-4">
                  <div className="flex gap-2">
                    <TextFieldComponent
                      label="Tag Name"
                      name="tagName"
                      register={register}
                      errors={errors}
                      placeholder="Enter Tag Name"
                      required
                      height="50px"
                    />
                  </div>
                </div>
              </section>

              <div className="p-6">
                <button
                  type="submit"
                  className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  {defaultValues ? "Update Tag" : "Add Tag"}
                </button>
              </div>

            </div>
          </form>
        </FormProvider>
      </div>
  );
};

export default AddTagForm;
