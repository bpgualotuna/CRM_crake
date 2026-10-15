import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { ProcessStatus, LeadPlatform } from '../../types/crm';

interface SearchBarWithFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  platformFilter: string;
  onPlatformChange: (platform: string) => void;
  assignmentFilter: string;
  onAssignmentChange: (assignment: string) => void;
  showColdOnly: boolean;
  onColdToggle: (cold: boolean) => void;
  onReset: () => void;
  totalFiltered: number;
}

export const SearchBarWithFilters: React.FC<SearchBarWithFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  platformFilter,
  onPlatformChange,
  assignmentFilter,
  onAssignmentChange,
  showColdOnly,
  onColdToggle,
  onReset,
  totalFiltered,
}) => {
  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'all' ||
    platformFilter !== 'all' ||
    assignmentFilter !== 'all' ||
    showColdOnly;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, teléfono (+593...), o correo..."
            className="w-full pl-10 pr-9 py-2 text-sm rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-[#F9FAFB] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-800 dark:text-[#F9FAFB] focus:border-[#E50914] outline-none cursor-pointer"
          >
            <option value="all">Todos los Estados</option>
            <option value="Nuevo">Nuevo</option>
            <option value="Contactado">Contactado</option>
            <option value="Interesado">Interesado</option>
            <option value="Venta realizada">Venta realizada</option>
            <option value="No responde">No responde</option>
            <option value="Descartado">Descartado</option>
          </select>

          {/* Platform filter */}
          <select
            value={platformFilter}
            onChange={(e) => onPlatformChange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-800 dark:text-[#F9FAFB] focus:border-[#E50914] outline-none cursor-pointer"
          >
            <option value="all">Todas las Plataformas</option>
            <option value="Nextline">Nextline (WhatsApp)</option>
            <option value="Facebook">Facebook Ads</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Orgánico">Orgánico</option>
          </select>

          {/* Assignment filter */}
          <select
            value={assignmentFilter}
            onChange={(e) => onAssignmentChange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-800 dark:text-[#F9FAFB] focus:border-[#E50914] outline-none cursor-pointer"
          >
            <option value="all">Todos los Vendedores</option>
            <option value="mine">Mis Leads Asignados</option>
            <option value="unassigned">Sin Asignar (Pendientes)</option>
          </select>

          {/* Cold leads toggle button */}
          <button
            type="button"
            onClick={() => onColdToggle(!showColdOnly)}
            className={`text-xs font-bold px-3 py-2 rounded-lg border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showColdOnly
                ? 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-500/40 ring-1 ring-cyan-400/40'
                : 'bg-slate-50 dark:bg-[#090D16] text-slate-600 dark:text-[#94A3B8] border-slate-300 dark:border-[#1F2B3E] hover:border-slate-400 dark:hover:border-[#2D3F5C]'
            }`}
          >
            <span>❄️ Leads Fríos</span>
          </button>

          {/* Reset filters button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="text-xs font-bold px-2.5 py-2 rounded-lg text-slate-600 hover:text-[#E50914] dark:text-[#94A3B8] dark:hover:text-[#FF1E27] hover:bg-slate-100 dark:hover:bg-[#1A2337] transition-colors cursor-pointer flex items-center gap-1"
              title="Limpiar filtros"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
