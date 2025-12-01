import * as React from 'react';
import Button from '@mui/material/Button';

// Make sure to define props for the function component
interface BasicButtonsProps {
  onClick: () => void;
  label: string;
  sx?: object; // Optional style customization
}

export default function BasicButtons({ onClick, label, sx }: BasicButtonsProps) {
  return (
    <Button 
      variant="text" 
      sx={{ color: 'bg--text-primary', ...sx }} // You can extend or override styles passed via sx
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
