import { toast } from "react-toastify";
import CreateTicketForm from "../../components/Forms/CreateTicketForm";
import api from "../../src/api/axiosClient";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


export default function CreateTicketPage() {
  const navigate = useNavigate();
  async function handleCreateTicket(formData: FormData) {
    try {
      console.log("Form Data Submitted:", formData);
      const formwithcreatedBy = {...formData, createdBy: userInfo ? JSON.parse(userInfo).userID : null};
      const response = await api.post('/Ticket/Create', formwithcreatedBy, {
        headers: {
          "Authorization": `Bearer ${access_token}`,
          "Content-Type": "application/json"
        }
      });
      toast.success('Ticket created successfully');
      console.log('Ticket created successfully:', response.data);
      navigate("/");
      
    } catch (error: any) {
      toast.error('Failed to create ticket');
      console.error('Error creating ticket:', error);
    }
  }

  // const { access_token,userID } = useSelector((state: RootState) => state.auth)
      const access_token = Cookies.get("accessToken");
      const userInfo = Cookies.get("userInfo");
  return (
    <CreateTicketForm onSubmit={handleCreateTicket} />
  )
}
