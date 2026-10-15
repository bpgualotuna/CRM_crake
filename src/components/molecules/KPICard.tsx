import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subValue,
  trend,
  icon,
  iconBgColor = 'bg-red-50 text-[#E50914] dark:bg-[#E50914]/10 dark:text-[#E50914] border border-red-200 dark:border-[#E50914]/20',
  className = '',
}) => {
  return (
    <div
      className={`p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-[#2D3F5C] hover:-translate-y-0.5 transition-all flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] tracking-wider uppercase">
            {title}
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-[#F9FAFB] tracking-tight font-mono tabular-nums mt-1">
            {value}
          </span>
        </div>
        <div className={`p-2.5 rounded-xl shrink-0 ${iconBgColor}`}>{icon}</div>
      </div>

      {(subValue || trend) && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60 text-xs">
          {trend && (
            <span
              className={`font-semibold inline-flex items-center gap-1 font-mono tabular-nums ${
                trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
          )}
          {subValue && (
            <span className="text-slate-500 dark:text-[#64748B] truncate">{subValue}</span>
          )}
        </div>
      )}
    </div>
  );
};
