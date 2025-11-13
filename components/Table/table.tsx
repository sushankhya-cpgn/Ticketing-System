import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

const paginationModel = { page: 0, pageSize: 5 };

export default function DataTable({
  height = 400,
  width = "100%",
  rows = [],
  columns = [],
  loading = false,
  getRowId = (row: any) => row.id,
}) {
  return (
    <Paper
      sx={{
        height,
        width,
        border: "1px solid var(--text-muted)",
        backgroundColor: "var(--background)",
        color: "var(--text-foreground)",
      }}
    >
      <DataGrid
  rows={rows}
  columns={columns}
  getRowId={getRowId}
  loading={loading}
  checkboxSelection
  initialState={{ pagination: { paginationModel } }}
  pageSizeOptions={[5, 10]}
  sx={{
    border: 0,
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "var(--background-secondary)", // uses CSS var
      color: "var(--text-foreground)",
      fontWeight: "600",
    },
    "& .MuiDataGrid-row": {
      "&:nth-of-type(even)": {
        backgroundColor: "var(--background-accent)",
      },
      "&:nth-of-type(odd)": {
        backgroundColor: "var(--background-secondary)",
      },
      color: "var(--text-foreground)",
    },
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid var(--text-muted)",
    },
    "& .MuiDataGrid-checkboxInput": {
      color: "var(--text-foreground) !important",
    },
    "& .MuiDataGrid-footerContainer": {
      borderTop: "1px solid var(--text-muted)",
      color: "var(--text-foreground)",
      backgroundColor: "var(--background-secondary)", // CSS variable now handles dark mode
    },
  }}
/>

    </Paper>
  );
}
