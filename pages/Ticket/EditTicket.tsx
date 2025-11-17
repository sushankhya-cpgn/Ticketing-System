import  { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import CreateTicketForm from "../../components/Forms/CreateTicketForm";
import Cookies from "js-cookie";

export default function EditTicketPage() {
    const { ticketid } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
  
    const access_token = Cookies.get("accessToken");


    useEffect(() => {
        const fetchTicketInfo = async () => {
            try {
                console.log('Ticket id is',ticketid)
                const res = await api.get(`/Ticket/GetById/${ticketid}`,
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
        fetchTicketInfo();
    }, [ticketid,access_token]);

    const handleEdit = async (data: any) => {
        try {
            await api.put(`/Ticket/Update/${ticketid}`, data,
                {
                    params:{id:ticketid},
                    headers: { 
                       Authorization:`Bearer ${access_token} `
                    },
                },
                
            );
            toast.success("Ticket updated successfully");
            navigate("/ticket");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update ticket");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;
   

    return <CreateTicketForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
