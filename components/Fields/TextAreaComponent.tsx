import React from 'react';
import { TextareaAutosize, Typography } from "@mui/material";
import  type { FieldErrors, UseFormRegister } from 'react-hook-form';

interface TextAreaComponent{
  label?: string;
  name?: string;
  register?:UseFormRegister<any>;
  required?:boolean;
  errors?:FieldErrors;
  height?:string;
  width?:string;
  validation?:object;
  value?:string;
  onChange?:(event:React.ChangeEvent<HTMLTextAreaElement>)=>void;
  placeholder?:string;
  [key:string]: any;

}

const TextAreaComponent:React.FC<TextAreaComponent> = ({
  label,
  name,
  register,
  required = false,
  errors,
  height = "12px",
  width = "100%",
  validation = {},
  value,
  onChange,
  placeholder,
  ...otherProps
}) => {
  const isFormField = register && name;

  const validationRules = isFormField
    ? {
        ...validation,
        ...(required && { required: `${label} is required` })
      }
    : {};

  const formProps = isFormField
    ? {
        ...register(name, validationRules),
      }
    : {};

  const nonFormProps = !isFormField
    ? {
        value,
        onChange,
        placeholder: placeholder || label,
        ...otherProps,
      }
    : {};

  const hasError = !!(name && errors?.[name]);

  return (
    <div style={{ width }}>
      {label && (
        <Typography variant="subtitle2" gutterBottom>
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      )}
      <TextareaAutosize
        minRows={4}
        placeholder={placeholder || label}
        style={{
          width: "100%",
          height,
          padding: "10px",
          border: hasError ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
          resize: "vertical",
          fontSize: "1rem",
          boxSizing: "border-box",
        }}
        {...formProps}
        {...nonFormProps}
      />
    </div>
  );
}

export default TextAreaComponent;
