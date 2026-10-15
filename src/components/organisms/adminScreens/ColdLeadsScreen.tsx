import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { ArrowLeft, Snowflake, RefreshCw, Eye, Search, PhoneCall, AlertCircle } from 'lucide-react';
import { Badge } from '../../atoms/Badge';

export const ColdLeadsScreen: React.FC = () => {
  const { leads, restoreFromCold, setSelectedLeadId, setAdminActiveScreen } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');

  const coldLeads = leads.filter((l) => {
    if (!l.isCold) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.fullName.toLowerCase().includes(q) ||
        l.phoneNumber.includes(q) ||
        l.coldReason?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#1F2B3E]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAdminActiveScreen('hub')}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#121927] hover:bg-slate-200 dark:hover:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] text-xs font-bold text-slate-700 dark:text-[#F9FAFB] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Volver a Aplicaciones</span>
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-[#F9FAFB] flex items-center gap-2">
              <Snowflake className="w-5 h-5 text-cyan-500" />
              <span>Congelador de Leads Fríos</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Prospectos sin respuesta reiterada o descartados temporalmente para reactivación.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-mono">
            {coldLeads.length} prospectos en reserva fría
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o motivo de enfriamiento..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB]"
          />
        </div>
      </div>

      {/* Cold Leads Data Table */}
      <div className="rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-[#090D16] border-b border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8] font-bold text-[11px] uppercase">
                <th className="py-3 px-4">Prospecto</th>
                <th className="py-3 px-3">Origen / Campaña</th>
                <th className="py-3 px-3">Fecha Congelamiento</th>
                <th className="py-3 px-3 text-center">Intentos</th>
                <th className="py-3 px-4">Razón del Enfriamiento</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-slate-900 dark:text-[#F9FAFB]">
              {coldLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-[#64748B]">
                    No hay prospectos congelados registrados.
                  </td>
                </tr>
              ) : (
                coldLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-[#1A2337] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm">
                          {lead.fullName}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono">
                          {lead.phoneNumber} · {lead.email}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-col items-start gap-1">
                        <Badge variant="platform" platform={lead.platform} size="xs" />
                        <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-mono">
                          {lead.nextlineTagName || lead.courseInterest}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500 dark:text-[#64748B]">
                      {lead.coldDate || new Date().toISOString().split('T')[0]}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold text-xs border border-rose-200 dark:border-rose-500/25">
                        <PhoneCall className="w-3 h-3" />
                        {lead.attempts}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/25 text-cyan-900 dark:text-cyan-300 text-xs italic">
                        "{lead.coldReason || 'Sin respuesta tras reiteradas llamadas'}"
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedLeadId(lead.id)}
                          type="button"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-[#1A2337] hover:bg-slate-200 dark:hover:bg-[#232F42] text-slate-700 dark:text-[#F9FAFB] font-semibold text-xs transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Ficha</span>
                        </button>

                        <button
                          onClick={() => restoreFromCold(lead.id)}
                          type="button"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reactivar Prospecto</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
