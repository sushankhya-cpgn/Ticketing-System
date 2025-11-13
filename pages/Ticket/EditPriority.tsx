import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import api from "../../src/api/axiosClient";
import type { RootState } from "../../app/store";
import PriorityForm from "../../components/Forms/PriorityForm";

export default function EditPriorityPage() {
    const { pid } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    const {access_token} = useSelector((state:RootState)=>state.auth)



    useEffect(() => {
        const fetchPriority = async () => {
            try {
                const res = await api.get(`/TicketPriority/GetById/${pid}`,
                    {
                        headers:{
                            Authorization: `Bearer ${access_token}`
                        },
                    }
                );
                console.log('hi',res.data.data);
                setDefaultValues(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch task data");
            }
        };
        fetchPriority();
    }, [pid,access_token]);

    const handleEdit = async (data: any) => {
        try {
            await api.put('/TicketPriority/UpdateTicketPriority', data,
                {
                    params:{id:pid},
                    headers: { 
                       Authorization:`Bearer ${access_token} `
                    },
                },
                
            );
            toast.success("Priority updated successfully");
            navigate("/ticket/priority");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update priority");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;
   

    return <PriorityForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
