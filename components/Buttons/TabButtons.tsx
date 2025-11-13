import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

interface TabButtonProps {
    tabs: string[];
    step: number;
}


function TabButton({ tabs, step }: TabButtonProps) {
  const buttons = tabs.map((tab, index) => {
    const isActive = index + 1 === step;
    return (
      <Button
        key={tab}
        variant={isActive ? "contained" : "outlined"}
        disabled={!isActive}
      >
        {tab}
      </Button>
    );
  });

  return (
    <ButtonGroup size="large" aria-label="Large button group">
      {buttons}
    </ButtonGroup>
  );
}

export default TabButton;
