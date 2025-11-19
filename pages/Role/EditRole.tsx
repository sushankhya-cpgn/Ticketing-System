import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import CreateRoleForm from "../../components/Forms/RoleForm";
import Cookies from "js-cookie";
import { RoleApi } from "../../src/api/roleApi";


export default function EditRolePage() {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    const access_token = Cookies.get("accessToken");


    useEffect(() => {
        const fetchRole = async () => {
            try {
                // const res = await api.get(`/Role/GetRoleById`, {
                //     params: { id: roleId },
                //     headers: {
                //         Authorization: `Bearer ${access_token}`
                //     }
                // });
                const res = await RoleApi.getById(roleId!);
                console.log(res.data.data);
                setDefaultValues(res.data.data)

            }
            catch (error) {
                console.error(error);
                toast.error("Failed to fetch role");
            }
        }
        fetchRole();
    }, [roleId,access_token])

    const handleRoleEdit = async (formData: any) => {
        try {
             await api.post(
            `/Role/UpdateRole`,
            { 
                roleName: formData.roleName,
                roleKey: formData.roleKey,
                color: formData.color,
                roleStatus: formData.roleStatus
            },
            {
                params: {
                    // Add your query parameters here, if any
                    id: roleId, // Example query parameter
                },
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            }
        );

            toast.success("Role updated successfully");
            navigate("/role");
        } catch (error) {
            console.error(error);
            toast.error("Unable to update role");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;
    return (
        <CreateRoleForm onSubmit={handleRoleEdit} defaultValues={defaultValues} submitLabel="Update Role" />
    )

}