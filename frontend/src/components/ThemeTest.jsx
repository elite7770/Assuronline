import React from 'react';
import { useTheme } from '../shared/context/ThemeContext';

const ThemeTest = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme) => {
    console.log('🎨 ThemeTest: Changing theme to', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Theme Test Component
      </h3>
      
      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current theme: <span className="font-medium text-blue-600 dark:text-blue-400">{theme}</span>
        </p>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleThemeChange('light')}
            className={`px-3 py-1 rounded text-sm ${
              theme === 'light' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => handleThemeChange('dark')}
            className={`px-3 py-1 rounded text-sm ${
              theme === 'dark' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => handleThemeChange('auto')}
            className={`px-3 py-1 rounded text-sm ${
              theme === 'auto' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Auto
          </button>
        </div>
        
        <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            This component should change appearance when theme changes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeTest;
