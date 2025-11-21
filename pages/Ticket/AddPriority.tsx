import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddPriorityForm from "../../components/Forms/PriorityForm"
import { TicketPriorityApi } from "../../src/api/ticketpriorityApi";


export default function AddPriority(){
    const navigate = useNavigate();


    const handleCreatePriority = async(data:any)=>{
        try{
            console.log(data);
            const res = await TicketPriorityApi.createTicketPriority(data);
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
