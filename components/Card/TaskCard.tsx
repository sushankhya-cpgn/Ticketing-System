// TaskCard.tsx

import { useTheme } from "../../hooks/useTheme";

interface TaskCardProps {
  task: {
    id: string;
    content: string;
    priority?: string;
    assignedTo?: string;
    tags?: string[];
  };
  onClick?: () => void;
}

export default function TaskCard({ task, onClick }: TaskCardProps) {
 
  const { theme } = useTheme();

  const getPriorityStyle = (priority?: string) => {
    const p = priority?.toLowerCase() || "";

    // Default light mode styles
    let light = "bg-slate-100 text-slate-700 border-slate-300";
    let dark = "bg-slate-800 text-slate-400 border-slate-600";

    if (p.includes("high")) {
      light = "bg-red-100/90 text-red-800 border-red-200";
      dark = "bg-red-900/50 text-red-300 border-red-800/60";
    } else if (p.includes("medium")) {
      light = "bg-amber-100/90 text-amber-800 border-amber-200";
      dark = "bg-amber-900/40 text-amber-300 border-amber-700/60";
    } else if (p.includes("low")) {
      light = "bg-emerald-100/90 text-emerald-800 border-emerald-200";
      dark = "bg-emerald-900/40 text-emerald-300 border-emerald-700/60";
    }

    const isDark = theme === "dark";

    return isDark ? dark : light;
  };

  return (
    <div
      onClick={onClick}
      className="
        group relative rounded-xl border p-5
        shadow-sm hover:shadow-xl transition-all duration-300
        cursor-pointer hover:-translate-y-1
        overflow-hidden
      "
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--background-accent)",
        color: "var(--text-foreground)",
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Drag handle dots */}
      <div className="absolute left-3 top-6 opacity-0 group-hover:opacity-50 transition-opacity">
        <div className="flex flex-col gap-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-current opacity-30" />
          ))}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-lg mb-4 pl-7 line-clamp-2">
        {task.content || "No title"}
      </h3>

      {/* Tags */}
      {(task.tags?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {task?.tags?.map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border"
              style={{
                background: "var(--background)",
                borderColor: "var(--background-accent)",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom: Priority + Assignee */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Priority
          </span>
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${getPriorityStyle(task.priority)}`}
          >
            {task.priority || "Normal"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {task.assignedTo || "Unassigned"}
          </span>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
            {task.assignedTo?.[0]?.toUpperCase() || "U"}
          </div>
        </div>
      </div>
    </div>
  );
}