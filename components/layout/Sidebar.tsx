import React from "react";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { usePermission } from "../../hooks/usePermission";
import {
  Home,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  File,
  User2Icon,
  Users,
  Tag,
  SquarePen,
  Layers,
  LayoutDashboard,
  Key,
  AlertTriangle,
  CircleDot,
} from "lucide-react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";


interface NavItem {
  icon?: React.ReactNode;
  label: string;
  path?: string;
  children?: NavItem[];
  //new
  taskName?: string;
}

interface DropdownMenuProps {
  items: {
    label: string;
    path?: string;
    icon?: React.ReactNode;
  }[];
  onItemClick: () => void;
  onMouseLeave: () => void;
}

const navItems: NavItem[] = [
  { icon: <Home size={18} />, label: "Dashboard", path: "/" },
  { icon: <FileText size={18} />, label: "Reports", path: "/reports" },
  {
    icon: <Settings size={18} />,
    label: "Configuration",
    children: [
      { label: "User", path: "/customers", icon: <User2Icon size={16} />, taskName: "User List" },
      { label: "Role", path: "/role", icon: <Users size={16} />, taskName: "Role List" },
      { label: "Task", path: "/task", icon: <Key size={16} />, taskName: "" },


    ],
  },
  {
    label: "Ticket",
    icon: <File size={18} />,
    children: [
      { label: "Tag", path: "/ticket/tag", icon: <Tag size={16} />, taskName: "Get All Tags" },     // direct links
      { label: "Priority", path: "/ticket/priority", icon: <AlertTriangle size={16} />, taskName: "Get All Ticket Priority" },
      { label: "Status", path: "/ticket/status", icon: <CircleDot size={16} />, taskName: "Get All Ticket Status" },
      { label: "Create Ticket", path: "/ticket/createticket", icon: <SquarePen size={16} />, taskName: "Create Ticket" },
      { label: "Tickets", path: "/ticket", icon: <Layers size={16} />, taskName: "Ticket List" },
      { label: "Kanban Board", path: "/board", icon: <LayoutDashboard size={16} />, taskName: "View All Ticket Board" },


    ],
  }
];


function DropdownMenu({
  items,
  onMouseLeave,
  onItemClick,
}: DropdownMenuProps) {
  const navigate = useNavigate();

  return (
    <Paper
      onMouseLeave={onMouseLeave}
      elevation={4}
      sx={{
        width: 240,
        backgroundColor: "var(--background)",
        color: "var(--text-foreground)",
        borderRadius: 1,
      }}
    >
      <MenuList dense>
        {items.map((item, i) => (
          <MenuItem
            key={i}
            onClick={() => {
              if (item.path) navigate(item.path);
              onItemClick();
            }}
            sx={{
              "&:hover": {
                backgroundColor: "var(--background-secondary)",
              },
            }}
          >
            {item.icon && (
              <ListItemIcon sx={{ color: "var(--text-foreground)", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
            )}
            <ListItemText>{item.label}</ListItemText>
          </MenuItem>
        ))}
      </MenuList>
    </Paper>
  );
}

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const { hasPermission } = usePermission();

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };


  const handleMouseEnter = (label: string) => {
    if (!isOpen) {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setHoveredMenu(label);
      setDropdownVisible(true); // show dropdown on hover
    }
  };

  const handleMouseLeaves = () => {
    // delay hiding slightly so user can move cursor to dropdown
    hoverTimeoutRef.current = window.setTimeout(() => {
      setDropdownVisible(false);
      setHoveredMenu(null);
    }, 200);
  };

  const handleMenuItemClick = () => {
    setDropdownVisible(false);
    setHoveredMenu(null);
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`h-screen shadow-sm flex flex-col transition-all duration-300 relative ${isOpen ? "w-64" : "w-16"
        }`}
      style={{
        background: "var(--background-secondary)",
        borderColor: "var(--text-muted)",
      }}
    >
      {/* Logo */}
      <div className="p-6 flex items-center justify-center">
        {isOpen ? (
          <img
            src="/images/logo2.png"
            alt="Application Logo"
            className="max-w-full max-h-[100px] h-15"
          />
        ) : (
          <span
            className="text-lg font-bold"
            style={{ color: "var(--text-foreground)" }}
          >
            Salico
          </span>
        )}
      </div>

      {/* Nav Items */}
     
      <nav className="flex-1 p-3 space-x-3">
        {navItems.map((item, i) => {
  // 🔥 FILTER CHILDREN BY PERMISSION FIRST
  const allowedChildren =
    item.children?.filter(
      (sub) => !sub.taskName || hasPermission(sub.taskName)
    ) ?? [];

  // 🚫 Hide entire parent if it has children but none allowed
  if (item.children && allowedChildren.length === 0) return null;

  if (item.children) {
    return (
      <div
        key={i}
        className="relative group"
        onMouseEnter={() => handleMouseEnter(item.label)}
        onMouseLeave={handleMouseLeaves}
      >
        <button
          onClick={() => isOpen && toggleMenu(item.label)}
          className="w-full flex items-center justify-between p-2 rounded-md transition-colors duration-200 hover:bg-[var(--background)]"
          style={{ color: "var(--text-foreground)" }}
        >
          <div className="flex items-center space-x-3">
            <span>{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </div>
          {isOpen &&
            (openMenus[item.label] ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            ))}
        </button>

        {/* 🟣 Collapsed Sidebar Dropdown */}
        {!isOpen &&
          hoveredMenu === item.label &&
          isDropdownVisible &&
          allowedChildren.length > 0 && (
            <div className="absolute left-full top-0 ml-2 z-50">
              <DropdownMenu
                items={allowedChildren.map((sub) => ({
                  label: sub.label,
                  path: sub.path,
                  icon: sub.icon,
                }))}
                onItemClick={handleMenuItemClick}
                onMouseLeave={handleMouseLeaves}
              />
            </div>
          )}

        {/* 🟢 Expanded Sidebar Submenu */}
        {isOpen && openMenus[item.label] && allowedChildren.length > 0 && (
          <div className="ml-8 space-y-1">
            {allowedChildren.map((sub, j) => (
              <NavLink
                key={j}
                to={sub.path ?? "#"}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-md text-sm ${
                    isActive
                      ? "bg-[var(--background)] font-semibold"
                      : "hover:bg-[var(--background)]"
                  }`
                }
              >
                {sub.icon && <span className="shrink-0">{sub.icon}</span>}
                <span>{sub.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 🔹 Normal Nav Item (no children)
  return (
    <NavLink
      key={i}
      to={item.path!}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${
          isActive
            ? "bg-[var(--background)] font-semibold"
            : "hover:bg-[var(--background)]"
        }`
      }
      style={{ color: "var(--text-foreground)" }}
      aria-label={!isOpen ? item.label : undefined}
      title={!isOpen ? item.label : undefined}
    >
      <span>{item.icon}</span>
      {isOpen && <span>{item.label}</span>}
    </NavLink>
  );
})}

      </nav>
    </div>
  );
}