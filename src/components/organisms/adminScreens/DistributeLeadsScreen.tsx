import React, { useState, useMemo } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { ArrowLeft, Shuffle, UserCheck, Filter, Users, Calendar, Check, Search } from 'lucide-react';
import { Badge } from '../../atoms/Badge';

export const DistributeLeadsScreen: React.FC = () => {
  const {
    leads,
    users,
    campaigns,
    distributeLeadsRoundRobin,
    distributeLeadsManual,
    setAdminActiveScreen,
  } = useCRM();

  // Filters
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected leads
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  // Mode: 'round_robin' | 'manual'
  const [distributionMode, setDistributionMode] = useState<'round_robin' | 'manual'>('round_robin');
  const [selectedVendorForManual, setSelectedVendorForManual] = useState<string>('');

  const vendors = users.filter((u) => u.role === 'vendedor' && u.isActive);
  const [roundRobinVendorIds, setRoundRobinVendorIds] = useState<string[]>(vendors.map((v) => v.id));

  // Available leads to distribute (unassigned leads preferred, or any lead)
  const unassignedLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (lead.isCold) return false;
      if (selectedCampaign !== 'all' && lead.nextlineTagName !== selectedCampaign) return false;
      if (selectedPlatform !== 'all' && lead.platform !== selectedPlatform) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          lead.fullName.toLowerCase().includes(q) ||
          lead.phoneNumber.includes(q) ||
          lead.email.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [leads, selectedCampaign, selectedPlatform, searchQuery]);

  const handleSelectAll = () => {
    if (selectedLeadIds.length === unassignedLeads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(unassignedLeads.map((l) => l.id));
    }
  };

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleVendor = (id: string) => {
    setRoundRobinVendorIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleExecuteDistribution = () => {
    if (selectedLeadIds.length === 0) return;

    if (distributionMode === 'round_robin') {
      if (roundRobinVendorIds.length === 0) {
        alert('Por favor selecciona al menos un vendedor receptor.');
        return;
      }
      distributeLeadsRoundRobin(selectedLeadIds, roundRobinVendorIds);
    } else {
      if (!selectedVendorForManual) {
        alert('Por favor selecciona el vendedor destino para la asignación manual.');
        return;
      }
      distributeLeadsManual(selectedLeadIds, selectedVendorForManual);
    }

    setSelectedLeadIds([]);
    alert('¡Leads distribuidos y asignados con éxito!');
  };

  const leadsPerVendor =
    roundRobinVendorIds.length > 0
      ? (selectedLeadIds.length / roundRobinVendorIds.length).toFixed(1)
      : '0';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar with Back Button */}
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
            <h1 className="text-xl font-black text-slate-900 dark:text-[#F9FAFB]">
              Distribución y Asignación de Leads
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Reparto equitativo Round-Robin o manual de la cartera de prospectos.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-[#E50914]/10 border border-red-200 dark:border-[#E50914]/20 text-[#E50914] font-mono">
            {selectedLeadIds.length} seleccionados para reparto
          </span>
        </div>
      </div>

      {/* Top Filter Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
            Buscar por Nombre o Teléfono
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar prospecto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
            />
          </div>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
            Filtrar por Campaña / Tag
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
          >
            <option value="all">Todas las Campañas</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.nextlineTag}>
                {c.name} ({c.nextlineTag})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
            Filtrar por Red / Plataforma
          </label>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full p-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
          >
            <option value="all">Todas las Redes</option>
            <option value="Nextline">Nextline (WhatsApp)</option>
            <option value="Facebook">Facebook Ads</option>
            <option value="TikTok">TikTok</option>
            <option value="Instagram">Instagram</option>
            <option value="Orgánico">Orgánico</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleSelectAll}
            type="button"
            className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-[#1A2337] hover:bg-slate-200 dark:hover:bg-[#232F42] border border-slate-300 dark:border-[#1F2B3E] font-bold text-xs text-slate-800 dark:text-[#F9FAFB] transition-colors cursor-pointer"
          >
            {selectedLeadIds.length === unassignedLeads.length
              ? 'Deseleccionar Todos'
              : `Seleccionar Todos (${unassignedLeads.length})`}
          </button>
        </div>
      </div>

      {/* Main Grid: Leads Table on Left, Distribution Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Leads Table (2 Cols) */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#0B0F19] flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider text-[11px]">
              Prospectos Listos para Distribución ({unassignedLeads.length})
            </span>
            <span className="text-slate-500 dark:text-[#94A3B8] text-[11px]">
              Marca los prospectos a repartir
            </span>
          </div>

          <div className="overflow-x-auto max-h-[550px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#090D16] border-b border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8] font-bold text-[11px] uppercase">
                  <th className="py-2.5 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={
                        selectedLeadIds.length > 0 &&
                        selectedLeadIds.length === unassignedLeads.length
                      }
                      onChange={handleSelectAll}
                      className="rounded text-[#E50914]"
                    />
                  </th>
                  <th className="py-2.5 px-3">Prospecto</th>
                  <th className="py-2.5 px-3">Plataforma / Tag</th>
                  <th className="py-2.5 px-3">Asignado Actual</th>
                  <th className="py-2.5 px-3">Fecha Ingreso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-slate-900 dark:text-[#F9FAFB]">
                {unassignedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-[#64748B]">
                      No hay leads coincidentes con los filtros seleccionados.
                    </td>
                  </tr>
                ) : (
                  unassignedLeads.map((lead) => {
                    const isSelected = selectedLeadIds.includes(lead.id);
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => handleToggleLead(lead.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-red-50/70 dark:bg-[#E50914]/15 border-l-4 border-l-[#E50914]'
                            : 'hover:bg-slate-50 dark:hover:bg-[#1A2337]'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-[#E50914]"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <strong className="text-slate-900 dark:text-[#F9FAFB]">{lead.fullName}</strong>
                            <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono">
                              {lead.phoneNumber}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col gap-0.5 items-start">
                            <Badge variant="platform" platform={lead.platform} size="xs" />
                            {lead.nextlineTagName && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                                {lead.nextlineTagName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`font-semibold text-xs ${
                              lead.assignedToName
                                ? 'text-slate-700 dark:text-[#94A3B8]'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {lead.assignedToName || 'Sin Asignar'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-500 dark:text-[#64748B]">
                          {new Date(lead.createdTime).toLocaleDateString('es-EC')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Distribution Strategy Control Panel (1 Col) */}
        <div className="rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm p-5 space-y-5 text-xs">
          <div className="border-b border-slate-200 dark:border-[#1F2B3E] pb-3">
            <h2 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB]">
              Modo de Asignación
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
              Elige cómo repartir los {selectedLeadIds.length} prospectos seleccionados.
            </p>
          </div>

          {/* Strategy Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E]">
            <button
              onClick={() => setDistributionMode('round_robin')}
              type="button"
              className={`py-2 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                distributionMode === 'round_robin'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Round-Robin</span>
            </button>

            <button
              onClick={() => setDistributionMode('manual')}
              type="button"
              className={`py-2 px-3 rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                distributionMode === 'manual'
                  ? 'bg-[#E50914] text-white shadow'
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Manual Directa</span>
            </button>
          </div>

          {/* Configuration depending on mode */}
          {distributionMode === 'round_robin' ? (
            <div className="space-y-3">
              <span className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider block text-[11px]">
                Vendedores Participantes ({roundRobinVendorIds.length})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {vendors.map((vendor) => {
                  const isChecked = roundRobinVendorIds.includes(vendor.id);
                  return (
                    <div
                      key={vendor.id}
                      onClick={() => handleToggleVendor(vendor.id)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-slate-50 dark:bg-[#1A2337] border-[#E50914] text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-[#090D16] border-slate-200 dark:border-[#1F2B3E] text-slate-500 dark:text-[#64748B]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleVendor(vendor.id);
                          }}
                          className="rounded text-[#E50914]"
                        />
                        <span className="font-bold text-xs">{vendor.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-mono">
                        {vendor.activeLeadsCount || 0} leads activos
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Simulation summary */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-xs">
                <span className="text-slate-500 dark:text-[#94A3B8] block">Balance estimado:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                  ~{leadsPerVendor} leads por vendedor
                </strong>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider block text-[11px]">
                Seleccionar Vendedor Receptor Único
              </label>
              <select
                value={selectedVendorForManual}
                onChange={(e) => setSelectedVendorForManual(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
              >
                <option value="">Selecciona un vendedor...</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.activeLeadsCount || 0} leads actuales)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action button */}
          <button
            onClick={handleExecuteDistribution}
            disabled={selectedLeadIds.length === 0}
            type="button"
            className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Ejecutar Asignación ({selectedLeadIds.length} Leads)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
