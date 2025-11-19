import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddTagForm from "../../components/Forms/TagForm";
import { TagApi } from "../../src/api/tagApi";

export default function AddTag() {
    const navigate = useNavigate();

    const handleCreateTag = async (data: any) => {
        try {
            await TagApi.createTag(data);
            toast.success("Tag Created Successfully");
            navigate("/ticket/tag");
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to Create Tag";
            toast.error(msg);
        }
    };

    return <AddTagForm onSubmit={handleCreateTag} />;
}
