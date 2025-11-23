import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddStatusorm from "../../components/Forms/StatusForm"
import { TicketStatusApi } from "../../src/api/ticketstatusApi";

export default function AddStatus(){
    const navigate = useNavigate();

    const handleCreateStatus = async(data:any)=>{
        try{
            const res = await TicketStatusApi.createStatus(data);
            console.log(res);
            toast.success("Status Created Successfully");
            navigate("/ticket/status");
        }
        catch(err:any){
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to Create Status"
            toast.error(String(errorMessage));
        }
    }


    return <AddStatusorm onSubmit={handleCreateStatus} />
}
