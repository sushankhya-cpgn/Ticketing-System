import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import AssignTasks from "../components/Tasks/AssignTasks";
import { useParams } from "react-router-dom";


export default function RoleTaskPage() {
    // const [assignTask, setAssignTask] = useState<RoleRecord | null>(null);
    const [availableTasks, setAvailableTasks] = useState([
        { id: "1", name: "Create User" },
        { id: "2", name: "Manage Projects" },
        { id: "3", name: "View Reports" },
    ]);

    const [assignedTasks, setAssignedTasks] = useState([
        { id: "4", name: "Edit Profile" },
    ]);

    const {roleid} = useParams();

    useEffect(()=>{
        
    },[])
    return (
        <Layout>
            <div>hii</div>
            <AssignTasks
                availableTasks={availableTasks}
                assignedTasks={assignedTasks}
                setAvailableTasks={setAvailableTasks}
                setAssignedTasks={setAssignedTasks}
             
            />
        </Layout>
    );
}
