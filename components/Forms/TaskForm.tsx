
import { useForm, FormProvider } from "react-hook-form";
import Layout from "../layout/Layout";
import TextFieldComponent from "../Fields/TextFieldComponent";
import FormHeader from "./Header";


interface TaskFormProps {
    onSubmit: (data: any) => void;
    defaultValues?: {
        taskID?: number;
        taskName?: string;
        taskKey?: string;
        taskStatus?: boolean;
        taskDetail?: string;
        taskURL?: string;
    };
}

const AddTaskForm = ({ onSubmit, defaultValues }:TaskFormProps) => {
    const methods = useForm({
        defaultValues: defaultValues || {
            taskName: "",
            taskKey: "",
            taskStatus: true,
            taskDetail: "",
            taskURL: ""
        }
    });

    const { register, handleSubmit, formState: { errors } } = methods;


    return (
        <Layout>
            <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="rounded-lg shadow-sm">

                            <section className="border-b border-gray-200">
                                
                        <FormHeader title={"Task Details" } />
                                

                                <div className="p-6 space-y-4">
                                    <div className="flex gap-2">
                                        <TextFieldComponent
                                            label="Task Name"
                                            name="taskName"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Task Name"
                                            required
                                            height="50px"
                                        />

                                        <TextFieldComponent
                                            label="Task Key"
                                            name="taskKey"
                                            type="number"
                                            register={register}
                                            errors={errors}
                                            placeholder="Enter Task Key"
                                            required
                                            height="50px"
                                        />
                                    </div>


                                    <div className="flex gap-2">

                                        <TextFieldComponent
                                            label="Task URL"
                                            name="taskURL"
                                            register={register}
                                            errors={errors}
                                            placeholder="/roles/manage"
                                            required
                                            height="50px"
                                        />

                                        <TextFieldComponent
                                            label="Task Detail"
                                            name="taskDetail"
                                            register={register}
                                            errors={errors}
                                            placeholder="Describe the task"
                                            required
                                            height="50px"
                                        />
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register("taskStatus")}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Task Active</span>
                                    </label>
                                </div>
                            </section>

                            <div className="p-6">
                                <button
                                    type="submit"
                                    className="bg-gray-700 text-white px-6 py-2.5 rounded hover:bg-gray-800 transition-colors font-medium text-sm"
                                >
                                   { defaultValues?"Update Task":"Add Task"}
                                </button>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Layout>
    );
};

export default AddTaskForm;
