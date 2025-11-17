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
      {task.content}
    </div>
  );
}
