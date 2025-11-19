import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddTagForm from "../../components/Forms/TagForm";
import { TagApi } from "../../src/api/tagApi";

export default function EditTagPage() {
    const { tagid } = useParams();
    const navigate = useNavigate();
    const [defaultValues, setDefaultValues] = useState<any>(null);

    useEffect(() => {
        const fetchTag = async () => {
            try {
                const res = await TagApi.getTagById(tagid!);
                setDefaultValues(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to fetch tag data");
            }
        };

        fetchTag();
    }, [tagid]);

    const handleEdit = async (data: any) => {
        try {
            await TagApi.updateTag(tagid!, data);
            toast.success("Tag updated successfully");
            navigate("/ticket/tag");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update tag");
        }
    };

    if (!defaultValues) return <div>Loading...</div>;

    return <AddTagForm defaultValues={defaultValues} onSubmit={handleEdit} />;
}
