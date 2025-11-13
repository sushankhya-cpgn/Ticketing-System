import React from 'react';
import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { useFormContext, type FieldErrors, type UseFormRegister } from 'react-hook-form';

interface RomanToNepaliInputProps {
  label?: string;
  name?: string;
  register?: UseFormRegister<any>;
  // register?: UseFormRegister<FieldValues>;

  required?: boolean;
  errors?: FieldErrors;
  height?: string;
  width?: string;
  validation?: object;
  placeholder?: string;
  value?: string;
  onChange?: (value:string) => void;
  [key: string]: any;
}

const unicodeRomanToNepaliMap = [
  '\u0020', '\u0021', '\u0953', '\u0023', '\u0024', '\u0025', '\u0026', '\u0027',
  '\u0028', '\u0029', '\u002A', '\u200C', '\u002C', '\u002D', '\u0964', '\u094D',
  '\u0966', '\u0967', '\u0968', '\u0969', '\u096A', '\u096B', '\u096C', '\u096D',
  '\u096E', '\u096F', '\u003A', '\u003B', '\u0919', '\u200D', '\u002E', '\u003F',
  '\u0040', '\u0906', '\u092D', '\u091B', '\u0927', '\u0948', '\u090A', '\u0918',
  '\u0905', '\u0940', '\u091D', '\u0916', '\u0965', '\u0902', '\u0923', '\u0913',
  '\u092B', '\u0920', '\u0943', '\u0936', '\u0925', '\u0942', '\u0901', '\u0914',
  '\u0922', '\u091E', '\u090B', '\u0907', '\u0950', '\u090F', '\u005E', '\u0952',
  '\u093D', '\u093E', '\u092C', '\u091A', '\u0926', '\u0947', '\u0909', '\u0917',
  '\u0939', '\u093F', '\u091C', '\u0915', '\u0932', '\u092E', '\u0928', '\u094B',
  '\u092A', '\u091F', '\u0930', '\u0938', '\u0924', '\u0941', '\u0935', '\u094C',
  '\u0921', '\u092F', '\u0937', '\u0908', '\u0903', '\u0910', '\u093C',
];

function mapCharToNepali(char: string) {
  const code = char.charCodeAt(0);
  if (code >= 32 && code < 32 + unicodeRomanToNepaliMap.length) {
    return unicodeRomanToNepaliMap[code - 32];
  }
  return char;
}

export default function RomanToNepaliInput({
  label,
  name,
  register,
  required = false,
  errors,
  height = '50px',
  width = '100%',
  validation = {},
  placeholder,
  value,
  onChange,
  ...otherProps
}: RomanToNepaliInputProps) {
  const { setValue, watch } = useFormContext() || {};
  const isFormField = register && name;

  // For form fields, watch the form value
  const formValue = isFormField && name ? watch(name) : undefined;

  // For non-form, use local state
  const [localValue, setLocalValue] = useState(value || '');

  const currentValue = isFormField ? (formValue || '') : localValue;

  // If input is form field combine the provided validation rule with a required rule if required is true
  const validationRules = isFormField
    ? {
        ...validation,
        ...(required && { required: `${label || name} is required` }),
      }
    : {};

  // Handle errors safely for helperText
  const helperText = errors && name && errors[name] ? String(errors[name]?.message) : undefined;

  const formProps = isFormField
    ? {
        error: Boolean(errors && name && errors[name]),
        helperText,
        required,
      }
    : {};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const converted = [...input].map(mapCharToNepali).join('');

    if (isFormField && setValue && name) {
      setValue(name, converted, { shouldValidate: true, shouldDirty: true });
    }

    if (!isFormField) {
      setLocalValue(converted);
      if (onChange) onChange(converted);
    }
  };

  useEffect(() => {
    if (!isFormField) {
      setLocalValue(value || '');
    }
  }, [value, isFormField]);

  // Register props for react-hook-form
  const registerProps = isFormField && name ? register(name, validationRules) : undefined;

  return (
    <TextField
      label={label}
      name={name}
      value={currentValue}
      onChange={handleInputChange}
      inputRef={registerProps?.ref}
      placeholder={placeholder || label}
      type="text"
      variant="outlined"
      sx={{ width }}
       InputProps={{
        sx: {
          height,
          display: 'flex', // Ensure the input container uses flexbox
          alignItems: 'center', // Center the content vertically
          '& input': {
            height: '100%', // Make the input fill the container height
            display: 'flex',
            alignItems: 'center', // Center the text vertically
            padding: '0 14px', // Adjust padding to match Material-UI default
          },
        },
      }}

        InputLabelProps={{
        sx: {
          // Adjust the label's position to be centered vertically
          transform: `translate(14px, ${parseInt(height) / 2 - 10}px)`, // Adjust based on height
          '&.MuiInputLabel-shrink': {
            transform: `translate(14px, -6px) scale(0.75)`, // Default shrink behavior
          },
        },
      }}
      
      {...formProps}
      {...otherProps}
    />
  );
}