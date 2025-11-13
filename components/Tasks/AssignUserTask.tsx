import React, { useState } from "react";
import TextFieldComponent from "../Fields/TextFieldComponent";
import ButtonComponent from "../Buttons/button";
import api from "../../src/api/axiosClient";

interface Task {
  id: string;
  name: string;
}

interface AssignUserTasksProps {
  userId: number;
  availableTasks: Task[];
  assignedTasks: Task[];
  setAvailableTasks: (tasks: Task[]) => void;
  setAssignedTasks: (tasks: Task[]) => void;
  accessToken: string;
  onSave?: (assigned: Task[]) => void;
}

export default function AssignUserTasks({
  userId,
  availableTasks,
  assignedTasks,
  setAvailableTasks,
  setAssignedTasks,
  accessToken,
  onSave,
}: AssignUserTasksProps) {
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

  const toggleSelect = (id: string, list: string[], setList: any) => {
    setList(
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id]
    );
  };

  const syncUserTask = async (updated: Task[]) => {
    try {
      setLoading(true);

      const payload = {
        userId,
        assignedTaskIds: updated.map((t) => Number(t.id)),
        entryBy: "admin",
      };

      await api.post("/UserTask/assign", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      console.log("✅ User tasks updated");
    } catch (err) {
      console.error("❌ Error updating user tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const moveToAssigned = async () => {
    if (!selectedAvailable.length) return;

    const move = availableTasks.filter((t) => selectedAvailable.includes(t.id));
    const newAvail = availableTasks.filter((t) => !selectedAvailable.includes(t.id));
    const newAssign = [...assignedTasks, ...move];

    setAvailableTasks(newAvail);
    setAssignedTasks(newAssign);
    setSelectedAvailable([]);

    await syncUserTask(newAssign);
  };

  const moveToAvailable = async () => {
    if (!selectedAssigned.length) return;

    const move = assignedTasks.filter((t) => selectedAssigned.includes(t.id));
    const newAssign = assignedTasks.filter((t) => !selectedAssigned.includes(t.id));
    const newAvail = [...availableTasks, ...move];

    setAssignedTasks(newAssign);
    setAvailableTasks(newAvail);
    setSelectedAssigned([]);

    await syncUserTask(newAssign);
  };

//   return (
//     <div className="w-full max-w-5xl mx-auto mt-6">
//       <div className="grid grid-cols-3 gap-6">

//         {/* Available */}
//         <div className="p-4 rounded-lg shadow-md " style={{backgroundColor:"var(--background)"}}>
//           <h3 className="font-semibold text-lg mb-2">Available Tasks</h3>
//           <TextFieldComponent
//             label="Search"
//             value={availableSearch}
//             onChange={(e: any) => setAvailableSearch(e.target.value)}
//             width="100%"
//           />
//           <div className="border rounded mt-3 max-h-[300px] overflow-y-auto bg-white dark:bg-[#1e293b]">
//             {filteredAvailable.map((t) => (
//               <div
//                 key={t.id}
//                 onClick={() => toggleSelect(t.id, selectedAvailable, setSelectedAvailable)}
//                 className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 dark:hover:bg-gray-700 ${
//                   selectedAvailable.includes(t.id)
//                     ? "bg-blue-200 dark:bg-blue-900"
//                     : "bg-gray-100 dark:bg-gray-800"
//                 }`}
//               >
//                 {t.name}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex flex-col items-center justify-center gap-4">
//           <ButtonComponent disabled={!selectedAvailable.length || loading} onClick={moveToAssigned}>
//             {loading ? "..." : "Add →"}
//           </ButtonComponent>

//           <ButtonComponent disabled={!selectedAssigned.length || loading} onClick={moveToAvailable}>
//             {loading ? "..." : "← Remove"}
//           </ButtonComponent>
//         </div>

//         {/* Assigned */}
//         <div className="p-4 rounded-lg shadow-md bg-[#f8fafc] dark:bg-[#0f172a]">
//           <h3 className="font-semibold text-lg mb-2">Assigned Tasks</h3>
//           <TextFieldComponent
//             label="Search"
//             value={assignedSearch}
//             onChange={(e: any) => setAssignedSearch(e.target.value)}
//             width="100%"
//           />
//           <div className="border rounded mt-3 max-h-[300px] overflow-y-auto bg-white dark:bg-[#1e293b]">
//             {filteredAssigned.map((t) => (
//               <div
//                 key={t.id}
//                 onClick={() => toggleSelect(t.id, selectedAssigned, setSelectedAssigned)}
//                 className={`cursor-pointer p-2 m-2 border-b hover:bg-gray-200 dark:hover:bg-gray-700 ${
//                   selectedAssigned.includes(t.id)
//                     ? "bg-blue-200 dark:bg-blue-900"
//                     : "bg-gray-100 dark:bg-gray-800"
//                 }`}
//               >
//                 {t.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end mt-6">
//         <ButtonComponent onClick={() => onSave?.(assignedTasks)}>
//           Save Assignments
//         </ButtonComponent>
//       </div>
//     </div>
//   );

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
                selectedAssigned.includes(task.id) ? "bg-blue-200" : "bg-gray-100"
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
