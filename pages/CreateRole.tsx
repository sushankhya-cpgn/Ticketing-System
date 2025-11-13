import CreateRoleForm from "../components/Forms/RoleForm"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";
import api from "../src/api/axiosClient";

export default function CreateRole() {
    const { access_token } = useSelector(
        (state: RootState) => state.auth
    );
    const navigate = useNavigate();
    console.log(access_token);

    const submitRole = async (data: any) => {
        try {
            await api.post(
                "/Role/CreateRole",
                data,  
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                } 
            );
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