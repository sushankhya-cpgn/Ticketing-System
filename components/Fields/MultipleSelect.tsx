// import {
//   Box,
//   Chip,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   OutlinedInput,
//   Select,
//   type SelectChangeEvent,
// } from "@mui/material";
// import { useTheme } from "../../hooks/useTheme";

// interface MultiSelectChipProps<T> {
//   label: string;
//   items: T[];
//   labelKey: keyof T; // field name for label (ex: "tagName")
//   valueKey: keyof T; // field name for value (ex: "tagID")
//   value: any[]; // selected values (array of valueKey)
//   onChange: (newValues: any[]) => void;
//   width?: number | string;
// }

// function MultiSelectChip<T>({
//   label,
//   items,
//   labelKey,
//   valueKey,
//   value,
//   onChange,
//   width = 300,
// }: MultiSelectChipProps<T>) {
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const handleChange = (event: SelectChangeEvent<any[]>) => {
//     const val = event.target.value;
//     onChange(typeof val === "string" ? val.split(",") : val);
//   };

//   // Shared theme colors
//   const textColor = isDark ? "#f1f5f9" : "#111827";
//   const labelColor = isDark ? "#f1f5f9" : "#374151";
//   const borderColor = isDark ? "#94a3b8" : "#d1d5db";
//   const borderHoverColor = isDark ? "#cbd5e1" : "#111827";
//   const borderFocusColor = isDark ? "#42a5f5" : "#1976d2";
//   const backgroundColor = isDark ? "#121a2d" : "#ffffff";
//   const menuBg = isDark ? "#1f2937" : "#ffffff";

//   return (
//     <FormControl sx={{ width }}>
//       <InputLabel
//         sx={{
//           color: labelColor,
//           "&.Mui-focused": {
//             color: borderFocusColor,
//           },
//         }}
//       >
//         {label}
//       </InputLabel>

//       <Select
//         multiple
//         value={value}
//         onChange={handleChange}
//         input={
//           <OutlinedInput
//             label={label}
//             sx={{
//               backgroundColor,
//               color: textColor,
//               "& fieldset": { borderColor },
//               "&:hover fieldset": { borderColor: borderHoverColor },
//               "&.Mui-focused fieldset": { borderColor: borderFocusColor },
//             }}
//           />
//         }
//         renderValue={(selected) => (
//           <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//             {selected.map((selectedValue) => {
//               const item = items.find((i) => i[valueKey] === selectedValue);
//               return (
//                 <Chip
//                   key={selectedValue}
//                   label={item ? (item[labelKey] as string) : ""}
//                   sx={{
//                     backgroundColor: isDark ? "#374151" : "#e5e7eb",
//                     color: textColor,
//                   }}
//                 />
//               );
//             })}
//           </Box>
//         )}
//         MenuProps={{
//           PaperProps: {
//             sx: {
//               backgroundColor: menuBg,
//               color: textColor,
//             },
//           },
//         }}
//       >
//         {items.map((item) => (
//           <MenuItem
//             key={item[valueKey] as any}
//             value={item[valueKey] as any}
//             sx={{
//               color: textColor,
//               "&.Mui-selected": {
//                 backgroundColor: isDark ? "#2e3a4b" : "#e0e7ff",
//               },
//               "&:hover": {
//                 backgroundColor: isDark ? "#374151" : "#f3f4f6",
//               },
//             }}
//           >
//             {item[labelKey] as string}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// }

// export default MultiSelectChip;

import React from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTheme } from "../../hooks/useTheme";

interface MultiSelectChipProps<T> {
  label: string;
  name: string;
  items: T[];
  labelKey: keyof T;
  valueKey: keyof T;
  width?: number | string;
  required?: boolean;
}

function MultiSelectChip<T>({
  label,
  name,
  items,
  labelKey,
  valueKey,
  width = "100%",
  required = false,
}: MultiSelectChipProps<T>) {
  const { control, formState: { errors } } = useFormContext();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const textColor = isDark ? "#f1f5f9" : "#111827";
  const labelColor = isDark ? "#f1f5f9" : "#374151";
  const borderColor = isDark ? "#94a3b8" : "#d1d5db";
  const borderHoverColor = isDark ? "#cbd5e1" : "#111827";
  const borderFocusColor = isDark ? "#42a5f5" : "#1976d2";
  const backgroundColor = isDark ? "#121a2d" : "#ffffff";
  const menuBg = isDark ? "#1f2937" : "#ffffff";

  return (
    <Controller
      control={control}
      name={name}
      rules={required ? { required: `${label} is required` } : undefined}
      render={({ field }) => (
        <FormControl sx={{ width }}>
          <InputLabel
            sx={{
              color: labelColor,
              "&.Mui-focused": { color: borderFocusColor },
            }}
          >
            {label}
          </InputLabel>

          <Select
            {...field}
            multiple
            value={field.value || []}
            onChange={(e) => field.onChange(e.target.value)}
            input={
              <OutlinedInput
                label={label}
                sx={{
                  backgroundColor,
                  color: textColor,
                  "& fieldset": { borderColor },
                  "&:hover fieldset": { borderColor: borderHoverColor },
                  "&.Mui-focused fieldset": { borderColor: borderFocusColor },
                }}
              />
            }
            renderValue={(selectedValues) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {(selectedValues as any[]).map((val) => {
                  const item = items.find((i) => i[valueKey] === val);
                  return (
                    <Chip
                      key={val}
                      label={item ? (item[labelKey] as string) : ""}
                      sx={{
                        backgroundColor: isDark ? "#374151" : "#e5e7eb",
                        color: textColor,
                      }}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                sx: { backgroundColor: menuBg, color: textColor },
              },
            }}
          >
            {items.map((item) => (
              <MenuItem
                key={String(item[valueKey])}
                value={item[valueKey] as any}
                sx={{
                  color: textColor,
                  "&.Mui-selected": {
                    backgroundColor: isDark ? "#2e3a4b" : "#e0e7ff",
                  },
                  "&:hover": {
                    backgroundColor: isDark ? "#374151" : "#f3f4f6",
                  },
                }}
              >
                {item[labelKey] as string}
              </MenuItem>
            ))}
          </Select>

          {errors[name] && (
            <p className="text-red-500 text-xs mt-1">
              {(errors[name] as any).message}
            </p>
          )}
        </FormControl>
      )}
    />
  );
}

export default MultiSelectChip;
