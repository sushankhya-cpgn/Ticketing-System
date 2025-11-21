import { toast } from "react-toastify";
import CreateTicketForm from "../../components/Forms/CreateTicketForm";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../src/api/axiosClient";

export default function CreateTicketPage() {
  const navigate = useNavigate();

  const access_token = Cookies.get("accessToken");
  const userInfo = Cookies.get("userInfo");

  async function handleCreateTicket(data: any) {
    try {
      const createdBy = userInfo ? JSON.parse(userInfo).userID : null;

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("statusID", String(data.statusID));
      formData.append("priorityID", String(data.priorityID));
      formData.append("assignedTo", String(data.assignedTo));
      formData.append("roleID", String(data.roleID));
      formData.append("description", data.description);
      formData.append("createdBy", createdBy);

      // Append tagIDs
      if (Array.isArray(data.tagIDs)) {
        data.tagIDs.forEach((tag: number) => {
          formData.append("tagIDs", String(tag));
        });
      }

      // Append files
      if (data.files && data.files.length > 0) {
        data.files.forEach((file: File) => {
          formData.append("files", file);
         
        });
      }

       await api.post("/Ticket/Create", formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Ticket created successfully");
      
      navigate("/ticket");
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast.error("Failed to create ticket");
    }
  }

  return <CreateTicketForm onSubmit={handleCreateTicket} />;
}
