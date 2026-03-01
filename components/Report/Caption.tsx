import React, { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import { ReportAPI } from "../../src/api/Report/reportApi";
import ReportFilter from "./ReportFilter";
import { useReportFilter } from "../../hooks/useReportFilter";

import DataGridTable from "../Table/DataGridTable";
import type { Column } from "../Table/DataGridTable";

interface ReportRow {
  id: number;
  [key: string]: any;
}

export default function DynamicReport() {
  const { methods, state, actions } = useReportFilter();

  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [captions, setCaptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Fetch report captions
  // -------------------------------
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

  // -------------------------------
  // Fetch report data
  // -------------------------------
  const handleSubmit = async (filters: any) => {
    setLoading(true);
    try {
      const res = await ReportAPI.getUWRegisterPaidReport(filters);
      const rawData = res.data.data || [];

      const normalizedData: ReportRow[] = rawData.map(
        (row: any, index: number) => {
          const newRow: any = { id: index };
          Object.entries(row).forEach(([key, value]) => {
            newRow[key.toLowerCase()] = value;
          });
          return newRow;
        }
      );

      setReportData(normalizedData);
    } catch (err) {
      console.error("Failed to load report data:", err);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // Cell formatting
  // -------------------------------
  const renderCell = (value: any, dataType?: string): React.ReactNode => {
    if (value == null) return "—";

    switch (dataType) {
      case "Number":
      case "Decimal":
        return Number(value).toLocaleString();
      case "Date":
        return new Date(value).toLocaleDateString();
      case "Currency":
        return `₨ ${Number(value).toLocaleString()}`;
      default:
        return String(value);
    }
  };

  // -------------------------------
  // Dynamic columns
  // -------------------------------
  const equalColumnWidth = 168;

  const columns: Column<ReportRow>[] = captions.map((c) => ({
    label: c.captionName,
    field: c.dataField as keyof ReportRow,
    width: equalColumnWidth,
    minWidth: 110,
    sortable: true,
    render: (row) => (
      <div
        className="truncate"
        title={String(row[c.dataField] ?? "")}
      >
        {renderCell(row[c.dataField], c.dataType)}
      </div>
    ),
  }));

  // -------------------------------
  // CSV export (unchanged)
  // -------------------------------
  const exportLargeCSV = (
    filename: string = "report.csv",
    chunkSize: number = 1000
  ) => {
    if (reportData.length === 0 || captions.length === 0) return;

    const header = captions.map((c) => c.captionName).join(",");
    const blobParts = [header + "\n"];

    for (let i = 0; i < reportData.length; i += chunkSize) {
      const chunk = reportData.slice(i, i + chunkSize).map((row) =>
        captions.map((c) => `"${row[c.dataField] ?? ""}"`).join(",")
      );
      blobParts.push(chunk.join("\n") + "\n");
    }

    const blob = new Blob(blobParts, {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="p-6 space-y-6">
      <ReportFilter
        methods={methods}
        state={state}
        actions={{ ...actions, onSubmit: handleSubmit }}
      />

      {reportData.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => exportLargeCSV()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        <DataGridTable<ReportRow>
          rows={reportData}
          columns={columns}
          loading={loading}
          height={620}
          
        />
      )}
    </div>
  );
}
