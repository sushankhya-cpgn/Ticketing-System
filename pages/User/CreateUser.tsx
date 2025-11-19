import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import UserForm from "../../components/Forms/UserForm";
import { UserApi } from "../../src/api/userApi";

export default function CreateUserPage() {
    const navigate = useNavigate();
    //   const { access_token } = useSelector((state: RootState) => state.auth);


    const handleCreate = async (data: any) => {
        try {
          
            const res = await UserApi.createUser(data);
            console.log(res);
            // await axios.post("http://192.168.1.25:5056/api/User/CreateUser", data);
            toast.success("User created successfully");
            navigate("/customers");
        } catch (err:any) {
            console.error(err);
            const errorMessage = err.response?.data?.message || "Failed to Create User"
            toast.error(String(errorMessage));
        }
    };

    return <UserForm onSubmit={handleCreate} />;
}
