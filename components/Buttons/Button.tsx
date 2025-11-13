// // import React from 'react';
// // import Button from '@mui/material/Button';
// // import type { ButtonProps } from '@mui/material/Button';
// // import { CircularProgress } from '@mui/material';


// // interface ButtonComponentProps{
// //   label?:string;
// //   variant?: ButtonProps['variant'];
// //   color?: ButtonProps['color'];
// //   height?: string | number;
// //   width?: string | number;
// //   onClick?: ()=> void;
// //   loading?: boolean;
// //   startIcon?:React.ReactNode;
// //   endIcon?:React.ReactNode;
// //   sx?: ButtonProps['sx'];
// // }

// // export default function ButtonComponent({
// //   label = "Reset",
// //   variant = "outlined",
// //   color = "error",
// //   height = "40px",
// //   width = "100px",
// //   onClick = () => {},
// //   loading = false,
// //   startIcon = null,
// //   endIcon = null,
// //   sx = {},
// // }:ButtonComponentProps) {
// //   return (
// //     <Button
// //       variant={variant}
// //       color={color}
// //       onClick={onClick}
// //       disabled={loading}
// //       startIcon={startIcon}
// //       endIcon={endIcon}
// //       sx={{
// //         height,
// //         width,
// //         textTransform: "none",
// //         ...sx,
// //       }}
// //     >
// //       {loading ? <CircularProgress size={20} color="inherit" /> : label}
// //     </Button>
// //   );
// // }
// import React from "react";
// import Button from "@mui/material/Button";
// import type { ButtonProps } from "@mui/material/Button";
// import { CircularProgress } from "@mui/material";
// import { useTheme } from "../../src/useTheme";

// interface ButtonComponentProps {
//   label?: string;
//   variant?: ButtonProps["variant"];
//   height?: string | number;
//   width?: string | number;
//   onClick?: () => void;
//   loading?: boolean;
//   startIcon?: React.ReactNode;
//   endIcon?: React.ReactNode;
//   sx?: ButtonProps["sx"];
//   children?: React.ReactNode; // ✅ new
// }

// export default function ButtonComponent({
//   label = "Reset",
//   variant = "contained",
//   height = "40px",
//   width = "120px",
//   onClick = () => {},
//   loading = false,
//   startIcon = null,
//   endIcon = null,
//   sx = {},
//   children, // ✅ destructure
// }: ButtonComponentProps) {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   // 🎨 Red for light mode, Blue for dark mode
//   const backgroundColor = isDark ? "#2563eb" : "#dc2626"; // dark=blue-600, light=red-600
//   const hoverBackgroundColor = isDark ? "#1d4ed8" : "#b91c1c"; // dark=blue-700, light=red-700
//   const textColor = "#ffffff";

//   return (
//     <Button
//       variant={variant}
//       onClick={onClick}
//       disabled={loading}
//       startIcon={startIcon}
//       endIcon={endIcon}
//       sx={{
//         height,
//         width,
//         textTransform: "none",
//         backgroundColor,
//         color: textColor,
//         "&:hover": {
//           backgroundColor: hoverBackgroundColor,
//         },
//         ...sx,
//       }}
//     >
//       {loading ? (
//         <CircularProgress size={20} color="inherit" />
//       ) : (
//         children || label // ✅ children take priority over label
//       )}
//     </Button>
//   );
// }


import React from "react";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { useTheme } from "../../hooks/useTheme";

interface ButtonComponentProps {
  type?: ButtonProps["type"]; // ✅ Add type prop
  color?: ButtonProps["color"]
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

export default function ButtonComponent({
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
  color,
  children,
}: ButtonComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 🎨 Red for light mode, Blue for dark mode
  const backgroundColor = isDark ? "#2563eb" : "#dc2626"; // dark=blue-600, light=red-600
  const hoverBackgroundColor = isDark ? "#1d4ed8" : "#b91c1c"; // dark=blue-700, light=red-700
  const textColor = "#ffffff";

  return (
    <Button
      type={type} 
      variant={variant}
      color={color}
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