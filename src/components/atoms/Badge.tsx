import React from 'react';
import { ProcessStatus, Priority, LeadPlatform } from '../../types/crm';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?:
    | 'status'
    | 'priority'
    | 'platform'
    | 'nextline'
    | 'cold'
    | 'verified'
    | 'default';
  status?: ProcessStatus;
  priority?: Priority;
  platform?: LeadPlatform;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  priority,
  platform,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  const baseClasses =
    'inline-flex items-center font-medium rounded-md whitespace-nowrap select-none transition-colors';

  if (variant === 'status' && status) {
    const statusStyles: Record<ProcessStatus, string> = {
      Nuevo:
        'bg-blue-500/10 text-blue-400 border border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300 light:bg-blue-50 light:text-blue-700 light:border-blue-200',
      Contactado:
        'bg-amber-500/10 text-amber-400 border border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300 light:bg-amber-50 light:text-amber-700 light:border-amber-200',
      Interesado:
        'bg-purple-500/10 text-purple-400 border border-purple-500/30 dark:bg-purple-500/15 dark:text-purple-300 light:bg-purple-50 light:text-purple-700 light:border-purple-200',
      'Venta realizada':
        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold dark:bg-emerald-500/20 dark:text-emerald-300 light:bg-emerald-50 light:text-emerald-700 light:border-emerald-300',
      'No responde':
        'bg-slate-500/15 text-slate-400 border border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-300 light:bg-slate-100 light:text-slate-600',
      Descartado:
        'bg-red-500/10 text-red-400 border border-red-500/30 dark:bg-red-500/15 dark:text-red-300 light:bg-red-50 light:text-red-700 light:border-red-200',
    };

    return (
      <span className={`${baseClasses} ${sizeClasses[size]} ${statusStyles[status]} ${className}`}>
        {children || status}
      </span>
    );
  }

  if (variant === 'priority' && priority) {
    const priorityStyles: Record<Priority, string> = {
      Alta: 'bg-[#E50914]/15 text-[#FF3E47] border border-[#E50914]/30 font-semibold',
      Media: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
      Baja: 'bg-slate-500/10 text-slate-400 border border-slate-500/30',
    };

    return (
      <span className={`${baseClasses} ${sizeClasses[size]} ${priorityStyles[priority]} ${className}`}>
        {children || `Prioridad ${priority}`}
      </span>
    );
  }

  if (variant === 'nextline') {
    return (
      <span
        className={`${baseClasses} ${sizeClasses[size]} bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
        {children}
      </span>
    );
  }

  if (variant === 'cold') {
    return (
      <span
        className={`${baseClasses} ${sizeClasses[size]} bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium ${className}`}
      >
        ❄️ Lead Frío
      </span>
    );
  }

  if (variant === 'platform' && platform) {
    const platformColors: Record<LeadPlatform, string> = {
      Nextline: 'bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30',
      Facebook: 'bg-blue-600/15 text-blue-400 border border-blue-600/30',
      TikTok: 'bg-pink-500/15 text-pink-400 border border-pink-500/30',
      Instagram: 'bg-purple-600/15 text-purple-400 border border-purple-600/30',
      Delegado: 'bg-amber-600/15 text-amber-400 border border-amber-600/30',
      Orgánico: 'bg-slate-600/15 text-slate-300 border border-slate-600/30',
    };
    return (
      <span
        className={`${baseClasses} ${sizeClasses[size]} ${platformColors[platform]} ${className}`}
      >
        {children || platform}
      </span>
    );
  }

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} bg-[#1A2337] text-[#94A3B8] border border-[#1F2B3E] ${className}`}
    >
      {children}
    </span>
  );
};
