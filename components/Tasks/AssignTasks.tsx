// import React, { useState } from "react";
// import TextFieldComponent from "../Fields/TextFieldComponent";
// import ButtonComponent from "../Buttons/button";

// interface Task {
//   id: string;
//   name: string;
// }

// interface AssignTasksProps {
//   availableTasks: Task[];
//   assignedTasks: Task[];
//   setAvailableTasks: (tasks: Task[]) => void;
//   setAssignedTasks: (tasks: Task[]) => void;
//   onSave?: (assigned: Task[]) => void;
// }

// export default function AssignTasks({
//   availableTasks,
//   assignedTasks,
//   setAvailableTasks,
//   setAssignedTasks,
//   onSave,
// }: AssignTasksProps) {
//   const [availableSearch, setAvailableSearch] = useState("");
//   const [assignedSearch, setAssignedSearch] = useState("");
//   const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
//   const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

//   // Filter tasks by search
//   const filteredAvailable = availableTasks.filter((t) =>
//     t.name.toLowerCase().includes(availableSearch.toLowerCase())
//   );

//   const filteredAssigned = assignedTasks.filter((t) =>
//     t.name.toLowerCase().includes(assignedSearch.toLowerCase())
//   );

//   // Toggle selection
//   const toggleSelect = (id: string, selectedList: string[], setFn: any) => {
//     if (selectedList.includes(id)) {
//       setFn(selectedList.filter((x) => x !== id)); // remove if selected
//     } else {
//       setFn([...selectedList, id]); // add if not selected
//     }
//   };

//   // Move selected tasks to Assigned
//   const moveToAssigned = () => {
//     if (selectedAvailable.length === 0) return;

//     const tasksToMove = availableTasks.filter((t) =>
//       selectedAvailable.includes(t.id)
//     );

//     setAvailableTasks(availableTasks.filter((t) => !selectedAvailable.includes(t.id)));
//     setAssignedTasks([...assignedTasks, ...tasksToMove]);
//     setSelectedAvailable([]);
//   };

//   // Move selected tasks to Available
//   const moveToAvailable = () => {
//     if (selectedAssigned.length === 0) return;

//     const tasksToMove = assignedTasks.filter((t) =>
//       selectedAssigned.includes(t.id)
//     );

//     setAssignedTasks(assignedTasks.filter((t) => !selectedAssigned.includes(t.id)));
//     setAvailableTasks([...availableTasks, ...tasksToMove]);
//     setSelectedAssigned([]);
//   };

//   return (
//     <div className="w-full max-w-5xl mx-auto mt-6">
//       <div className="grid grid-cols-3 gap-6">
//         {/* Available Tasks */}
//         <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "var(--background)" }}>
//           <h3 className="font-semibold text-lg mb-2">Available Tasks</h3>

//           <TextFieldComponent
//             type="text"
//             label="Search"
//             value={availableSearch}
//             onChange={(e: any) => setAvailableSearch(e.target.value)}
//             placeholder="Search available tasks..."
//             width="100%"
//           />

//           <div className="border rounded mt-3 max-h-[300px] overflow-y-auto" style={{ backgroundColor: "var(--background)" }}>
//             {filteredAvailable.map((task) => (
//               <div
//                 key={task.id}
//                 onClick={() => toggleSelect(task.id, selectedAvailable, setSelectedAvailable)}
//                 className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 ${
//                   selectedAvailable.includes(task.id) ? "bg-blue-200" : "bg-gray-100"
//                 }`}
//               >
//                 {task.name}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Middle Transfer Buttons */}
//         <div className="flex flex-col items-center justify-center gap-4">
//           <ButtonComponent
//             onClick={moveToAssigned}
//             disabled={selectedAvailable.length === 0}
//             sx={{ width: "120px", bgcolor: "green" }}
//           >
//             Add → 
//           </ButtonComponent>

//           <ButtonComponent
//             onClick={moveToAvailable}
//             disabled={selectedAssigned.length === 0}
//             sx={{ width: "120px" }}
//           >
//             ← Remove
//           </ButtonComponent>
//         </div>

//         {/* Assigned Tasks */}
//         <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "var(--background)" }}>
//           <h3 className="font-semibold text-lg mb-2">Assigned Tasks</h3>

//           <TextFieldComponent
//             type="text"
//             label="Search"
//             value={assignedSearch}
//             onChange={(e: any) => setAssignedSearch(e.target.value)}
//             placeholder="Search assigned tasks..."
//             width="100%"
//           />

//           <div className="border rounded mt-3 max-h-[300px] overflow-y-auto" style={{ backgroundColor: "var(--background)" }}>
//             {filteredAssigned.map((task) => (
//               <div
//                 key={task.id}
//                 onClick={() => toggleSelect(task.id, selectedAssigned, setSelectedAssigned)}
//                 className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 ${
//                   selectedAssigned.includes(task.id) ? "bg-blue-200" : "bg-gray-100"
//                 }`}
//               >
//                 {task.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Save button */}
//       <div className="flex justify-end mt-6">
//         <ButtonComponent
//           onClick={() => onSave && onSave(assignedTasks)}
//           sx={{ backgroundColor: "#4CAF50", ":hover": { backgroundColor: "#45A049" } }}
//         >
//           Save Assignments
//         </ButtonComponent>
//       </div>
//     </div>
//   );
// }

import  { useState } from "react";
import TextFieldComponent from "../Fields/TextFieldComponent";
import ButtonComponent from "../Buttons/button";
import api from "../../src/api/axiosClient"; // adjust path if needed

interface Task {
  id: string;
  name: string;
}

interface AssignTasksProps {
  roleId: number;
  availableTasks: Task[];
  assignedTasks: Task[];
  setAvailableTasks: (tasks: Task[]) => void;
  setAssignedTasks: (tasks: Task[]) => void;
  accessToken: string;
  onSave?: (assigned: Task[]) => void;
}

export default function AssignTasks({
  roleId,
  availableTasks,
  assignedTasks,
  setAvailableTasks,
  setAssignedTasks,
  accessToken,
  onSave,
}: AssignTasksProps) {
  const [availableSearch, setAvailableSearch] = useState("");
  const [assignedSearch, setAssignedSearch] = useState("");
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredAvailable = availableTasks.filter((t) =>
    t.name.toLowerCase().includes(availableSearch.toLowerCase())
  );
  const filteredAssigned = assignedTasks.filter((t) =>
    t.name.toLowerCase().includes(assignedSearch.toLowerCase())
  );

  const toggleSelect = (id: string, selectedList: string[], setFn: any) => {
    if (selectedList.includes(id)) {
      setFn(selectedList.filter((x) => x !== id));
    } else {
      setFn([...selectedList, id]);
    }
  };

  // 🔹 Common API function to sync assigned tasks
  const syncAssignedTasks = async (updatedAssigned: Task[]) => {
    try {
      setLoading(true);
      const payload = {
        roleId,
        assignedTaskIds: updatedAssigned.map((t) => Number(t.id)),
        entryBy: "admin", // or use logged-in user if available
      };

      await api.post("/RoleTask/assign", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Updated assigned tasks on server", payload);
    } catch (error) {
      console.error("❌ Failed to update assigned tasks", error);
    } finally {
      setLoading(false);
    }
  };

  const moveToAssigned = async () => {
    if (selectedAvailable.length === 0) return;

    const tasksToMove = availableTasks.filter((t) =>
      selectedAvailable.includes(t.id)
    );

    const newAvailable = availableTasks.filter(
      (t) => !selectedAvailable.includes(t.id)
    );
    const newAssigned = [...assignedTasks, ...tasksToMove];

    setAvailableTasks(newAvailable);
    setAssignedTasks(newAssigned);
    setSelectedAvailable([]);

    // 🔥 Call backend immediately
    await syncAssignedTasks(newAssigned);
  };

  const moveToAvailable = async () => {
    if (selectedAssigned.length === 0) return;

    const tasksToMove = assignedTasks.filter((t) =>
      selectedAssigned.includes(t.id)
    );

    const newAssigned = assignedTasks.filter(
      (t) => !selectedAssigned.includes(t.id)
    );
    const newAvailable = [...availableTasks, ...tasksToMove];

    setAssignedTasks(newAssigned);
    setAvailableTasks(newAvailable);
    setSelectedAssigned([]);

    // 🔥 Call backend immediately
    await syncAssignedTasks(newAssigned);
  };

 return (
  <div className="w-full max-w-5xl mx-auto mt-6">
    <div className="grid grid-cols-3 gap-6">

      {/* Available Tasks */}
      <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "var(--background)" }}>
        <h3 className="font-semibold text-lg mb-2">Available Tasks</h3>
        <TextFieldComponent
          type="text"
          label="Search"
          value={availableSearch}
          onChange={(e: any) => setAvailableSearch(e.target.value)}
          placeholder="Search available tasks..."
          width="100%"
        />
        <div className="border rounded mt-3 max-h-[300px] overflow-y-auto" style={{ backgroundColor: "var(--background)" }}>
          {filteredAvailable.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleSelect(task.id, selectedAvailable, setSelectedAvailable)}
              className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 ${
                selectedAvailable.includes(task.id) ? "bg-blue-200" : "bg-gray-100"
              }`}
            >
              {task.name}
            </div>
          ))}
        </div>
      </div>

      {/* Middle Transfer Buttons */}
      <div className="flex flex-col items-center justify-center gap-4">
        <ButtonComponent
          onClick={moveToAssigned}
          disabled={selectedAvailable.length === 0 || loading}
          sx={{ width: "120px", bgcolor: "green" }}
        >
          {loading ? "Updating..." : "Add →"}
        </ButtonComponent>

        <ButtonComponent
          onClick={moveToAvailable}
          disabled={selectedAssigned.length === 0 || loading}
          sx={{ width: "120px" }}
        >
          {loading ? "Updating..." : "← Remove"}
        </ButtonComponent>
      </div>

      {/* Assigned Tasks */}
      <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: "var(--background)" }}>
        <h3 className="font-semibold text-lg mb-2">Assigned Tasks</h3>
        <TextFieldComponent
          type="text"
          label="Search"
          value={assignedSearch}
          onChange={(e: any) => setAssignedSearch(e.target.value)}
          placeholder="Search assigned tasks..."
          width="100%"
        />
        <div className="border rounded mt-3 max-h-[300px] overflow-y-auto" style={{ backgroundColor: "var(--background)" }}>
          {filteredAssigned.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleSelect(task.id, selectedAssigned, setSelectedAssigned)}
              className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 ${
                selectedAssigned.includes(task.id) ? "bg-blue-200 dark:bg-" : "bg-gray-100"
              }`}
            >
              {task.name}
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Save button */}
    <div className="flex justify-end mt-6">
      <ButtonComponent
        onClick={() => onSave && onSave(assignedTasks)}
        sx={{ backgroundColor: "#4CAF50", ":hover": { backgroundColor: "#45A049" } }}
      >
        Save Assignments
      </ButtonComponent>
    </div>
  </div>
);
}

