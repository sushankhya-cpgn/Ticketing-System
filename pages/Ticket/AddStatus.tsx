import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import { useSelector } from "react-redux";
import AddStatusorm from "../../components/Forms/StatusForm"
import type { RootState } from "../../app/store";

export default function AddStatus(){
    const navigate = useNavigate();
    const { access_token } = useSelector((state: RootState) => state.auth)

    const handleCreateStatus = async(data:any)=>{
        try{
            const res = await api.post("/TicketStatus/Create",data,{
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            });
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
