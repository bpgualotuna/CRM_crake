import React, { useState, useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { SearchBarWithFilters } from '../molecules/SearchBarWithFilters';
import { LeadsDataTable } from '../organisms/LeadsDataTable';
import { VendorDashboardView } from '../organisms/VendorDashboardView';
import {
  History,
  FileSpreadsheet,
  Target,
  Download,
  Calendar,
  PhoneCall,
  MessageSquare,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';

interface VendorPageViewProps {
  currentTab: string;
  onSelectTab?: (tab: string) => void;
}

export const VendorPageView: React.FC<VendorPageViewProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const {
    leads,
    currentUser,
    selectedLead,
    setSelectedLeadId,
    actionLogs,
    salesGoals,
    exportLeadsCSV,
    exportSalesCSV,
  } = useCRM();

  // Filters state for Leads tab
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [assignmentFilter, setAssignmentFilter] = useState('all');
  const [showColdOnly, setShowColdOnly] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Cold leads filter
      if (showColdOnly && !lead.isCold) return false;
      if (!showColdOnly && lead.isCold) return false;

      // Status filter
      if (statusFilter !== 'all' && lead.processStatus !== statusFilter) return false;

      // Platform filter
      if (platformFilter !== 'all' && lead.platform !== platformFilter) return false;

      // Assignment filter
      if (assignmentFilter === 'mine' && lead.assignedTo !== currentUser.id) return false;
      if (assignmentFilter === 'unassigned' && lead.assignedTo) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.fullName?.toLowerCase().includes(q);
        const matchesPhone = lead.phoneNumber?.toLowerCase().includes(q);
        const matchesEmail = lead.email?.toLowerCase().includes(q);
        const matchesTag = lead.nextlineTagName?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesEmail && !matchesTag) return false;
      }

      return true;
    });
  }, [
    leads,
    showColdOnly,
    statusFilter,
    platformFilter,
    assignmentFilter,
    searchQuery,
    currentUser,
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPlatformFilter('all');
    setAssignmentFilter('all');
    setShowColdOnly(false);
  };

  const handleNavigateToLeadsFromDashboard = (filterStatus?: string) => {
    if (filterStatus) {
      setStatusFilter(filterStatus);
    }
    if (onSelectTab) {
      onSelectTab('leads');
    }
  };

  // 1. DASHBOARD TAB (RICAMENTE IMPLEMENTADO)
  if (currentTab === 'dashboard') {
    return <VendorDashboardView onNavigateToLeads={handleNavigateToLeadsFromDashboard} />;
  }

  // 2. MIS LEADS TAB (SIN DRAWER LATERAL - USA MODAL 2XL CENTRADO)
  if (currentTab === 'leads') {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-[#1F2B3E]">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-[#F9FAFB] tracking-tight">
              Cartera de Prospectos (Clearminds Sales)
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Haz clic en cualquier prospecto para abrir la ficha técnica y registrar llamadas, mensajes o ventas.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-[#E50914]/10 border border-red-200 dark:border-[#E50914]/20 text-[#E50914] font-mono font-bold text-xs">
              {filteredLeads.length} leads en vista
            </span>
          </div>
        </div>

        {/* Search bar and filters */}
        <SearchBarWithFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          platformFilter={platformFilter}
          onPlatformChange={setPlatformFilter}
          assignmentFilter={assignmentFilter}
          onAssignmentChange={setAssignmentFilter}
          showColdOnly={showColdOnly}
          onColdToggle={setShowColdOnly}
          onReset={handleResetFilters}
          totalFiltered={filteredLeads.length}
        />

        {/* Leads table (Ancho completo, sin panel lateral deslizante) */}
        <div className="rounded-xl overflow-hidden">
          <LeadsDataTable
            leads={filteredLeads}
            onSelectLead={(lead) => setSelectedLeadId(lead.id)}
            selectedLeadId={selectedLead?.id}
          />
        </div>
      </div>
    );
  }

  // 3. HISTORIAL TAB
  if (currentTab === 'historial') {
    return (
      <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">
            Historial de Interacciones & Llamadas
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Línea de tiempo de llamadas, mensajes de WhatsApp y cierres comerciales registrados.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-xs">
          {actionLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-400 dark:text-[#64748B]">
              No hay actividades registradas en el historial.
            </div>
          ) : (
            actionLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-[#E50914]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-900 dark:text-[#F9FAFB]">{log.userName}</strong>
                      <span className="text-[10px] text-slate-400 dark:text-[#64748B] font-mono">
                        {new Date(log.date).toLocaleString('es-EC')}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-[#94A3B8] mt-1">{log.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // 4. EXPORTAR TAB
  if (currentTab === 'exportar') {
    return (
      <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">
            Exportar Datos a Excel / CSV
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Descarga inmediata de prospectos, historial y ventas para análisis externo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-6 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exportar Todos los Leads
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                Incluye nombres, teléfonos, estado del pipeline, origen Nextline y contador de intentos.
              </p>
            </div>
            <button
              onClick={exportLeadsCSV}
              className="w-full py-2.5 rounded-lg bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar CSV Leads</span>
            </button>
          </div>

          <div className="p-6 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Exportar Ventas Cerradas
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                Incluye montos pactados, abonos iniciales, comprobantes bancarios y estados de verificación.
              </p>
            </div>
            <button
              onClick={exportSalesCSV}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Descargar CSV Ventas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. METAS DEL MES TAB
  if (currentTab === 'metas') {
    const userGoal =
      salesGoals.find((g) => g.vendorId === currentUser.id) || salesGoals[0];
    const goalPercentage = Math.round(
      (userGoal.currentRevenue / userGoal.targetRevenue) * 100
    );

    return (
      <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">
            Metas y Comisiones del Mes
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Rendimiento individual y progreso hacia la bonificación por cumplimiento.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider block font-semibold">
                Objetivo de Facturación - {userGoal.month}
              </span>
              <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1">
                ${userGoal.currentRevenue.toLocaleString()} / $
                {userGoal.targetRevenue.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {goalPercentage}%
              </span>
              <span className="text-xs text-slate-400 dark:text-[#64748B] block">Alcanzado</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-[#090D16] h-3 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E]">
            <div
              className="bg-gradient-to-r from-[#E50914] to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, goalPercentage)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60 text-xs">
            <div>
              <span className="text-slate-500 dark:text-[#64748B] block">Ventas Realizadas</span>
              <strong className="text-slate-900 dark:text-white font-mono text-base">
                {userGoal.currentSales}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#64748B] block">Ventas Faltantes</span>
              <strong className="text-amber-500 font-mono text-base">
                {Math.max(0, userGoal.targetSales - userGoal.currentSales)}
              </strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-[#64748B] block">Comisión Estimada</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-base">
                ${Math.round(userGoal.currentRevenue * 0.08)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback default
  return <VendorDashboardView onNavigateToLeads={handleNavigateToLeadsFromDashboard} />;
};
