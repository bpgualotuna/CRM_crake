import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { BarChart3, Filter, Download, ArrowUpRight, Calendar, Users, DollarSign } from 'lucide-react';

export const AdminStatsView: React.FC = () => {
  const { leads, users, campaigns, exportLeadsCSV, exportSalesCSV } = useCRM();

  const [periodFilter, setPeriodFilter] = useState('current_month');
  const [selectedVendorFilter, setSelectedVendorFilter] = useState('all');
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState('all');

  const vendors = users.filter((u) => u.role === 'vendedor');

  // Filtered stats computation
  const filteredLeads = leads.filter((l) => {
    if (selectedVendorFilter !== 'all' && l.assignedTo !== selectedVendorFilter) return false;
    if (selectedCampaignFilter !== 'all' && l.nextlineTagName !== selectedCampaignFilter) return false;
    return true;
  });

  const totalFilteredLeads = filteredLeads.length;
  const closedFilteredSales = filteredLeads.filter((l) => l.processStatus === 'Venta realizada').length;
  const filteredRevenue = filteredLeads.reduce((acc, lead) => {
    return acc + (lead.sales || []).reduce((sAcc, s) => sAcc + s.totalAmount, 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">Estadísticas & Reportes Maestros</h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Análisis comparativo por periodos, rendimiento por asesor educativo y canales de captación.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportLeadsCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#121927] dark:hover:bg-[#1A2337] text-slate-800 dark:text-white border border-slate-200 dark:border-[#1F2B3E] font-bold text-xs cursor-pointer shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Prospectos</span>
          </button>
          <button
            onClick={exportSalesCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold text-xs shadow-md cursor-pointer transition-all active:scale-95 uppercase tracking-wider"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Ventas Validadas</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">Rango Temporal</label>
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2 text-xs focus:outline-none focus:border-[#E50914]"
          >
            <option value="current_month">Octubre 2026 (Mes Actual)</option>
            <option value="last_month">Septiembre 2026 (Mes Pasado)</option>
            <option value="q3">Tercer Trimestre Q3 2026</option>
            <option value="ytd">Año Completo 2026</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">Filtrar por Vendedor</label>
          <select
            value={selectedVendorFilter}
            onChange={(e) => setSelectedVendorFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2 text-xs focus:outline-none focus:border-[#E50914]"
          >
            <option value="all">Todos los Vendedores</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">Filtrar por Campaña</label>
          <select
            value={selectedCampaignFilter}
            onChange={(e) => setSelectedCampaignFilter(e.target.value)}
            className="w-full bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2 text-xs focus:outline-none focus:border-[#E50914]"
          >
            <option value="all">Todas las Campañas</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.nextlineTag}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistical Comparative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Leads en el Segmento</span>
          <div className="text-3xl font-black text-slate-900 dark:text-white font-mono mt-1 tabular-nums">
            {totalFilteredLeads}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
            +14% vs periodo comparativo
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Cierres de Venta</span>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1 tabular-nums">
            {closedFilteredSales}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
            {totalFilteredLeads > 0 ? ((closedFilteredSales / totalFilteredLeads) * 100).toFixed(1) : 0}% tasa de éxito
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm">
          <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase">Ingresos Generados</span>
          <div className="text-3xl font-black text-[#E50914] font-mono mt-1 tabular-nums">
            ${filteredRevenue.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">
            Ticket promedio: ${closedFilteredSales > 0 ? Math.round(filteredRevenue / closedFilteredSales) : 0}
          </span>
        </div>
      </div>
    </div>
  );
};
