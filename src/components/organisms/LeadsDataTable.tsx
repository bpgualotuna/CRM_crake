import React, { useState, useMemo } from 'react';
import { Lead, Priority, ProcessStatus } from '../../types/crm';
import { Badge } from '../atoms/Badge';
import { AttemptCounter } from '../molecules/AttemptCounter';
import { useCRM } from '../../context/CRMContext';
import {
  Phone,
  MessageSquare,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  ChevronRight,
  UserCheck,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';

interface LeadsDataTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  selectedLeadId?: string | null;
  pageSize?: number;
}

export const LeadsDataTable: React.FC<LeadsDataTableProps> = ({
  leads,
  onSelectLead,
  selectedLeadId,
  pageSize = 10,
}) => {
  const { openModal, updateLeadPriority } = useCRM();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<'priority' | 'attempts' | 'createdTime'>('createdTime');
  const [sortAsc, setSortAsc] = useState(false);

  const priorityWeights: Record<Priority, number> = {
    Alta: 3,
    Media: 2,
    Baja: 1,
  };

  const sortedLeads = useMemo(() => {
    return [...leads].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'priority') {
        comparison = priorityWeights[b.priority] - priorityWeights[a.priority];
      } else if (sortField === 'attempts') {
        comparison = b.attempts - a.attempts;
      } else if (sortField === 'createdTime') {
        comparison = new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime();
      }
      return sortAsc ? -comparison : comparison;
    });
  }, [leads, sortField, sortAsc]);

  const totalPages = Math.ceil(sortedLeads.length / pageSize) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLeads.slice(start, start + pageSize);
  }, [sortedLeads, currentPage, pageSize]);

  const handleSort = (field: 'priority' | 'attempts' | 'createdTime') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const cyclePriority = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    const cycleMap: Record<Priority, Priority> = {
      Alta: 'Media',
      Media: 'Baja',
      Baja: 'Alta',
    };
    updateLeadPriority(lead.id, cycleMap[lead.priority]);
  };

  return (
    <div className="flex flex-col bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-100 dark:bg-[#151D2A] text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">Prospecto / Contacto</th>
              <th
                className="py-3 px-3 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('priority')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Prioridad</span>
                  <ArrowUpDown className="w-3 h-3 text-[#E50914]" />
                </div>
              </th>
              <th className="py-3 px-3">Estado del Proceso</th>
              <th className="py-3 px-3">Canal / Nextline</th>
              <th className="py-3 px-3">Asignación</th>
              <th
                className="py-3 px-3 text-center cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                onClick={() => handleSort('attempts')}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>Intentos</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-[#64748B]" />
                </div>
              </th>
              <th className="py-3 px-4 text-right">Acciones Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-slate-900 dark:text-[#F9FAFB]">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400 dark:text-[#64748B]">
                  No se encontraron prospectos con los filtros actuales.
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const isSelected = selectedLeadId === lead.id;
                return (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className={`transition-colors cursor-pointer group ${
                      isSelected
                        ? 'bg-red-50/80 dark:bg-red-950/30 border-l-4 border-[#E50914] text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-[#121927] hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {/* Lead info */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900 dark:text-[#F9FAFB] group-hover:text-[#E50914] leading-tight">
                            {lead.fullName}
                          </span>
                          {lead.isCold && <Badge variant="cold" size="xs" />}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono tabular-nums mt-0.5">
                          <span>{lead.phoneNumber}</span>
                          <span className="text-slate-300 dark:text-[#1F2B3E]">·</span>
                          <span className="truncate max-w-[160px] font-sans">{lead.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Priority editable badge */}
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={(e) => cyclePriority(lead, e)}
                        className="cursor-pointer transition-transform hover:scale-105"
                        title="Clic para cambiar prioridad"
                      >
                        <Badge variant="priority" priority={lead.priority} size="sm" />
                      </button>
                    </td>

                    {/* Process Status Badge */}
                    <td className="py-3.5 px-3">
                      <Badge variant="status" status={lead.processStatus} size="sm" />
                    </td>

                    {/* Platform & Nextline Campaign Tag */}
                    <td className="py-3.5 px-3">
                      <div className="flex flex-col gap-0.5 items-start">
                        <Badge variant="platform" platform={lead.platform} size="xs" />
                        {lead.nextlineTagName && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-tight flex items-center gap-1 font-bold">
                            <Radio className="w-2.5 h-2.5" />
                            {lead.nextlineTagName}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Assigned Vendor */}
                    <td className="py-3.5 px-3">
                      {lead.assignedToName ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-800 dark:text-[#F9FAFB] font-medium">
                          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                          <span className="truncate max-w-[110px]">{lead.assignedToName}</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                          Sin Asignar
                        </span>
                      )}
                    </td>

                    {/* Contact Attempts Counter Widget */}
                    <td className="py-3.5 px-3 text-center">
                      <AttemptCounter leadId={lead.id} attempts={lead.attempts} compact />
                    </td>

                    {/* Quick Actions (Call, WhatsApp, Ficha) */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('call', lead);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-[#090D16] dark:hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-[#1F2B3E] hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
                          title="Llamar al prospecto"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal('whatsapp', lead);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-[#090D16] dark:hover:bg-emerald-600/20 text-[#25D366] border border-slate-200 dark:border-[#1F2B3E] hover:border-[#25D366] transition-colors cursor-pointer"
                          title="Enviar WhatsApp con plantilla"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onSelectLead(lead)}
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#E50914] text-slate-800 hover:text-white dark:bg-[#1A2337] dark:hover:bg-[#E50914] dark:text-[#F9FAFB] border border-slate-200 dark:border-[#1F2B3E] hover:border-[#E50914] transition-colors ml-1 cursor-pointer"
                        >
                          <span>Ficha</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-[#1F2B3E] bg-slate-50/80 dark:bg-[#0B0F19]/60 text-xs text-slate-600 dark:text-[#94A3B8]">
        <div>
          Mostrando página <strong className="text-slate-900 dark:text-[#F9FAFB] font-mono tabular-nums">{currentPage}</strong> de{' '}
          <strong className="text-slate-900 dark:text-[#F9FAFB] font-mono tabular-nums">{totalPages}</strong> (
          <span className="font-mono tabular-nums font-bold">{sortedLeads.length}</span> prospectos totales)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                currentPage === page
                  ? 'bg-[#E50914] text-white'
                  : 'bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-700 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
