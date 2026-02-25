import React, { useState, useMemo } from "react";
import { FixedSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Paper, Skeleton } from "@mui/material";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface Column<T> {
  label: string;
  field: keyof T;
  flex?: number;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  align?: "left" | "center" | "right";
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

  // Handle sort toggle
  const toggleSort = (field: keyof T) => {
    const nextOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";

    setSortField(field);
    setSortOrder(nextOrder);
    onSort?.(field, nextOrder);
  };

  // Sort data locally if no parent sort
  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a: any, b: any) => {
      const v1 = a[sortField];
      const v2 = b[sortField];

      if (v1 == null) return 1;
      if (v2 == null) return -1;

      if (v1 < v2) return sortOrder === "asc" ? -1 : 1;
      if (v1 > v2) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  // Total min width for horizontal scroll
  const totalWidth = useMemo(
    () => columns.reduce((sum, col) => sum + (col.width || 150), 0),
    [columns]
  );

  // Row renderer
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    if (loading) {
      return (
        <div style={{ ...style, padding: "8px 12px" }}>
          <Skeleton variant="rectangular" height={rowHeight - 12} />
        </div>
      );
    }

    const row = sortedData[index] as T;
    const isSelected = selectedRow === index;

    return (
      <div
        style={{
          ...style,
          display: "flex",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          background: isSelected
            ? "rgba(59,130,246,0.12)"
            : index % 2 === 0
              ? "var(--background-secondary)"
              : "var(--background)",
          cursor: "pointer",
          transition: "background 0.15s ease, transform 0.05s ease",
        }}
        className="group text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => {
          setSelectedRow(index);
          onRowClick?.(row);
        }}
      >
        {columns.map((col, i) => {
          const cellStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            borderRight:
              i === columns.length - 1
                ? "none"
                : "1px solid rgba(0,0,0,0.04)",
            textAlign: col.align ?? "left",
            justifyContent:
              col.align === "right"
                ? "flex-end"
                : col.align === "center"
                  ? "center"
                  : "flex-start",
          };

          if (col.width !== undefined) {
            cellStyle.width = `${col.width}px`;
            cellStyle.flex = "0 0 auto";
          } else if (col.flex !== undefined) {
            cellStyle.flex = col.flex;
          } else {
            cellStyle.flex = 1;
          }

          if (col.minWidth) cellStyle.minWidth = `${col.minWidth}px`;
          if (col.maxWidth) cellStyle.maxWidth = `${col.maxWidth}px`;

          return (
            <div key={i} style={cellStyle}>
              {col.render ? col.render(row) : (row[col.field] as any)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Paper
      sx={{
        height: typeof height === "number" ? `${height}px` : height,
        width: "100%",
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--background)",
        color: "var(--text-foreground)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-black/40 z-20">
          <div className="text-sm text-gray-500">Loading data…</div>
        </div>
      )}

      {/* Horizontal Scroll Wrapper */}
      <div style={{ overflowX: "auto", flex: 1 }}>
        <div
          style={{
            minWidth: totalWidth,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <div
            className="flex sticky top-0 z-10 text-xs font-semibold tracking-wide uppercase"
            style={{
              height: 44,
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              background: "var(--background-secondary)",
              boxShadow: "0 1px 0 rgba(0,0,0,0.04)",
            }}
          >
            {columns.map((col, i) => {
              const isActive = sortField === col.field;

              return (
                <div
                  key={i}
                  onClick={() => col.sortable && toggleSort(col.field)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "0 12px",
                    cursor: col.sortable ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: isActive ? "#2563eb" : "inherit",
                    borderRight:
                      i === columns.length - 1
                        ? "none"
                        : "1px solid rgba(0,0,0,0.04)",
                    width: col.width ? `${col.width}px` : undefined,
                    flex: col.width ? "0 0 auto" : col.flex ?? 1,
                    minWidth: col.minWidth ? `${col.minWidth}px` : undefined,
                    maxWidth: col.maxWidth ? `${col.maxWidth}px` : undefined,
                  }}
                >
                  {col.label}

                  {col.sortable && (
                    <span style={{ opacity: isActive ? 1 : 0.3 }}>
                      {isActive ? (
                        sortOrder === "asc" ? (
                          <ArrowUp size={14} />
                        ) : (
                          <ArrowDown size={14} />
                        )
                      ) : (
                        <ArrowUp size={14} style={{ visibility: "hidden" }} />
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {!loading && sortedData.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-500 gap-2">
              <span className="text-lg">📭</span>
              <span>No records found</span>
            </div>
          ) : (
            /* Body */
            <div style={{ flex: 1 }}>
              <AutoSizer>
                {({ height, width }) => (
                  <List
                    height={height}
                    itemCount={loading ? 7 : sortedData.length}
                    itemSize={rowHeight}
                    width={Math.max(width, totalWidth)}
                    overscanCount={5}
                  >
                    {Row}
                  </List>
                )}
              </AutoSizer>
            </div>
          )}
        </div>
      </div>
    </Paper>
  );
}

export default VirtualizedTable;
