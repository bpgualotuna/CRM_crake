import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E50914] focus-visible:ring-offset-1 select-none whitespace-nowrap shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5 font-semibold',
    icon: 'p-2 w-9 h-9',
  };

  const variantStyles = {
    primary:
      'bg-[#E50914] hover:bg-[#FF1E27] text-white shadow-sm hover:shadow active:bg-[#C80710]',
    secondary:
      'bg-[#121927] hover:bg-[#1A2337] text-[#F9FAFB] border border-[#1F2B3E] dark:bg-[#121927] dark:hover:bg-[#1A2337] dark:text-[#F9FAFB] light:bg-[#F1F5F9] light:text-[#0F172A] light:hover:bg-[#E2E8F0] light:border-[#CBD5E1]',
    outline:
      'border border-[#1F2B3E] text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#121927] dark:border-[#1F2B3E] dark:text-[#94A3B8] dark:hover:text-[#F9FAFB] light:border-[#E2E8F0] light:text-[#475569] light:hover:text-[#0F172A] light:hover:bg-[#F8FAFC]',
    ghost:
      'text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#121927]/60 dark:text-[#94A3B8] dark:hover:text-[#F9FAFB] dark:hover:bg-[#121927] light:text-[#64748B] light:hover:text-[#0F172A] light:hover:bg-[#F1F5F9]',
    danger:
      'bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-500/20 dark:text-red-400',
    success:
      'bg-emerald-600/15 text-emerald-500 hover:bg-emerald-600/25 border border-emerald-500/30 dark:text-emerald-400 font-medium',
    whatsapp:
      'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow font-semibold',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
};
