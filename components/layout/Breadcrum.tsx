import { Link as RouterLink, useLocation } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

// Map path → human-friendly label
const breadcrumbNameMap: Record<string, string> = {
  "/": "Dashboard",
  "/reports": "Reports",
  "/customers": "Customers",
  "/customers/123": "Customer Details",
  "/customers/edituser/4": "Edit",
  "/settings": "Settings",
  "/settings/profile": "Profile Settings",
  "/help": "Help Center",
  "/role": "Role",
  "/role/addrole": "Add Role",
  "/role/editrole": "Edit Role"
};

export default function BreadcrumbNav() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="shadow-sm px-6 py-3" style={{ background: "var(--background-secondary)" }}>
      <Breadcrumbs aria-label="breadcrumb"  >
        {/* Always show Home */}
        <Link component={RouterLink} underline="hover" color="inherit" to="/" style={{ color: "var(--text-muted)" }}>
          {breadcrumbNameMap["/"] || "Home"}
        </Link>

        {pathnames.map((value, index) => {
          const isLast = index === pathnames.length - 1;

          // Skip numeric values (route params like /4)
          if (!isNaN(Number(value))) return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          // Handle dynamic route like /role/editrole/:id
          let label = breadcrumbNameMap[to] || capitalize(value);
          if (to.startsWith("/role/editrole")) label = "Edit Role";

          return isLast ? (
            <Typography key={to} sx={{ color: "var(--text-foreground)" }}>
              {label}
            </Typography>
          ) : (
            <Link
              key={to}
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={to}
            >
              {label}
            </Link>
          );
        })}

      </Breadcrumbs>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
