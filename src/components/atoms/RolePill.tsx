import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { ShieldCheck, UserCheck } from 'lucide-react';
import { UserRole } from '../../types/crm';

export const RolePill: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { currentRole, setCurrentRole } = useCRM();

  const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      id: 'admin',
      label: 'Admin',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />,
    },
    {
      id: 'vendedor',
      label: 'Vendedor',
      icon: <UserCheck className="w-3.5 h-3.5 text-blue-400" />,
    },
  ];

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-[#121927] border border-[#1F2B3E] ${className}`}
      title="Simulador de Perfiles de Usuario"
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 hidden sm:inline-block">
        Rol:
      </span>
      {roles.map((r) => {
        const isActive = currentRole === r.id;
        return (
          <button
            key={r.id}
            onClick={() => setCurrentRole(r.id)}
            type="button"
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#E50914] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F9FAFB] hover:bg-[#1A2337]'
            }`}
          >
            {r.icon}
            <span>{r.label}</span>
          </button>
        );
      })}
    </div>
  );
};
