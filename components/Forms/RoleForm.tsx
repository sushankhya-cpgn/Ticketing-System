import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import Layout from "../layout/Layout";
import TextFieldComponent from "../Fields/TextFieldComponent";
import SelectSearch from "../Fields/SelectSearch";
import FormHeader from "./Header";

interface RoleFormData {
    roleName: string;
    roleKey: string;
    color: string;
    roleStatus: boolean;
}

interface CreateRoleFormProps {
    defaultValues?: RoleFormData;   // Used in Edit Role
    onSubmit: (data: RoleFormData) => void;
    submitLabel?: string;
}



const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
    defaultValues,
    onSubmit,
    submitLabel = "Create Role",
}) => {

  

    const methods = useForm<RoleFormData>({
        defaultValues: defaultValues || {
            roleName: "",
            roleKey: "",
            color: "#000000",
            roleStatus: true,
        },
    });

    const { register, handleSubmit, formState: { errors } } = methods;
    const isEditMode = Boolean(defaultValues);
   

    // Status Options
    const statusOptions = [
        { label: "Active", value: true },
        { label: "Inactive", value: false }
    ];

    return (
        <Layout>
            <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="rounded-lg shadow-sm">

                            {/* Title */}
                           
                            <FormHeader title={isEditMode? "Update Role":"Create Role"} />

                            <div className="p-6 space-y-4">
                                <div className="flex  gap-3">
                                    <TextFieldComponent
                                        label="Role Name"
                                        name="roleName"
                                        register={register}
                                        errors={errors}
                                        placeholder="Enter Role Name"
                                        required
                                        height="50px"
                                    />

                                    <TextFieldComponent
                                        label="Role Key"
                                        name="roleKey"
                                        register={register}
                                        errors={errors}
                                        placeholder="Enter Role Key (ex: SA = Super Admin)"
                                        required
                                        validation={{
                                            minLength: { value: 2, message: "Role key must be at least 2 characters" }
                                        }}
                                        height="50px"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    {/* Color Picker */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">Select Color</label>
                                        <input
                                            type="color"
                                            {...register("color", { required: "Color is required" })}
                                            className="w-16 h-10 border rounded cursor-pointer"
                                        />
                                        {errors.color && (
                                            <p className="text-red-500 text-xs mt-1">{errors.color.message}</p>
                                        )}
                                    </div>

                                    {/* Status Dropdown */}
                                    <SelectSearch
                                        label="Role Status"
                                        name="roleStatus"
                                        options={statusOptions}
                                        required
                                        errors={errors}
                                        placeholder="Select Status"
                                        height="50px"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="px-6 py-4">
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
        </Layout>
    );
};

export default CreateRoleForm;
