// // // src/components/Table/VirtualizedTable.tsx
// // import React from "react";
// // import { FixedSizeList as List } from "react-window";
// // import AutoSizer from "react-virtualized-auto-sizer";
// // import { Paper } from "@mui/material";

// // export interface Column<T> {
// //   label: string;
// //   field: keyof T;
// //   flex?: number;
// //   render?: (row: T) => React.ReactNode;
// // }

// // interface VirtualizedTableProps<T> {
// //   data: T[];
// //   columns: Column<T>[];
// //   height?: string | number;
// //   rowHeight?: number;
// // }

// // function VirtualizedTable<T extends object>({
// //   data,
// //   columns,
// //   height = "70vh",
// //   rowHeight = 48,
// // }: VirtualizedTableProps<T>) {
// //   const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
// //     const row = data[index];
// //     return (
// //       <div
// //         style={{
// //           ...style,
// //           display: "flex",
// //           alignItems: "center",
// //           padding: "0.75rem 1rem",
// //           borderBottom: "1px solid var(--text-muted)",
// //           background:
// //             index % 2 === 0
// //               ? "var(--background-secondary)"
// //               : "var(--background-accent)",
// //           color: "var(--text-foreground)",
// //         }}
// //         className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
// //       >
// //         {columns.map((col, i) => (
// //           <div key={i} style={{ flex: col.flex || 1 }}>
// //             {col.render ? col.render(row) : (row[col.field] as any)}
// //           </div>
// //         ))}
// //       </div>
// //     );
// //   };

// //   return (
// //     <Paper
// //       sx={{
// //         height,
// //         width: "95%",
// //         margin: "auto",
// //         mt: 2,
// //         border: "1px solid var(--text-muted)",
// //         display: "flex",
// //         flexDirection: "column",
// //         backgroundColor: "var(--background)",
// //         color: "var(--text-foreground)",
// //       }}
// //     >
// //       {/* Header */}
// //       <div
// //         className="flex font-semibold text-sm px-4 py-2"
// //         style={{
// //           borderBottom: "1px solid var(--text-muted)",
// //           background: "var(--background-secondary)",
// //         }}
// //       >
// //         {columns.map((col, i) => (
// //           <div key={i} style={{ flex: col.flex || 1 }}>
// //             {col.label}
// //           </div>
// //         ))}
// //       </div>

// //       {/* Body */}
// //       <div className="flex-1">
// //         <AutoSizer>
// //           {({ height, width }) => (
// //             <List
// //               height={height}
// //               itemCount={data.length}
// //               itemSize={rowHeight}
// //               width={width}
// //             >
// //               {Row}
// //             </List>
// //           )}
// //         </AutoSizer>
// //       </div>
// //     </Paper>
// //   );
// // }

// // export default VirtualizedTable;
// // src/components/Table/VirtualizedTable.tsx
// import React, { useState, useMemo } from "react";
// import { FixedSizeList as List } from "react-window";
// import AutoSizer from "react-virtualized-auto-sizer";
// import { Paper, Skeleton } from "@mui/material";
// import { ArrowUp, ArrowDown } from "lucide-react";

// export interface Column<T> {
//   label: string;
//   field: keyof T;
//   flex?: number;
//   render?: (row: T) => React.ReactNode;
//   sortable?: boolean;
// }

// interface VirtualizedTableProps<T> {
//   data: T[];
//   columns: Column<T>[];
//   height?: number | string;
//   rowHeight?: number;
//   loading?: boolean;
//   onRowClick?: (row: T) => void;
// }

// function VirtualizedTable<T extends object>({
//   data,
//   columns,
//   height = 500,
//   rowHeight = 48,
//   loading = false,
//   onRowClick,
// }: VirtualizedTableProps<T>) {
//   const [sortField, setSortField] = useState<keyof T | null>(null);
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
//   const [selectedRow, setSelectedRow] = useState<number | null>(null);

//   const sortedData = useMemo(() => {
//     if (!sortField) return data;
//     return [...data].sort((a, b) => {
//       const valA = a[sortField];
//       const valB = b[sortField];
//       if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//       if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [data, sortField, sortOrder]);

//   const toggleSort = (field: keyof T) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortField(field);
//       setSortOrder("asc");
//     }
//   };

//   const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
//     const row = sortedData[index];

//     if (loading) {
//       return (
//         <div style={{ ...style, padding: "0.75rem 1rem" }}>
//           <Skeleton variant="rectangular" height={rowHeight - 10} />
//         </div>
//       );
//     }

//     return (
//       <div
//         style={{
//           ...style,
//           display: "flex",
//           alignItems: "center",
//           justifyContent:"center",
//           padding: "0.75rem 1rem",
//           borderBottom: "1px solid var(--text-muted)",
//           background: selectedRow === index
//             ? "var(--background-accent)"
//             : index % 2 === 0
//               ? "var(--background-secondary)"
//               : "var(--background)",
//           cursor: "pointer",
//           transition: "all 0.2s ease-in-out",
//         }}
//         onClick={() => {
//           setSelectedRow(index);
//           onRowClick?.(row);
//         }}
//         className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
//       >
//         {columns.map((col, i) => (
//           <div key={i} style={{ flex: col.flex || 1 }}>
//             {col.render ? col.render(row) : (row[col.field] as any)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <Paper
//       sx={{
//         height: typeof height === "number" ? `${height}px` : height,
//         width: "95%",
//         margin: "auto",
//         mt: 2,
//         border: "1px solid var(--text-muted)",
//         display: "flex",
//         flexDirection: "column",
//         backgroundColor: "var(--background)",
//         color: "var(--text-foreground)",
//         overflow: "hidden",
//       }}
//     >
//       {/* Sticky Header */}
//       <div
//         className="flex font-semibold text-sm px-4 py-2 sticky top-0 z-10"
//         style={{
//           borderBottom: "1px solid var(--text-muted)",
//           background: "var(--background-secondary)",
//         }}
//       >
//         {columns.map((col, i) => (
//           <div
//             key={i}
//             style={{ flex: col.flex || 1, display: "flex", alignItems: "center", gap: 4, cursor: col.sortable ? "pointer" : "default" }}
//             onClick={() => col.sortable && toggleSort(col.field)}
//           >
//             {col.label}
//             {sortField === col.field && (sortOrder === "asc" ? <ArrowUp size={14}/> : <ArrowDown size={14}/>)}
//           </div>
//         ))}
//       </div>

//       {/* Empty State */}
//       {!loading && sortedData.length === 0 ? (
//         <div className="flex justify-center items-center h-40 text-center text-gray-500">
//           No data found
//         </div>
//       ) : (
//         <div className="flex-1">
//           <AutoSizer>
//             {({ height, width }) => (
//               <List
//                 height={height}
//                 itemCount={loading ? 7 : sortedData.length}
//                 itemSize={rowHeight}
//                 width={width}
//               >
//                 {Row}
//               </List>
//             )}
//           </AutoSizer>
//         </div>
//       )}
//     </Paper>
//   );
// }

// export default VirtualizedTable;


// src/components/VirtualizedTable.tsx
import React, { useState } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Paper, Skeleton } from "@mui/material";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T> {
  label: string;
  field: keyof T;
  flex?: number;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  height?: number | string;
  rowHeight?: number;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  // emit sort changes to parent: (field, order)
  onSort?: (field: keyof T, order: "asc" | "desc") => void;
}

function VirtualizedTable<T extends object>({
  data,
  columns,
  height = 500,
  rowHeight = 48,
  loading = false,
  onRowClick,
  onSort,
}: Props<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const toggleSort = (field: keyof T) => {
    const nextOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(nextOrder);

    onSort?.(field, nextOrder);
  };

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (loading) {
      return (
        <div style={{ ...style, padding: "0.75rem 1rem" }}>
          <Skeleton variant="rectangular" height={rowHeight - 10} />
        </div>
      );
    }

    const row = data[index] as T;
    return (
      <div
        style={{
          ...style,
          display: "flex",
          alignItems: "center",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid var(--text-muted)",
          background: selectedRow === index
            ? "var(--background-accent)"
            : index % 2 === 0
              ? "var(--background-secondary)"
              : "var(--background)",
          cursor: "pointer",
          transition: "all 0.15s ease-in-out",
        }}
        onClick={() => {
          setSelectedRow(index);
          onRowClick?.(row);
        }}
        className="text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {columns.map((col, i) => (
          <div key={i} style={{ flex: col.flex || 1 }}>
            {col.render ? col.render(row) : (row[col.field] as any)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Paper
      sx={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "95%",
        margin: "auto",
        mt: 2,
        border: "1px solid var(--text-muted)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
        color: "var(--text-foreground)",
        overflow: "hidden",
      }}
    >
      <div
        className="flex font-semibold text-sm px-4 py-2 sticky top-0 z-10"
        style={{
          borderBottom: "1px solid var(--text-muted)",
          background: "var(--background-secondary)",
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            style={{ flex: col.flex || 1, display: "flex", alignItems: "center", gap: 6, cursor: col.sortable ? "pointer" : "default" }}
            onClick={() => col.sortable && toggleSort(col.field)}
          >
            {col.label}
            {sortField === col.field && (sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
          </div>
        ))}
      </div>

      {!loading && data.length === 0 ? (
        <div className="flex justify-center items-center h-40 text-center text-gray-500">
          No data found
        </div>
      ) : (
        <div className="flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={loading ? Math.min(7, 10) : data.length}
                itemSize={rowHeight}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </div>
      )}
    </Paper>
  );
}

export default VirtualizedTable;
