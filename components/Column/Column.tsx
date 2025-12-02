export default function Column({ title, children }:any) {
  return (
    <div
      style={{
        width: 280,
         background: "var(--background-secondary)",
        color: "var(--text-foreground)",
        padding: 10,
        borderRadius: 8,
        minHeight: 100,
      }}
    >
      <h3 style={{ margin: "0 0 12px 0" }}>{title}</h3>
      {children}
    </div>
  );
}
