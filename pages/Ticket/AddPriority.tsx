import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import AddPriorityForm from "../../components/Forms/PriorityForm"
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function AddPriority(){
    const navigate = useNavigate();
    const { access_token } = useSelector((state: RootState) => state.auth)

    const handleCreatePriority = async(data:any)=>{
        try{
            const res = await api.post("/TicketPriority/CreateTicketPriority",data,{
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            });
            console.log(res);
            toast.success("Priority Created Successfully");
            navigate("/ticket/priority");
        }
        catch(err:any){
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to Create Priority"
            toast.error(String(errorMessage));
        }
    }


    return <AddPriorityForm onSubmit={handleCreatePriority} />
}
