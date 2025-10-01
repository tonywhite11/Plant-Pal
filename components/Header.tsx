
import React from 'react';
import { PlantIcon } from './IconComponents';

export const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
            <PlantIcon className="h-8 w-8 text-green-600 mr-3"/>
            <h1 className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-300 tracking-tight">
            Plant Pal <span className="font-light text-gray-500 dark:text-gray-400">| Disease Diagnosis</span>
            </h1>
        </div>
      </div>
    </header>
  );
};