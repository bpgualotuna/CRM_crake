import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Sun, Moon } from 'lucide-react';

export const ToggleTheme: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useCRM();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-lg text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#121927] border border-[#1F2B3E] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] ${className}`}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
    </button>
  );
};
