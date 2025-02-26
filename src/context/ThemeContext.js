import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'preferred-theme';

export const ThemeProvider = ({ children }) => {
  // Define applyTheme function first
  const applyTheme = (newTheme) => {
    const isDark = newTheme === 'vs-dark';
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
    document.body.setAttribute('data-theme', isDark ? 'dark-theme' : 'light-theme');
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';

    // Update Monaco editor theme
    if (window.monacoEditor) {
      window.monacoEditor.updateOptions({
        theme: newTheme,
        backgroundColor: isDark ? '#1e1e1e' : '#ffffff',
      });
    }
  };

  const getInitialTheme = () => {
    // Check local storage first
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) return savedTheme;
    
    // Check system preference with safety check for test environment
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        return prefersDark ? 'vs-dark' : 'vs';
      } catch (error) {
        console.warn('Error checking system theme preference:', error);
        return 'vs-dark'; // Default to dark theme if check fails
      }
    }
    
    return 'vs-dark'; // Default theme
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme on initial load
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 