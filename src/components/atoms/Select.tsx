import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
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
      <div className="relative">
        <select
          id={generatedId}
          className={`w-full appearance-none rounded-lg px-3.5 py-2 pr-9 text-sm transition-colors duration-150 outline-none cursor-pointer
            bg-[#121927] border border-[#1F2B3E] text-[#F9FAFB]
            focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]
            dark:bg-[#121927] dark:border-[#1F2B3E] dark:text-[#F9FAFB]
            light:bg-[#FFFFFF] light:border-[#CBD5E1] light:text-[#0F172A]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : ''}
            ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="bg-[#121927] text-[#F9FAFB] dark:bg-[#121927] dark:text-[#F9FAFB] light:bg-white light:text-slate-900"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#94A3B8]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};
