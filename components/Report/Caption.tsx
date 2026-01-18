// import React, { useState } from "react";
// import { ReportAPI } from "../../src/api/Report/reportApi";
// import ReportFilter from "./ReportFilter";
// import { useReportFilter } from "../../hooks/useReportFilter";

// export default function DynamicReport() {
//   const { methods, state, actions } = useReportFilter();
//   const { captions } = state;
//   const [reportData, setReportData] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Override onSubmit from hook to fetch report data
//   const handleSubmit = async (data: any) => {
//   setLoading(true);
//   try {
//       const res = await ReportAPI.getUWRegisterPaidReport(data);
//       const rows = Array.isArray(res.data.data) ? res.data.data : [];
//     setReportData(rows);
//   } catch (err) {
//     console.error("Error fetching report:", err);
//     setReportData([]);
//   }
//   setLoading(false);
// };


//   // Cell rendering with formatting
//   const renderCell = (value: any, dataType?: string) => {
//     console.log("Rendering cell:", value, dataType);
//     // if (value === null || value === undefined) return "-";
//     // if (dataType === "Number") return Number(value).toLocaleString();
//     // if (dataType === "Date") return new Date(value).toLocaleDateString();
//     return value;
//   };

//   return (
//     <div className="p-6">
//       {/* Filter Panel */}
//       <ReportFilter
//         methods={methods}
//         state={state}
//         actions={{ ...actions, onSubmit: handleSubmit }}
//       />

//       {/* Report Table */}
//       <div className="mt-6">
//         {loading ? (
//           <p>Loading report...</p>
//         ) : (
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 {captions.map((c: any) => (
//                   <th
//                     key={c.captionID}
//                     className="border px-4 py-2 text-left"
//                     style={{ minWidth: c.style || 120 }}
//                   >
//                     {c.captionName}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.length === 0 ? (
//                 <tr>
//                   <td colSpan={captions.length} className="text-center py-4">
//                     No data found
//                   </td>
//                 </tr>
//               ) : (
//                 reportData.map((row, idx) => (
//                   <tr key={idx}>
//                     {captions.map((c: any) => (
//                       <td key={c.captionID} className="border px-4 py-2">
//                         {renderCell(row[c.dataField], c.dataType)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { ReportAPI } from "../../src/api/Report/reportApi";
// import ReportFilter from "./ReportFilter";
// import { useReportFilter } from "../../hooks/useReportFilter";

// export default function DynamicReport() {
//   const { methods, state, actions } = useReportFilter();
//   const [reportData, setReportData] = useState<any[]>([]);
//   const [captions, setCaptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch report data
//   const handleSubmit = async (data: any) => {
//     setLoading(true);
//     try {
//       const res = await ReportAPI.getUWRegisterPaidReport(data);
//       const rows = res.data.data || [];

//       setReportData(rows);

//       // Dynamically generate captions from the first row
//       if (rows.length > 0) {
//         const dynamicCaptions = Object.keys(rows[0]).map((key, idx) => ({
//           captionID: idx,
//           captionName: key,
//           dataField: key,
//           dataType: typeof rows[0][key] === "number" ? "Number" : "String",
//         }));
//         setCaptions(dynamicCaptions);
//       } else {
//         setCaptions([]);
//       }
//     } catch (err) {
//       console.error("Error fetching report:", err);
//       setReportData([]);
//       setCaptions([]);
//     }
//     setLoading(false);
//   };

//   // Format cell values
//   const renderCell = (value: any, dataType?: string) => {
//     if (value === null || value === undefined) return "-";
//     if (dataType === "Number") return Number(value).toLocaleString();
//     if (dataType === "Date") return new Date(value).toLocaleDateString();
//     return value;
//   };

//   return (
//     <div className="p-6">
//       {/* Filter Panel */}
//       <ReportFilter
//         methods={methods}
//         state={state}
//         actions={{ ...actions, onSubmit: handleSubmit }}
//       />

//       {/* Report Table */}
//       <div className="mt-6">
//         {loading ? (
//           <p>Loading report...</p>
//         ) : (
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 {captions.map((c) => (
//                   <th
//                     key={c.captionID}
//                     className="border px-4 py-2 text-left"
//                     style={{ minWidth: 120 }}
//                   >
//                     {c.captionName}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.length === 0 ? (
//                 <tr>
//                   <td colSpan={captions.length} className="text-center py-4">
//                     No data found
//                   </td>
//                 </tr>
//               ) : (
//                 reportData.map((row, idx) => (
//                   <tr key={idx}>
//                     {captions.map((c) => (
//                       <td key={c.captionID} className="border px-4 py-2">
//                         {renderCell(row[c.dataField], c.dataType)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";
// import { ReportAPI } from "../../src/api/Report/reportApi";
// import ReportFilter from "./ReportFilter";
// import { useReportFilter } from "../../hooks/useReportFilter";

// export default function DynamicReport() {
//   const { methods, state, actions } = useReportFilter();
//   const [reportData, setReportData] = useState<any[]>([]);
//   const [captions, setCaptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch captions from backend when component mounts
//   useEffect(() => {
//     const fetchCaptions = async () => {
//       try {
//         const res = await ReportAPI.getReportCaption();
//         const caps = res.data.data || []; // your API returns data array
//         console.log(caps)
//         setCaptions(
//           caps.map((c: any, idx: number) => ({
//             captionID: idx,
//             captionName: c.captionName,
//             dataField: c.dataField, // field in reportData row
//             dataType: c.dataType || "String",
//             style: c.style || 120,
//           }))
//         );

      

//       } catch (err) {
//         console.error("Error fetching captions:", err);
//       }
//     };

//     fetchCaptions();
//   }, []);

//   // Fetch report data on filter submit
//  const handleSubmit = async (filters: any) => {
//   setLoading(true);
//   try {
//     const res = await ReportAPI.getUWRegisterPaidReport(filters);
//     const data = res.data.data || [];

//     // Set report data
//     setReportData(data);

//     // 🔹 Debug: check the first row and all keys
//     if (data.length > 0) {
//       console.log("Report Data (first row):", data[0]);
//       console.log("All keys in first row:", Object.keys(data[0]));
//     }

//   } catch (err) {
//     console.error("Error fetching report:", err);
//     setReportData([]);
//   }
//   setLoading(false);
// };

//   // Render cell with formatting
//   const renderCell = (value: any, dataType?: string) => {
//     if (value === null || value === undefined) return "-";
//     if (dataType === "Number") return Number(value).toLocaleString();
//     if (dataType === "Date") return new Date(value).toLocaleDateString();
    
//     return value;
//   };

//   return (
//     <div className="p-6">
//       {/* Filter Panel */}
//       <ReportFilter
//         methods={methods}
//         state={state}
//         actions={{ ...actions, onSubmit: handleSubmit }}
//       />

//       {/* Report Table */}
//       <div className="mt-6">
//         {loading ? (
//           <p>Loading report...</p>
//         ) : (
//           <table className="min-w-full border border-gray-200">
//             <thead className="bg-gray-100">
//               <tr>
//                 {captions.map((c) => (
//                   <th
//                     key={c.captionID}
//                     className="border px-4 py-2 text-left"
//                     style={{ minWidth: c.style }}
//                   >
//                     {c.captionName}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.length === 0 ? (
//                 <tr>
//                   <td colSpan={captions.length} className="text-center py-4">
//                     No data found
//                   </td>
//                 </tr>
//               ) : (
//                 reportData.map((row, idx) => (
//                   <tr key={idx}>
//                     {captions.map((c) => (
//                       <td key={c.captionID} className="border px-4 py-2">
//                         {renderCell(row[c.dataField], c.dataType)}
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import { ReportAPI } from "../../src/api/Report/reportApi";
// import ReportFilter from "./ReportFilter";
// import { useReportFilter } from "../../hooks/useReportFilter";
// import { CircularProgress, Paper } from "@mui/material";
// import type { Column } from "../Table/VirtualizedTable";
// import VirtualizedTable from "../Table/VirtualizedTable";

// interface ReportRow {
//   [key: string]: any; // dynamic fields from backend
// }

// export default function DynamicReport() {
//   const { methods, state, actions } = useReportFilter();
//   const [reportData, setReportData] = useState<ReportRow[]>([]);
//   const [captions, setCaptions] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch captions once
//   useEffect(() => {
//     const fetchCaptions = async () => {
//       try {
//         const res = await ReportAPI.getReportCaption();
//         const caps = res.data.data || [];

//         // Normalize + add index as id
//         setCaptions(
//           caps.map((c: any, idx: number) => ({
//             captionID: idx,
//             captionName: c.captionName,
//             dataField: c.dataField.toLowerCase(),
//             dataType: c.dataType || "String",
//             style: c.style || 140, // min-width in px
//             flex: c.style ? Math.round(c.style / 100) : 1, // rough flex approximation
//           }))
//         );
//       } catch (err) {
//         console.error("Error fetching captions:", err);
//       }
//     };

//     fetchCaptions();
//   }, []);

//   // Fetch report when filters are submitted
//   const handleSubmit = async (filters: any) => {
//     setLoading(true);
//     try {
//       const res = await ReportAPI.getUWRegisterPaidReport(filters);
//       const rawData = res.data.data || [];

//       // Normalize keys to lowercase
//       const normalized = rawData.map((row: any) => {
//         const newRow: any = {};
//         Object.keys(row).forEach((key) => {
//           newRow[key.toLowerCase()] = row[key];
//         });
//         return newRow;
//       });

//       setReportData(normalized);
//     } catch (err) {
//       console.error("Error fetching report:", err);
//       setReportData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Format cell content according to data type
//   const renderCell = (value: any, dataType?: string) => {
//     if (value === null || value === undefined) return "—";
//     if (dataType === "Number") return Number(value).toLocaleString();
//     if (dataType === "Date") return new Date(value).toLocaleDateString();
//     if (dataType === "Currency") return `$${Number(value).toLocaleString()}`;
//     return String(value);
//   };

//   // Build columns dynamically from captions
//   const columns: Column<ReportRow>[] = captions.map((c) => ({
//     label: c.captionName,
//     field: c.dataField as keyof ReportRow,
//     flex: c.flex || 1,
//     sortable: false, // ← can enable later if backend supports sorting
//     // Optional: custom rendering per column
//     render: (row) => renderCell(row[c.dataField], c.dataType),
//   }));

//   return (
//     <div className="p-6 space-y-6">
//       {/* Filter Panel */}
//       <ReportFilter
//         methods={methods}
//         state={state}
//         actions={{ ...actions, onSubmit: handleSubmit }}
//       />

//       {/* Report Table */}
//       <Paper
//         elevation={1}
//         sx={{
//           border: "1px solid var(--text-muted)",
//           overflow: "hidden",
//           backgroundColor: "var(--background)",
//         }}
//       >
//         {loading ? (
//           <div className="flex items-center justify-center h-96">
//             <CircularProgress />
//           </div>
//         ) : reportData.length === 0 && captions.length > 0 ? (
//           <div className="h-96 flex items-center justify-center text-gray-500">
//             No data found for the selected filters
//           </div>
//         ) : captions.length === 0 ? (
//           <div className="h-96 flex items-center justify-center text-gray-500">
//             Loading report structure...
//           </div>
//         ) : (
//           <VirtualizedTable<ReportRow>
//             data={reportData}
//             columns={columns}
//             height={620}           // adjust as needed
//             rowHeight={52}
//             loading={loading}
//             onRowClick={() => {}}  // can be used later (e.g. open detail modal)
//             // onSort={(field, order) => {
//             //   // Implement if backend supports sorting
//             //   console.log(`Sort: ${String(field)} ${order}`);
//             // }}
//           />
//         )}
//       </Paper>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { ReportAPI } from "../../src/api/Report/reportApi";
import ReportFilter from "./ReportFilter";
import { useReportFilter } from "../../hooks/useReportFilter";
import { CircularProgress} from "@mui/material";
import type { Column } from "../Table/VirtualizedTable";
import VirtualizedTable from "../Table/VirtualizedTable";

interface ReportRow {
  [key: string]: any; // dynamic fields from backend
}

export default function DynamicReport() {
  const { methods, state, actions } = useReportFilter();
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [captions, setCaptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch report structure (captions/columns) once on mount
  useEffect(() => {
    const fetchCaptions = async () => {
      try {
        const res = await ReportAPI.getReportCaption();
        const caps = res.data.data || [];

        setCaptions(
          caps.map((c: any, idx: number) => ({
            captionID: idx,
            captionName: c.captionName || "Unnamed",
            dataField: (c.dataField || "").toLowerCase(),
            dataType: c.dataType || "String",
            style: Number(c.style) || 140,
          }))
        );
      } catch (err) {
        console.error("Failed to load report captions:", err);
        setCaptions([]);
      }
    };

    fetchCaptions();
  }, []);

  // Handle filter submission → fetch report data
  const handleSubmit = async (filters: any) => {
    setLoading(true);
    try {
      const res = await ReportAPI.getUWRegisterPaidReport(filters);
      const rawData = res.data.data || [];

      // Normalize all keys to lowercase
      const normalizedData = rawData.map((row: any) => {
        const newRow: Record<string, any> = {};
        Object.entries(row).forEach(([key, value]) => {
          newRow[key.toLowerCase()] = value;
        });
        return newRow;
      });

      setReportData(normalizedData);
    } catch (err) {
      console.error("Failed to load report data:", err);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // Format cell values according to data type
  const renderCell = (value: any, dataType?: string): React.ReactNode => {
    if (value == null) return "—";

    switch (dataType) {
      case "Number":
      case "Decimal":
        return Number(value).toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        });
      case "Date":
        return new Date(value).toLocaleDateString();
      case "Currency":
        return `₨ ${Number(value).toLocaleString()}`;
      default:
        return String(value);
    }
  };

  // Equal width for all columns (tune as needed)
  const equalColumnWidth = 168;

  const columns: Column<ReportRow>[] = captions.map((c) => ({
    label: c.captionName,
    field: c.dataField as keyof ReportRow,
    width: equalColumnWidth,
    minWidth: 110,
    sortable: false, // enable later if needed
    render: (row) => (
      <div
        className="truncate" // tailwind: overflow-hidden + text-ellipsis + whitespace-nowrap
        title={String(row[c.dataField] ?? "")} // tooltip on hover
      >
        {renderCell(row[c.dataField], c.dataType)}
      </div>
    ),
  }));

  const exportToCSV = () => {
    // Check if there's data to export
    if (reportData.length === 0 || captions.length === 0) {
      console.log("No data available to export.");
      return;
    }
    const header = captions.map((c)=> c.captionName).join(",");
    const rows = reportData.map((row)=>
      captions.map((c)=> `"${row[c.dataField] ?? ""}"`).join(",")
    );
    const csvContent = [header, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Filter Section */}
      <ReportFilter
        methods={methods}
        state={state}
        actions={{ ...actions, onSubmit: handleSubmit }}
      />

      {reportData.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Export to CSV
          </button>
        </div>
      )}
        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <CircularProgress />
          </div>
        ) : reportData.length === 0 && captions.length > 0 ? (
          <div className="flex items-center justify-center h-[60vh] text-gray-500">
            No records found for the selected filters
          </div>
        ) : captions.length === 0 ? (
          <div className="flex items-center justify-center h-[60vh] text-gray-500">
            Loading report structure...
          </div>
        ) : (
          <div
          
          >
            <VirtualizedTable<ReportRow>
              data={reportData}
              columns={columns}
              height={620}
              rowHeight={52}
              loading={loading}
              onRowClick={() => {}}
            />
          </div>
        )}
    </div>
  );
}