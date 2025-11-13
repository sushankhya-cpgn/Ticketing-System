import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import api from "../../src/api/axiosClient";
import type { RootState } from "../../app/store";
import AddTagForm from "../../components/Forms/TagForm";

export default function EditTagPage() {
    const { tagid } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    const {access_token} = useSelector((state:RootState)=>state.auth)



    useEffect(() => {
        const fetchTag = async () => {
            try {
                const res = await api.get(`/Tags/GetById/${tagid}`,
                    {
                        headers:{
                            Authorization: `Bearer ${access_token}`
                        }
                    }
                );
                console.log('hi',res.data.data);
                setDefaultValues(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch task data");
            }
        };
        fetchTag();
    }, [tagid,access_token]);

    const handleEdit = async (data: any) => {
        try {
            await api.put('/Tags', data,
                {
                    params:{id:tagid},
                    headers: { 
                       Authorization:`Bearer ${access_token} `
                    },
                },
                
            );
            toast.success("Tag updated successfully");
            navigate("/ticket/tag");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update tag");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;
   

    return <AddTagForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
