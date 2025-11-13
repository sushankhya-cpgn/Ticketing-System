// // src/components/Fields/SelectSearch.tsx
// import React from "react";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import { Controller, useFormContext } from "react-hook-form";
// import type { FieldError } from "react-hook-form";

// interface OptionType {
//   label: string;
//   value: string | number;
// }

// interface SelectSearchProps {
//   label?: string;
//   name?: string;
//   options: OptionType[];
//   required?: boolean;
//   errors?: Record<string, FieldError | undefined>;
//   height?: string;
//   width?: string;
//   validation?: object;
//   value?: string | number;
//   onChange?: (val: string | number) => void;
//   placeholder?: string;
//   [key: string]: any;
// }

// const SelectSearch: React.FC<SelectSearchProps> = ({
//   label = "Field",
//   name,
//   options = [],
//   required = false,
//   errors,
//   height = "50px",
//   width = "100%",
//   validation = {},
//   value = "",
//   onChange,
//   placeholder,
//   ...otherProps
// }) => {
//   // Safe usage of RHF context
//   let formContext: ReturnType<typeof useFormContext> | null = null;
//   try {
//     formContext = useFormContext();
//   } catch {
//     formContext = null;
//   }

//   const isFormField = !!formContext?.control && name;

//   const validationRules = isFormField
//     ? { ...validation, ...(required && { required: `${label} is required` }) }
//     : {};

//   const commonSx = {
//     width,
//     "& .MuiInputBase-input": {
//       color: "var(--text-foreground)",
//       "::placeholder": { color: "var(--text-muted)", opacity: 1 },
//     },
//     "& .MuiOutlinedInput-root": {
//       backgroundColor: "var(--background-secondary)",
//       "& fieldset": { borderColor: "var(--text-muted)" },
//       "&:hover fieldset": { borderColor: "var(--text-secondary)" },
//       "&.Mui-focused fieldset": { borderColor: "var(--text-primary)" },
//     },
//     "& .MuiInputLabel-root": { color: "var(--text-secondary)" },
//     "& .MuiInputLabel-root.Mui-focused": { color: "var(--text-primary)" },
//   };

//   const dropdownSx = {
//     backgroundColor: "var(--background-secondary)",
//     color: "var(--text-foreground)",
//     "& .MuiAutocomplete-option": {
//       color: "var(--text-foreground)",
//       "&[aria-selected='true']": { backgroundColor: "var(--background-accent)" },
//       "&:hover": { backgroundColor: "var(--background-accent)" },
//     },
//   };

//   // Handle null/undefined values safely
//   const getOptionByValue = (val: string | number | undefined) =>
//     options.find((opt) => opt.value === val) || null;

//   return isFormField ? (
//     <Controller
//       name={name!}
//       control={formContext!.control}
//       rules={validationRules}
//       render={({ field }) => (
//         <Autocomplete
//           options={options}
//           getOptionLabel={(opt) => opt.label || ""}
//           isOptionEqualToValue={(opt, val) => opt.value === val.value}
//           value={getOptionByValue(field.value)}
//           onChange={(_, newValue) => field.onChange(newValue ? newValue.value : "")}
//           slotProps={{ paper: { sx: dropdownSx } }}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               label={label}
//               placeholder={placeholder || label}
//               error={Boolean(errors?.[name!])}
//               helperText={errors?.[name!]?.message}
//               required={required}
//               variant="outlined"
//               sx={commonSx}
//               InputProps={{
//                 ...params.InputProps,
//                 sx: {
//                   height,
//                   "& .MuiInputBase-input": { padding: "10px 14px", height, boxSizing: "border-box" },
//                 },
//               }}
//               {...otherProps}
//             />
//           )}
//         />
//       )}
//     />
//   ) : (
//     <Autocomplete
//       options={options}
//       getOptionLabel={(opt) => opt.label || ""}
//       value={getOptionByValue(value)}
//       onChange={(_, newValue) => onChange && onChange(newValue ? newValue.value : "")}
//       slotProps={{ paper: { sx: dropdownSx } }}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           label={label}
//           placeholder={placeholder || label}
//           variant="outlined"
//           sx={commonSx}
//           InputProps={{
//             ...params.InputProps,
//             sx: {
//               height,
//               "& .MuiInputBase-input": { padding: "10px 14px", height, boxSizing: "border-box" },
//               "& .MuiSvgIcon-root": { color: "var(--text-foreground)" },
//             },
//           }}
//           {...otherProps}
//         />
//       )}
//     />
//   );
// };

// export default SelectSearch;


// src/components/Fields/SelectSearch.tsx
// src/components/Fields/SelectSearch.tsx
import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Controller, useFormContext } from "react-hook-form";
import type { FieldErrors, FieldError } from "react-hook-form";

interface OptionType {
  label: string;
  value: string | number;
}

interface SelectSearchProps {
  label?: string;
  name?: string;
  options: OptionType[];
  required?: boolean;
  errors?: FieldErrors; // ✅ FIXED: Accepts full FieldErrors
  height?: string;
  width?: string;
  validation?: object;
  value?: string | number;
  onChange?: (val: string | number) => void;
  placeholder?: string;
  [key: string]: any;
}

const SelectSearch: React.FC<SelectSearchProps> = ({
  label = "Field",
  name,
  options = [],
  required = false,
  errors,
  height = "50px",
  width = "100%",
  validation = {},
  value: controlledValue,
  onChange: controlledOnChange,
  placeholder,
  ...otherProps
}) => {
  // Safely get form context
  let formContext: ReturnType<typeof useFormContext> | null = null;
  try {
    formContext = useFormContext();
  } catch {
    formContext = null;
  }

  const isFormField = !!formContext?.control && name;

  // const validationRules = isFormField
  //   ? { ...validation, ...(required && { required: `${label} is required` }) }
  //   : {};

  const validationRules = isFormField
  ? {
      ...validation,
      ...(required && {
        validate: (value: any) =>
          value !== undefined && value !== null && value !== ""
            ? true
            : `${label} is required`,
      }),
    }
  : {};

  // Shared styles
  const commonSx = {
    width,
    "& .MuiInputBase-input": {
      color: "var(--text-foreground)",
      "::placeholder": { color: "var(--text-muted)", opacity: 1 },
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--background-secondary)",
      height,
      "& fieldset": { borderColor: "var(--text-muted)" },
      "&:hover fieldset": { borderColor: "var(--text-secondary)" },
      "&.Mui-focused fieldset": { borderColor: "var(--text-primary)" },
    },
    "& .MuiInputLabel-root": {
      color: "var(--text-secondary)",
      top: height === "50px" ? "-6px" : 0,
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "var(--text-primary)" },
  };

  const dropdownSx = {
    backgroundColor: "var(--background-secondary)",
    color: "var(--text-foreground)",
    "& .MuiAutocomplete-option": {
      color: "var(--text-foreground)",
      "&[aria-selected='true']": {
        backgroundColor: "var(--background-accent)",
      },
      "&:hover, &[aria-selected='true']:hover": {
        backgroundColor: "var(--background-accent)",
      },
    },
  };

  // ✅ FIXED: Helper to find option by value
  const getOptionByValue = (val: string | number | null | undefined): OptionType | null => {
    if (val === null || val === undefined || val === "") return null;
    return options.find((opt) => opt.value === val) || null;
  };

  // ✅ FIXED: Helper to compare options (handles object vs primitive)
  const areOptionsEqual = (
    option: OptionType,
    value: OptionType | string | number | null
  ): boolean => {
    if (value === null || value === undefined) return false;
    const optionValue = option.value;
    const compareValue = typeof value === "object" ? (value as OptionType).value : value;
    return optionValue === compareValue;
  };

  // Dynamic input padding
  const inputPadding = height === "50px" ? "10px 14px" : "6px 14px";

  // ✅ FIXED: Get field error safely
  const getFieldError = (fieldName: string): FieldError | undefined => {
    return (errors as any)?.[fieldName] as FieldError | undefined;
  };

  const FormFieldError = isFormField && name ? getFieldError(name) : undefined;

  return isFormField ? (
    <Controller
      name={name!}
      control={formContext!.control}
      rules={validationRules}
      render={({ field }) => (
        <Autocomplete
          options={options}
          getOptionLabel={(opt) => opt.label || ""}
          isOptionEqualToValue={areOptionsEqual}
          value={getOptionByValue(field.value)} // ✅ FIXED: Correct mapping
          onChange={(_, newValue) => {
            field.onChange(newValue ? newValue.value : "");
          }}
          slotProps={{ paper: { sx: dropdownSx } }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              placeholder={placeholder || label}
              error={Boolean(FormFieldError)}
              helperText={FormFieldError?.message}
              required={required}
              variant="outlined"
              sx={commonSx}
              InputProps={{
                ...params.InputProps,
                sx: {
                  "& .MuiInputBase-input": {
                    padding: inputPadding,
                    height: "100%",
                    boxSizing: "border-box",
                  },
                  "& .MuiSvgIcon-root": { color: "var(--text-foreground)" },
                },
              }}
              {...otherProps}
            />
          )}
        />
      )}
    />
  ) : (
    <Autocomplete
      options={options}
      getOptionLabel={(opt) => opt.label || ""}
      isOptionEqualToValue={areOptionsEqual}
      value={getOptionByValue(controlledValue)}
      onChange={(_, newValue) => {
        controlledOnChange?.(newValue ? newValue.value : "");
      }}
      slotProps={{ paper: { sx: dropdownSx } }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder || label}
          variant="outlined"
          sx={commonSx}
          InputProps={{
            ...params.InputProps,
            sx: {
              "& .MuiInputBase-input": {
                padding: inputPadding,
                height: "100%",
                boxSizing: "border-box",
              },
              "& .MuiSvgIcon-root": { color: "var(--text-foreground)" },
            },
          }}
          {...otherProps}
        />
      )}
    />
  );
};

export default SelectSearch;