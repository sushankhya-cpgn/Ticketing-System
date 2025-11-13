import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import DropdownMenu from "./DropdownMenu";

interface NavItem {
  icon?: React.ReactNode;
  label: string;
  path?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { icon: <Home size={18} />, label: "Dashboard", path: "/" },
  { icon: <FileText size={18} />, label: "Reports", path: "/reports" },
  {
    icon: <Settings size={18} />,
    label: "Configuration",
    children: [
      { label: "User", path: "/customers" },
      { label: "Role", path: "/role" },
      { label: "Task", path: "/task" },

      // Expandable parent — no path
      {
        label: "Ticket Configuration",
        children: [
          { label: "Tag", path: "/ticket/tag" },     // direct links
          { label: "Priority", path: "/ticket/priority" },
          { label: "Status", path: "/ticket/status" },
          { label: "Create Ticket", path: "/ticket/createticket" },


        ],
      }
    ],
  }
  ,
  {
    icon: <Settings size={18} />,
    label: "Settings",
    children: [
      { label: "Profile", path: "/settings/profile" },
      { label: "Billing", path: "/settings/billing" },
    ],
  },
  { icon: <HelpCircle size={18} />, label: "Help", path: "/help" },
];

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

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
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item, i) => {
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

                {/* Collapsed Sidebar → Floating Submenu with Bridge */}
                {!isOpen && hoveredMenu === item.label && isDropdownVisible && (
                  <div className="absolute left-full top-0 ml-2 z-50">
                    <DropdownMenu
                      // items={item.children!}       // pass submenu items
                      onItemClick={handleMenuItemClick}
                      onMouseLeave={handleMouseLeaves}
                    />
                  </div>
                )}

                {/* Expanded Sidebar → Inline Submenu */}
                {isOpen && openMenus[item.label] && (
                  <div className="ml-8 space-y-1">
                    {item.children.map((sub, j) => {

                      // ✅ If item has its own children (Expandable)
                      if (sub.children) {
                        const isSubOpen = openMenus[sub.label];

                        return (
                          <div key={j}>
                            <button
                              onClick={() => toggleMenu(sub.label)}
                              className="flex items-center justify-between w-full p-2 text-sm rounded-md hover:bg-[var(--background)]"
                            >
                              {sub.label}
                              {isSubOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>

                            {isSubOpen && (
                              <div className="ml-6 space-y-1">
                                {sub.children.map((nested, k) => (
                                  <NavLink
                                    key={k}
                                    to={nested.path ?? "#"}
                                    className={({ isActive }) =>
                                      `block p-2 rounded-md text-sm transition ${isActive ? "bg-[var(--background)] font-semibold"
                                        : "hover:bg-[var(--background)]"
                                      }`
                                    }
                                  >
                                    {nested.label}
                                  </NavLink>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // ✅ Normal link submenu
                      return (
                        <NavLink
                          key={j}
                          to={sub.path ?? "#"}
                          className={({ isActive }) =>
                            `block p-2 rounded-md text-sm ${isActive ? "bg-[var(--background)] font-semibold"
                              : "hover:bg-[var(--background)]"
                            }`
                          }
                        >
                          {sub.label}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Normal Nav Item
          return (
            <NavLink
              key={i}
              to={item.path!}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-2 rounded-md transition-colors duration-200 ${isActive
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