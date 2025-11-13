// import React from 'react';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';

// interface CheckFieldProps{
//   label?:string;
//   edit:boolean;
//   setEdit: React.Dispatch<React.SetStateAction<boolean>>
// }

// const CheckboxField : React.FC<CheckFieldProps> = ({label,setEdit,edit}) => {
//   return (
//     <div>
//        <FormControlLabel control={<Checkbox/>} label={label} onClick={()=>setEdit(!edit)} />
//     </div>
//   );
// }

// export default CheckboxField;


import React from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "../../hooks/useTheme";

interface CheckFieldProps {
  label?: string;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const CheckboxField: React.FC<CheckFieldProps> = ({ label, setEdit, edit }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Colors per theme
  const borderColor = isDark ? "#94a3b8" : "#d1d5db"; // default border
  const checkedColor = isDark ? "#2563eb" : "#dc2626"; // blue for dark, red for light
  const labelColor = isDark ? "#f1f5f9" : "#111827";

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={edit}
          onChange={() => setEdit(!edit)}
          sx={{
            color: borderColor,
            "&.Mui-checked": {
              color: checkedColor,
            },
          }}
        />
      }
      label={label}
      sx={{
        color: labelColor,
        userSelect: "none",
      }}
    />
  );
};

export default CheckboxField;
