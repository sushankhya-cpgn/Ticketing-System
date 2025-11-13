import { useTheme } from "../hooks/useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-md border transition-all duration-200
                 border-gray-300 dark:border-gray-600
                 bg-white dark:bg-gray-800 
                 text-gray-900 dark:text-gray-100
                 hover:bg-gray-50 dark:hover:bg-gray-700
                 shadow-sm hover:shadow-md"
      style={{
        backgroundColor: theme === 'dark' ? '#374151' : '#ffffff',
        color: theme === 'dark' ? '#f3f4f6' : '#111827',
        borderColor: theme === 'dark' ? '#6b7280' : '#d1d5db'
      }}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

export default ThemeToggle;