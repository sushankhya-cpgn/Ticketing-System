
import { Search, User, Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";
import { useState, useCallback, useEffect } from "react";
import NepaliDate from "nepali-date-converter";
import DropdownMenu from "./DropdownMenu";
// import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import NotificationBell from "../Notification/Notification";


const getNepaliDate = () => new NepaliDate(new Date()).format("YYYY-MM-DD");

export default function Navbar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const handleMenuItemClick = useCallback(() => setDropdownVisible(false), []);
  const handleMouseLeaves = useCallback(() => setDropdownVisible(false), []);
  const handleDropdownToggle = useCallback(() => setDropdownVisible((prev) => !prev), []);
  const [username,setUsername] = useState<string|null>("");
  const displayName = useSelector((state:RootState)=>state.auth.displayName);
  
  useEffect(()=>{

    try{
      // const {displayName} =  JSON.parse(Cookies.get("userInfo") || "")
      
      // console.log(Cookies.get("userInfo"));
      setUsername(displayName);
    }
    catch(err){
      console.error(err)
    }
  },[displayName])


  return (
    <div
      className="flex items-center justify-between px-6 py-3  shadow-md"
      style={{ background: "var(--background-secondary)", borderColor: "var(--text-muted)" }}
    >
      {/* Left */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-[var(--background)] transition-colors duration-200"
          style={{ color: "var(--text-foreground)" }}
          aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          ☰
        </button>

        <h2 className="font-semibold" style={{ color: "var(--text-foreground)" }}>
          {new Date().toDateString()} ({getNepaliDate()})
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        <Search className="cursor-pointer hover:opacity-75" size={20} style={{ color: "var(--text-foreground)" }} />
        {/* <Bell className="cursor-pointer hover:opacity-75" size={20} style={{ color: "var(--text-foreground)" }} /> */}
        <NotificationBell />

        {theme === "light" ? (
          <Moon size={20} onClick={toggleTheme} className="cursor-pointer" style={{ color: "var(--text-foreground)" }} />
        ) : (
          <Sun size={20} onClick={toggleTheme} className="cursor-pointer" style={{ color: "var(--text-foreground)" }} />
        )}

        <div>Hello {username}</div>

        {/* Profile dropdown */}
        <div className="relative ">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center  cursor-pointer"
            style={{ backgroundColor: "var(--background-secondary)", border: "1px solid var(--text-muted)" }}
            onClick={handleDropdownToggle}
          >
            <User size={18} style={{ color: "var(--text-foreground)" }} />


          </button>

          {isDropdownVisible && (
            <div className="absolute right-0 mt-2 z-50">
              <DropdownMenu onItemClick={handleMenuItemClick} onMouseLeave={handleMouseLeaves} />
            </div>
          )}
        </div>
       

      </div>
    </div>
  );
}
