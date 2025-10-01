
import React from 'react';
import { PlantIcon, SunIcon, MoonIcon } from './IconComponents';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <PlantIcon className="h-8 w-8 text-green-600 mr-3"/>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-300 tracking-tight">
            Plant Pal <span className="font-light text-gray-500 dark:text-gray-400">| Disease Diagnosis</span>
            </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <MoonIcon className="h-6 w-6" />
          ) : (
            <SunIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </header>
  );
};
