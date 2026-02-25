import React from "react";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Paper } from "@mui/material";

export interface Column<T> {
  label: string;
  field: keyof T;
  width?: number;
  flex?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

function convertColumns<T>(columns: Column<T>[]): GridColDef[] {
  return columns.map((col) => ({
    field: col.field as string,
    headerName: col.label,
    width: col.width,
    flex: col.width ? undefined : col.flex ?? 1,
    minWidth: col.minWidth,
    maxWidth: col.maxWidth,
    sortable: col.sortable ?? false,
    align: col.align,
    headerAlign: col.align,
    renderCell: col.render
      ? (params) => col.render?.(params.row)
      : undefined,
  }));
}

interface Props<T> {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  height?: number;
}

export default function DataGridTable<
  T extends { id: string | number }
>({
  rows,
  columns,
  loading = false,
  height = 620,
}: Props<T>) {
  return (
    <Paper
      sx={{
        height,
        width: "100%",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <DataGrid
        rows={rows}
        columns={convertColumns(columns)}
        loading={loading}
        disableRowSelectionOnClick
        pageSizeOptions={[25, 50, 100]}
        sx={{
          border: "none",
          backgroundColor: "var(--background)",
          color: "var(--text-foreground)",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "var(--background-secondary)",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
          },

          "& .MuiDataGrid-columnSeparator": {
            color: "rgba(0,0,0,0.08)",
          },

          "& .MuiDataGrid-row": {
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(59,130,246,0.08)",
          },

          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(59,130,246,0.12)",
          },
        }}
      />
    </Paper>
  );
}
