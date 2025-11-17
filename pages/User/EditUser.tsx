import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../src/api/axiosClient";
import UserForm from "../../components/Forms/UserForm";
import Cookies from "js-cookie";

export default function EditUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);
    // const {access_token} = useSelector((state:RootState)=>state.auth)
    const access_token = Cookies.get("accessToken");


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/User/GetUserById`,{
                    params:{userId:id},
                    headers:{
                        Authorization: `Bearer ${access_token}`
                    }
                });
                console.log(res.data);
                setDefaultValues(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch user data");
            }
        };
        fetchUser();
    }, [id,access_token]);

    const handleEdit = async (data: any) => {
        try {
            await api.put(`/User/updateUser`, data,
                {
                    params: { // This is where you define your query parameters
                        id:id
                    },
                    headers:{
                        Authorization:`Bearer ${access_token}`
                    }
                }
            );
            toast.success("User updated successfully");
            navigate("/customers");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update user");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;

    return <UserForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
