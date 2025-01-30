"use client";

import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="inline-flex items-center justify-center rounded-full border-0 bg-gray-200 p-2 text-gray-500 transition duration-300 ease-in-out hover:bg-gray-300 focus:outline-none dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
        <span className="sr-only">
          {theme === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
        </span>
        {theme === "dark" ? (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>
      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-400">
        {theme === "dark" ? "Escuro" : "Claro"}
      </span>
    </div>
  );
};

export default ThemeSwitch;
