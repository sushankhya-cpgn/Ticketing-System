import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import AddTagForm from "../../components/Forms/TagForm"
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function AddTag(){
    const navigate = useNavigate();
    const { access_token } = useSelector((state: RootState) => state.auth)

    const handleCreateTag = async(data:any)=>{
        try{
            const res = await api.post("/Tags/CreateTags",data,{
                headers:{
                    Authorization:`Bearer ${access_token}`
                }
            });
            console.log(res);
            toast.success("Tag Created Successfully");
            navigate("/ticket/tag");
        }
        catch(err:any){
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to Create Tag"
            toast.error(String(errorMessage));
        }
    }


    return <AddTagForm onSubmit={handleCreateTag} />
}
