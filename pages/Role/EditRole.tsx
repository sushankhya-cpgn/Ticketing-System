import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import api from "../../src/api/axiosClient";
import CreateRoleForm from "../../components/Forms/RoleForm";


export default function EditRolePage() {
    const { roleId } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    const { access_token } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const res = await api.get(`/Role/GetRoleById`, {
                    params: { id: roleId },
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                });
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