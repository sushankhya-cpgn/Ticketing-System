import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { useTheme } from "../../hooks/useTheme";

interface TextFieldComponentProps {
  label?: string;
  name?: string;
  register?: UseFormRegister<any>;
  errors?: FieldErrors;
  height?: string;
  width?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validation?: object;
  [key: string]: any; // other props
}

const TextFieldComponent: React.FC<TextFieldComponentProps> = ({
  label,
  name,
  register,
  errors,
  height = "50px",
  width = "100%",
  type = "text",
  placeholder,
  required = false,
  validation = {},
  ...otherProps
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // For password visibility toggle
  const [showPassword, setShowPassword] = useState(false);

  // Theme colors
  const textColor = isDark ? "#f1f5f9" : "#111827";
  const labelColor = isDark ? "#f1f5f9" : "#374151";
  const labelFocusedColor = isDark ? "#90caf9" : "#1976d2";
  const borderColor = isDark ? "#94a3b8" : "#d1d5db";
  const borderHoverColor = isDark ? "#cbd5e1" : "#111827";
  const borderFocusColor = isDark ? "#42a5f5" : "#1976d2";
  const placeholderColor = isDark ? "#94a3b8" : "#6b7280";
  const backgroundColor = isDark ? "#121a2d" : "#ffffff";

  const isFormField = register && name;

  const validationRules = isFormField
    ? {
        ...validation,
        ...(required && { required: `${label || name} is required` }),
      }
    : {};

  return (
    <TextField
      label={label}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      placeholder={placeholder || label}
      variant="outlined"
      error={isFormField ? Boolean(errors?.[name]) : false}
      helperText={
        isFormField && errors?.[name] ? (errors[name]?.message as string) : undefined
      }
      sx={{
        width,
        "& .MuiInputBase-input": {
          color: textColor,
          "::placeholder": { color: placeholderColor, opacity: 1 },
        },
        "& .MuiOutlinedInput-root": {
          backgroundColor,
          "& fieldset": { borderColor },
          "&:hover fieldset": { borderColor: borderHoverColor },
          "&.Mui-focused fieldset": { borderColor: borderFocusColor },
        },
        "& .MuiInputLabel-root": { color: labelColor },
        "& .MuiInputLabel-root.Mui-focused": { color: labelFocusedColor },
      }}
      InputProps={{
        sx: {
          height,
          display: "flex",
          alignItems: "center",
          "& input": {
            height: "100%",
            padding: "0 14px",
          },
          "& input:-webkit-autofill": {
            WebkitBoxShadow: `0 0 0 1000px ${backgroundColor} inset`,
            WebkitTextFillColor: textColor,
            caretColor: textColor,
          },
        },
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                style={{ color: textColor }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      InputLabelProps={{
        sx: {
          transform: `translate(14px, ${parseInt(height) / 2 - 10}px)`,
          "&.MuiInputLabel-shrink": {
            transform: `translate(14px, -6px) scale(0.75)`,
          },
        },
      }}
      {...(isFormField ? register(name, validationRules) : {})}
      {...otherProps}
    />
  );
};

export default TextFieldComponent;
