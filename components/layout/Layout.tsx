import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BreadcrumbNav from "./Breadcrum";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(true);

  return (
    <div className="flex">
      {/* Left Main Sidebar */}
      <Sidebar isOpen={isOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ">
        <Navbar isOpen={isOpen} toggleSidebar={() => setIsOpen((prev) => !prev)} />
        <BreadcrumbNav />

        <div className="flex h-full" style={{ background: "var(--background)" }}>
          {/* Page Content */}
          <main className="flex-1 p-6 h-full" style={{ background: "var(--background)" }}>
            {children}
          </main>

          {/* Right Slim Sidebar */}
          <div className="relative shadow-sm"  style={{
                background: "var(--background-minisidebar)",
                borderColor: "var(--text-muted)",
              }}>
            <aside
              className={`flex flex-col items-center py-4 space-y-6 transition-all duration-300 ${isMiniSidebarOpen ? 'w-16 overflow-hidden' : 'w-0 overflow-hidden'}`}
              style={{
                background: "var(--background-minisidebar)",
                borderColor: "var(--text-muted)",
              }}
            >
              {/* MiniSidebar Toggle Button */}
              <button
                onClick={() => setIsMiniSidebarOpen((prev) => !prev)}
                className="p-2 rounded-md hover:bg-[var(--background)] transition-all duration-200"
                style={{ color: "var(--text-foreground)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isMiniSidebarOpen ? 'rotate-0' : 'rotate-180'}`}
                >
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
              
              {/* Divider */}
              <div 
                className="w-8 h-px" 
                style={{ background: "var(--text-muted)", opacity: 0.3 }}
              ></div>

              {/* Example icons */}
              <button className="p-2 rounded-md hover:bg-[var(--background)] transition">
                📊
              </button>
              <button className="p-2 rounded-md hover:bg-[var(--background)] transition">
                ⚙️
              </button>
              <button className="p-2 rounded-md hover:bg-[var(--background)] transition">
                ❓
              </button>
            </aside>

            {/* Always visible toggle button when sidebar is closed */}
            {!isMiniSidebarOpen && (
              <button
                onClick={() => setIsMiniSidebarOpen(true)}
                className="absolute top-4 right-0 w-8 h-10 flex items-center justify-center rounded-l-md shadow-md hover:bg-[var(--background-accent)] transition-all duration-200 z-10"
                style={{
                  background: "var(--background-secondary)",
                  borderLeft: "1px solid var(--text-muted)",
                  borderTop: "1px solid var(--text-muted)",
                  borderBottom: "1px solid var(--text-muted)",
                  color: "var(--text-foreground)"
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}