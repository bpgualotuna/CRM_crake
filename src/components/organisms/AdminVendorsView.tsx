import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { User, Lead } from '../../types/crm';
import { Avatar } from '../atoms/Avatar';
import { Users, Target, DollarSign, Award, ChevronRight, Phone, Mail, CheckCircle2, X } from 'lucide-react';

export const AdminVendorsView: React.FC = () => {
  const { users, leads } = useCRM();
  const [selectedVendor, setSelectedVendor] = useState<User | null>(null);

  const vendors = users.filter((u) => u.role === 'vendedor');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">Equipo Comercial y Vendedores</h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Supervisión de cartera asignada, ventas cerradas y cumplimiento de cuotas mensuales.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {vendors.map((vendor) => {
          const vendorLeads = leads.filter((l) => l.assignedTo === vendor.id);
          const vendorSalesCount = vendorLeads.filter((l) => l.processStatus === 'Venta realizada').length;
          const goalPercentage = Math.round(
            ((vendor.monthlySales || 0) / (vendor.monthlyGoal || 9000)) * 100
          );

          return (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] hover:border-[#E50914] dark:hover:border-[#E50914] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between shadow-sm group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={vendor.name} role="vendedor" size="md" />
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F9FAFB] truncate group-hover:text-[#E50914]">
                      {vendor.name}
                    </h3>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Activo
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-[#94A3B8]">
                    <span>Leads en Gestión:</span>
                    <strong className="text-slate-900 dark:text-[#F9FAFB] font-mono tabular-nums">
                      {vendorLeads.length} leads
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-[#94A3B8]">
                    <span>Ventas Cerradas:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono tabular-nums font-bold">
                      {vendorSalesCount} cierres
                    </strong>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-[#94A3B8]">
                    <span>Facturado este Mes:</span>
                    <strong className="text-slate-900 dark:text-[#F9FAFB] font-mono tabular-nums font-bold">
                      ${(vendor.monthlySales || 0).toLocaleString()}
                    </strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60">
                  <div className="flex justify-between text-[11px] mb-1 font-semibold">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Meta Mensual:</span>
                    <span className="text-slate-900 dark:text-white font-mono">{goalPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#090D16] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E]">
                    <div
                      className="bg-gradient-to-r from-[#E50914] to-emerald-400 h-full rounded-full"
                      style={{ width: `${Math.min(100, goalPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-[#E50914] mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60">
                <span>Ver cartera completa</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Drill-down modal for selected vendor */}
      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 flex flex-col max-h-[85vh] text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1F2B3E]">
              <div className="flex items-center gap-3">
                <Avatar name={selectedVendor.name} role="vendedor" size="md" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">{selectedVendor.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-[#94A3B8]">{selectedVendor.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVendor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#1A2337] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto space-y-4 flex-1 text-xs">
              <h4 className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider text-[11px]">
                Prospectos Asignados a este Vendedor
              </h4>
              <div className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60">
                {leads
                  .filter((l) => l.assignedTo === selectedVendor.id)
                  .map((lead) => (
                    <div key={lead.id} className="py-3 flex items-center justify-between">
                      <div>
                        <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm block">
                          {lead.fullName}
                        </strong>
                        <span className="text-slate-500 dark:text-[#94A3B8] font-mono text-[11px]">
                          {lead.phoneNumber} · {lead.email}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-[#1A2337] text-slate-800 dark:text-[#F9FAFB] border border-slate-200 dark:border-[#1F2B3E]">
                          {lead.processStatus}
                        </span>
                        <span className="block text-[10px] text-slate-400 dark:text-[#64748B] mt-0.5 font-mono">
                          {lead.attempts} llamadas
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-[#1F2B3E] flex justify-end">
              <button
                onClick={() => setSelectedVendor(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A2337] dark:hover:bg-[#232F42] text-slate-800 dark:text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
