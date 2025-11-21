import CreateRoleForm from "../components/Forms/RoleForm"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { RoleApi } from "../src/api/roleApi";

export default function CreateRole() {
    const access_token = Cookies.get("accessToken");
    const navigate = useNavigate();
    console.log(access_token);

    const submitRole = async (data: any) => {
        try {
            // await api.post(
            //     "/Role/CreateRole",
            //     data,  
            //     {
            //         headers: {
            //             Authorization: `Bearer ${access_token}`
            //         }
            //     } 
            // );
            await RoleApi.create(data);
            toast.success("Role Created Successfully");
            navigate("/role");
        }
        catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Failed to Create Role"
            toast.error(String(errorMessage));
        }
    }

    return (
        <CreateRoleForm onSubmit={submitRole} />
    );
}