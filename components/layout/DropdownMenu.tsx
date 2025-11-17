
import * as React from "react";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";
import ContentCut from "@mui/icons-material/ContentCut";
import ContentCopy from "@mui/icons-material/ContentCopy";
import ContentPaste from "@mui/icons-material/ContentPaste";
import Cloud from "@mui/icons-material/Cloud";
import { Logout } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import type { AppDispatch } from "../../app/store";
import { logoutUser } from "../../features/user/authslice";
import { useNavigate } from "react-router-dom";

type Props = {
  onItemClick: (item: string) => void;
  onMouseLeave: () => void;
};



export default function DropdownMenu({ onItemClick, onMouseLeave }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (err: any) {
      toast.error(err?.message ?? "Logout failed");
    }
  };

  return (
    <Paper
      onMouseLeave={onMouseLeave}
      sx={{
        width: 320,
        maxWidth: "100%",
        backgroundColor: "var(--background)",
        color: "var(--text-foreground)",
      }}
    >
      <MenuList>
        <MenuItem onClick={() => onItemClick("cut")}>
          <ListItemIcon sx={{ color: "var(--text-foreground)" }}>
            <ContentCut fontSize="small" />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="body2" sx={{ color: "var(--text-foreground)" }}>
            ⌘X
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => onItemClick("copy")}>
          <ListItemIcon sx={{ color: "var(--text-foreground)" }}>
            <ContentCopy fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" sx={{ color: "var(--text-foreground)" }}>
            ⌘C
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => onItemClick("paste")}>
          <ListItemIcon sx={{ color: "var(--text-foreground)" }}>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText>Paste</ListItemText>
          <Typography variant="body2" sx={{ color: "var(--text-foreground)" }}>
            ⌘V
          </Typography>
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => onItemClick("web-clipboard")}>
          <ListItemIcon sx={{ color: "var(--text-foreground)" }}>
            <Cloud fontSize="small" />
          </ListItemIcon>
          <ListItemText>Web Clipboard</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout();
            onItemClick("logout");
          }}
        >
          <ListItemIcon sx={{ color: "var(--text-foreground)" }}>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
