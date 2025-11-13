import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TaskForm from "../../components/Forms/TaskForm"
import api from "../../src/api/axiosClient";

export default function CreateTaskPage(){
    const navigate = useNavigate();

    const handleCreateTask = async(data:any)=>{
        try{
            const res = await api.post("/Task/Create",data);
            console.log(res);
            toast.success("Task Created Successfully");
            navigate("/task");
        }
        catch(err:any){
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to Create Task"
            toast.error(String(errorMessage));
        }
    }


    return <TaskForm onSubmit={handleCreateTask} />
}