
import React from "react";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import { CircularProgress } from "@mui/material";

interface DeleteButtonComponentProps {
  type?: ButtonProps["type"]; // ✅ Add type prop
  label?: string;
  disabled?: boolean;
  variant?: ButtonProps["variant"];
  height?: string | number;
  width?: string | number;
  onClick?: () => void;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  sx?: ButtonProps["sx"];
  children?: React.ReactNode;
}

export default function DeleteButtonComponent({
  type = "button", // ✅ Default to "button" to avoid undefined behavior
  label = "Reset",
  variant = "contained",
  height = "40px",
  width = "120px",
  onClick = () => {},
  loading = false,
  startIcon = null,
  endIcon = null,
  sx = {},
  children,
}: DeleteButtonComponentProps) {

  // 🎨 Red for light mode, Blue for dark mode
  const backgroundColor =  "#dc2626"; // dark=blue-600, light=red-600
  const hoverBackgroundColor = "#b91c1c"; // dark=blue-700, light=red-700
  const textColor = "#ffffff";

  return (
    <Button
      type={type} 
      variant={variant}
      onClick={onClick}
      disabled={loading}
      startIcon={startIcon}
      endIcon={endIcon}
      sx={{
        height,
        width,
        textTransform: "none",
        backgroundColor,
        color: textColor,
        "&:hover": {
          backgroundColor: hoverBackgroundColor,
        },
        ...sx,
      }}
    >
      {loading ? (
        <CircularProgress size={20} color="inherit" />
      ) : (
        children || label // ✅ Children take priority over label
      )}
    </Button>
  );
}