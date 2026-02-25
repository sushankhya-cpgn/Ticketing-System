// import  React from 'react';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import dayjs, { Dayjs } from 'dayjs';

// interface DatePickerComponentProps{
//   label?: string | number;
//   height?: string | number | null
//   width?: string | number
// }


// export default function DatePickerComponent({width="100%",height=null,label="Select a Date"}:DatePickerComponentProps) {
//   const [selectedDate, setSelectedDate] = React.useState<Dayjs|null>(dayjs());

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DatePicker
//         label={label}
//         sx={{width:width,height:height}}
//         value={selectedDate}
//         onChange={(newValue:Dayjs|null) => setSelectedDate(newValue)}
//         slotProps={{
//           textField:{
//             fullWidth:true,
//             sx: {width,height}
//           }
//         }}
//       />
//     </LocalizationProvider>
//   );
// }


import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

interface DatePickerComponentProps {
  name: string;
  label?: string;
  width?: string | number;
  height?: string | number | null;
}

export default function DatePickerComponent({
  name,
  label = "Select a Date",
  width = "100%",
  height = null,
}: DatePickerComponentProps) {
  const { control } = useFormContext();

  return (
    <Controller
  name={name}
  control={control}
  defaultValue={dayjs()} // ensure defaultValue is a Dayjs object
  render={({ field }) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={field.value ? dayjs(field.value) : null} // <-- wrap in dayjs()
        onChange={(newValue: Dayjs | null) => field.onChange(newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            sx: { width, height },
          },
        }}
      />
    </LocalizationProvider>
  )}
/>

  );
}
