import React from "react";
import { Tooltip } from "@mui/material";
import { usePermission } from "../../hooks/usePermission";

interface ProtectedActionProps {
  permission: string;
  title: string;
  onClick?: () => void;
  children: React.ReactNode;
  hideIfInvalid?: boolean; // Optional: hide element if task doesn’t exist
}

const ProtectedAction: React.FC<ProtectedActionProps> = ({
  permission,
  title,
  onClick,
  children,
  hideIfInvalid = false,
}) => {
  const { hasPermission } = usePermission();
  const allowed = hasPermission(permission);

  if (hideIfInvalid && !allowed) return null;

  return (
    <Tooltip title={allowed ? title : `Task not available: ${permission}`}>
      <span
        style={{
          cursor: allowed ? "pointer" : "not-allowed",
          opacity: allowed ? 1 : 0.5,
          pointerEvents: allowed ? "auto" : "none",  
        }}
        onClick={() => {
          if (allowed && onClick) onClick();
        }}
      >
        {children}
      </span>
    </Tooltip>
  );
};

export default ProtectedAction;
