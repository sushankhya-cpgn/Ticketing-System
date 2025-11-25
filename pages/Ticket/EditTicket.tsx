// import  { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import CreateTicketForm from "../../components/Forms/CreateTicketForm";
// import Cookies from "js-cookie";
// import { TicketApi } from "../../src/api/ticketApi";

// export default function EditTicketPage() {
//     const { ticketid } = useParams();
//     const navigate = useNavigate();
//     const [defaultValues, setDefaultValues] = useState<any>(null);
  
//     const access_token = Cookies.get("accessToken");


//     useEffect(() => {
//         const fetchTicketInfo = async () => {
//             try {
//                 console.log('Ticket id is',ticketid)
//                 const res = await TicketApi.getTicketById(ticketid)
//                 console.log('hi',res.data.data);
//                 setDefaultValues(res.data.data);
//             } catch (err) {
//                 console.error(err);
//                 toast.error("Failed to fetch task data");
//             }
//         };
//         fetchTicketInfo();
//     }, [ticketid,access_token]);

//     const handleEdit = async (data: any) => {
//         try {
//             await TicketApi.updateTicket(ticketid,data)
//             toast.success("Ticket updated successfully");
//             navigate("/ticket");
//         } catch (err) {
//             console.error(err);
//             toast.error("Failed to update ticket");
//         }
//     };

//     if (!defaultValues) return <div>Loading...</div>;
   

//     return <CreateTicketForm defaultValues={defaultValues} onSubmit={handleEdit} />;
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateTicketForm from "../../components/Forms/CreateTicketForm";
import Cookies from "js-cookie";
import api from "../../src/api/axiosClient";        // keep using your existing axios instance
import { TicketApi } from "../../src/api/ticketApi";
// import { TicketApi } from "../../src/api/ticketApi";

export default function EditTicketPage() {
  const { ticketid } = useParams<{ ticketid: string }>();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<any>(null);

  const access_token = Cookies.get("accessToken");

  // ------------------------------------------------------------------
  // 1. Fetch current ticket data (for defaultValues in the form)
  // ------------------------------------------------------------------
  useEffect(() => {
    const fetchTicketInfo = async () => {
      try {
        // You can keep using TicketApi.getTicketById if you prefer,
        // or directly use the axios instance like below:
        const res = await TicketApi.getTicketById(ticketid)
        // Adjust the path according to your actual API response structure
        setDefaultValues(res.data.data || res.data);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch ticket data");
      }
    };

  
      fetchTicketInfo();

  }, [ticketid, access_token]);

  // ------------------------------------------------------------------
  // 2. Handle form submission – identical logic to CreateTicketPage
  // ------------------------------------------------------------------
  const handleEdit = async (data: any) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("statusID", String(data.statusID));
      formData.append("priorityID", String(data.priorityID));
      formData.append("assignedTo", String(data.assignedTo));
      formData.append("roleID", String(data.roleID));

      // Tag IDs (multi-select)
      if (Array.isArray(data.tagIDs)) {
        data.tagIDs.forEach((tag: number) => {
          formData.append("tagIDs", String(tag));
        });
      } else if (data.tagIDs) {
        // in case a single value is passed
        formData.append("tagIDs", String(data.tagIDs));
      }

      // Files – new + unchanged files (the form should send File objects)
      if (data.files && data.files.length > 0) {
        data.files.forEach((file: File) => {
          formData.append("files", file);
        });
      }

      // ----------------------------------------------------------------
      // PUT request – ticketid in the URL, FormData in the body
      // ----------------------------------------------------------------
      await api.put(`/Ticket/Update/${ticketid}`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        "Content-Type": "multipart/form-data",
          // Let axios set Content-Type to multipart/form-data with boundary
          // "Content-Type": "multipart/form-data",   // <-- not needed when using FormData
        },
      });

      toast.success("Ticket updated successfully");
      navigate("/ticket");
    } catch (error: any) {
      console.error("Error updating ticket:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to update ticket"
      );
    }
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  if (!defaultValues) return <div>Loading...</div>;

  return (
    <CreateTicketForm
      defaultValues={defaultValues}
      onSubmit={handleEdit}
    />
  );
}