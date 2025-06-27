
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import type { Database } from '@/integrations/supabase/types';

type ThemePreference = Database['public']['Enums']['theme_preference'];

interface ThemeContextType {
  theme: 'light' | 'dark';
  themePreference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { profile, updateProfile } = useAuth();
  const [themePreference, setThemePreference] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (profile?.theme_preference) {
      setThemePreference(profile.theme_preference);
    }
  }, [profile]);

  useEffect(() => {
    const updateTheme = () => {
      if (themePreference === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      } else {
        setTheme(themePreference as 'light' | 'dark');
      }
    };

    updateTheme();

    if (themePreference === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addListener(updateTheme);
      return () => mediaQuery.removeListener(updateTheme);
    }
  }, [themePreference]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSetThemePreference = async (preference: ThemePreference) => {
    setThemePreference(preference);
    if (profile) {
      try {
        await updateProfile({ theme_preference: preference });
      } catch (error) {
        console.error('Error updating theme preference:', error);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    handleSetThemePreference(newTheme);
  };

  const value = {
    theme,
    themePreference,
    setThemePreference: handleSetThemePreference,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
