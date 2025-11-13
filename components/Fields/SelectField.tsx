import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';

interface BasicSelectProps {
  width?: string | number | null;
  height?: string | number | null;
  backgroundColor?: string | null;
  label?: string | null;
}

const BasicSelect: React.FC<BasicSelectProps> = ({
  width = "100%",
  height = null,
  backgroundColor = null,
  label = null,
}) => {
  const [age, setAge] = React.useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel
        id="demo-simple-select-label"
        sx={{
          color: "var(--text-secondary)",
          "&.Mui-focused": { color: "var(--text-primary)" },
        }}
      >
        {label || "Age"}
      </InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={age}
        onChange={handleChange}
        sx={{
          width,
          height,
          backgroundColor: backgroundColor || "var(--background-secondary)",
          color: "var(--text-foreground)",
          "& .MuiSelect-icon": {
            color: "var(--text-foreground)", // arrow icon
            "&:hover": { color: "var(--text-primary)" },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--text-muted)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--text-secondary)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--text-primary)",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--background-secondary)",
              color: "var(--text-foreground)",
              "& .MuiMenuItem-root": {
                color: "var(--text-foreground)",
                "&:hover": { backgroundColor: "var(--background-accent)" },
                "&.Mui-selected": {
                  backgroundColor: "var(--background-accent)",
                  color: "var(--text-primary)", // highlight selected text
                },
              },
            },
          },
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default BasicSelect;
