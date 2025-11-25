export default function TaskCard({ task }:any) {
  return (
    <div
      style={{
        background: "white",
        padding: "12px",
        borderRadius: "6px",
        marginBottom: "8px",
        border: "1px solid #e5e5e5",
      }}
    >
      <h2>{task.content}</h2>
      <p>Tags: {task.tags.map((tag:string[],index:number)=><span className=" mr-2" key={index}>{tag}</span>)}</p>
      <p>Description: {task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Assigned To: {task.assignedTo}</p>
    </div>
  );
}
