import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Shuffle, Users, Check, X } from 'lucide-react';

export const DistributeLeadsModal: React.FC = () => {
  const { activeModal, closeModal, leads, users, distributeLeadsRoundRobin } = useCRM();

  const unassignedLeads = leads.filter((l) => !l.assignedTo && !l.isCold);
  const vendors = users.filter((u) => u.role === 'vendedor' && u.isActive);

  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>(
    unassignedLeads.map((l) => l.id)
  );
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>(
    vendors.map((v) => v.id)
  );

  if (activeModal !== 'distribute') return null;

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleVendor = (id: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExecute = () => {
    if (selectedLeadIds.length === 0 || selectedVendorIds.length === 0) return;
    distributeLeadsRoundRobin(selectedLeadIds, selectedVendorIds);
    closeModal();
  };

  const avgPerVendor =
    selectedVendorIds.length > 0
      ? (selectedLeadIds.length / selectedVendorIds.length).toFixed(1)
      : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-600/15 dark:text-purple-400 border border-purple-200 dark:border-purple-500/25">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">
                Distribución Masiva de Leads (Round-Robin)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Asignación equitativa y balanceada de prospectos sin asignar
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-lg text-slate-400 dark:text-[#94A3B8] hover:text-slate-700 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#1A2337]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          {/* Summary pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <span className="text-slate-800 dark:text-[#F9FAFB] font-semibold">
                Simulación: {selectedLeadIds.length} leads entre {selectedVendorIds.length} vendedores
              </span>
            </div>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              ~{avgPerVendor} leads / vendedor
            </span>
          </div>

          {/* Leads selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase">
                1. Seleccionar Leads sin Asignar ({unassignedLeads.length} disponibles)
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedLeadIds(
                    selectedLeadIds.length === unassignedLeads.length
                      ? []
                      : unassignedLeads.map((l) => l.id)
                  )
                }
                className="text-[11px] text-[#E50914] font-semibold hover:underline cursor-pointer"
              >
                {selectedLeadIds.length === unassignedLeads.length ? 'Deseleccionar' : 'Todos'}
              </button>
            </div>

            {unassignedLeads.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-center text-slate-400 dark:text-[#64748B]">
                No hay leads sin asignar pendientes en la cola.
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-1.5 p-1">
                {unassignedLeads.map((lead) => {
                  const isChecked = selectedLeadIds.includes(lead.id);
                  return (
                    <div
                      key={lead.id}
                      onClick={() => handleToggleLead(lead.id)}
                      className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-red-50 dark:bg-[#E50914]/10 border-red-300 dark:border-[#E50914]/40 text-slate-900 dark:text-white'
                          : 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleToggleLead(lead.id);
                          }}
                          className="rounded text-[#E50914]"
                        />
                        <span className="font-semibold">{lead.fullName}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B]">
                        {lead.phoneNumber}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Vendors selection */}
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1.5">
              2. Vendedores Participantes ({vendors.length} activos)
            </span>
            <div className="grid grid-cols-2 gap-2">
              {vendors.map((vendor) => {
                const isChecked = selectedVendorIds.includes(vendor.id);
                return (
                  <div
                    key={vendor.id}
                    onClick={() => handleToggleVendor(vendor.id)}
                    className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-purple-50 dark:bg-purple-600/10 border-purple-300 dark:border-purple-500/40 text-slate-900 dark:text-white'
                        : 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8]'
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
                        className="rounded text-purple-600"
                      />
                      <span className="font-bold text-xs">{vendor.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-end gap-3 text-xs">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A2337] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2B3E] font-semibold cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleExecute}
            disabled={selectedLeadIds.length === 0 || selectedVendorIds.length === 0}
            className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-40 cursor-pointer uppercase tracking-wider"
          >
            <Check className="w-4 h-4" />
            <span>Ejecutar Round-Robin ({selectedLeadIds.length} leads)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
