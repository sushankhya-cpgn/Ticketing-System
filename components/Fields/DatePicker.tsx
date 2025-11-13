import  React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface DatePickerComponentProps{
  label?: string | number;
  height?: string | number | null
  width?: string | number
}


export default function DatePickerComponent({width="100%",height=null,label="Select a Date"}:DatePickerComponentProps) {
  const [selectedDate, setSelectedDate] = React.useState<Dayjs|null>(dayjs());

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        sx={{width:width,height:height}}
        value={selectedDate}
        onChange={(newValue:Dayjs|null) => setSelectedDate(newValue)}
        slotProps={{
          textField:{
            fullWidth:true,
            sx: {width,height}
          }
        }}
      />
    </LocalizationProvider>
  );
}
