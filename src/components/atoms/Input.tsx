import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const generatedId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={generatedId}
          className="text-xs font-semibold text-[#94A3B8] dark:text-[#94A3B8] light:text-[#475569]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-[#64748B] pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}
        <input
          id={generatedId}
          className={`w-full rounded-lg px-3.5 py-2 text-sm transition-colors duration-150 outline-none
            bg-[#121927] border border-[#1F2B3E] text-[#F9FAFB] placeholder:text-[#64748B]
            focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]
            dark:bg-[#121927] dark:border-[#1F2B3E] dark:text-[#F9FAFB]
            light:bg-[#FFFFFF] light:border-[#CBD5E1] light:text-[#0F172A] light:placeholder:text-[#94A3B8]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#64748B] dark:text-[#64748B] light:text-[#94A3B8]">
          {helperText}
        </span>
      )}
    </div>
  );
};
