import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import api from "../../src/api/axiosClient";
import AddTaskForm from "../../components/Forms/TaskForm";
import type { RootState } from "../../app/store";

export default function EditTaskPage() {
    const { taskid } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    const {access_token} = useSelector((state:RootState)=>state.auth)



    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await api.get(`/Task/GetById/${taskid}`);
                console.log('hi',res.data.data);
                setDefaultValues(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch task data");
            }
        };
        fetchTask();
    }, [taskid]);

    const handleEdit = async (data: any) => {
        try {
            await api.post(`/Task/Update/${taskid}`, data,
                {
                    headers: { 
                       Authorization:`Bearer ${access_token} `
                    },
                }
            );
            toast.success("Task updated successfully");
            navigate("/task");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update task");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;
   

    return <AddTaskForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
