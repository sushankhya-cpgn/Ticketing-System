import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatusForm from "../../components/Forms/StatusForm";
import Cookies from "js-cookie";
import { TicketStatusApi } from "../../src/api/ticketstatusApi";

export default function EditStatusPage() {
  const { sid } = useParams(); // expects route like /ticket/status/editstatus/:sid
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState<any>(null);
  // const { access_token } = useSelector((state: RootState) => state.auth);
  const access_token = Cookies.get("accessToken");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // const res = await api.get(`/TicketStatus/GetById`, {
        //   headers: {
        //     Authorization: `Bearer ${access_token}`,
        //   },
        //   params: { id: sid },
        // });
        const res = await TicketStatusApi.getStatusById(sid)
        console.log("Fetched status:", res.data.data);
        setDefaultValues(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch status data");
      }
    };
    fetchStatus();
  }, [sid, access_token]);

  const handleEdit = async (data: any) => {
    try {
      // await api.put("/TicketStatus/Update", data, {
      //   params: { id: sid },
      //   headers: {
      //     Authorization: `Bearer ${access_token}`,
      //   },
      // });

      await TicketStatusApi.updateStatus(sid,data);

      toast.success("Status updated successfully");
      navigate("/ticket/status");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  if (!defaultValues) return <div>Loading...</div>;

  return <StatusForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
