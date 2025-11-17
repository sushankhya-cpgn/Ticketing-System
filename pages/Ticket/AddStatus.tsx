import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import AddStatusorm from "../../components/Forms/StatusForm"
import Cookies from "js-cookie";

export default function AddStatus(){
    const navigate = useNavigate();
    const access_token = Cookies.get("accessToken");

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
