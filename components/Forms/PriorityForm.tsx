import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import TextFieldComponent from "../Fields/TextFieldComponent";

interface PriorityFormData {
    priorityName: string;
    isActive: boolean;
}

interface PriorityFormProps {
    defaultValues?: PriorityFormData;
    onSubmit: (data: PriorityFormData) => void;
    submitLabel?: string;
}

const CreatePriorityForm: React.FC<PriorityFormProps> = ({
    defaultValues,
    onSubmit,
    submitLabel = "Create Priority",
}) => {

    const methods = useForm<PriorityFormData>({
        defaultValues: defaultValues || {
            priorityName: "",
            isActive: true,   // ✅ default Active
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;
    const isEditMode = Boolean(defaultValues);

    return (
            <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="rounded-lg shadow-sm">

                            <section className="border-b border-gray-200">
                                <header className="bg-gray-700 text-white px-4 py-2.5 font-medium text-sm">
                                    {isEditMode ? "Edit Priority" : "Create Priority"}
                                </header>

                                <div className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <TextFieldComponent
                                            label="Priority Name"
                                            name="priorityName"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Priority Name"
                                            required
                                            height="50px"
                                        />
                                    </div>

                                    {/* ✅ isActive checkbox */}
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            {...register("isActive")}
                                            className="h-4 w-4"
                                        />
                                        <label className="text-sm font-medium">Active</label>
                                    </div>
                                </div>
                            </section>

                            <div className="p-6">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                                >
                                    {submitLabel}
                                </button>
                            </div>

                        </div>
                    </form>
                </FormProvider>
            </div>
    )
}

export default CreatePriorityForm;
