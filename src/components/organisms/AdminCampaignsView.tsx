import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Campaign } from '../../types/crm';
import { Megaphone, Plus, DollarSign, TrendingUp, Radio, Calendar, Check, X } from 'lucide-react';

export const AdminCampaignsView: React.FC = () => {
  const { campaigns } = useCRM();
  const [campaignList, setCampaignList] = useState<Campaign[]>(campaigns);
  const [showNewModal, setShowNewModal] = useState(false);

  // New campaign state
  const [newTitle, setNewTitle] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newBudget, setNewBudget] = useState(1000);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newTag) return;

    const newCamp: Campaign = {
      id: `camp-${Date.now()}`,
      name: newTitle.trim(),
      nextlineTag: newTag.trim().toUpperCase(),
      platform: 'Nextline',
      startDate: new Date().toISOString().split('T')[0],
      leadsCount: 0,
      conversionsCount: 0,
      totalRevenue: 0,
      budget: Number(newBudget),
      status: 'activa',
    };

    setCampaignList([newCamp, ...campaignList]);
    setShowNewModal(false);
    setNewTitle('');
    setNewTag('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB]">
            Campañas Publicitarias & Cursos Nextline
          </h2>
          <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
            Sincronización directa entre etiquetas de ChatControl y cursos ofertados en el CRM.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Campaña</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {campaignList.map((campaign) => {
          const roi =
            campaign.budget > 0
              ? (
                  ((campaign.totalRevenue - campaign.budget) / campaign.budget) *
                  100
                ).toFixed(0)
              : '0';

          return (
            <div
              key={campaign.id}
              className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] hover:border-slate-300 dark:hover:border-[#2D3F5C] hover:shadow-md transition-all flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono tracking-wider uppercase font-bold flex items-center gap-1.5">
                      <Radio className="w-3 h-3" />
                      TAG: {campaign.nextlineTag}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-[#F9FAFB] mt-0.5">{campaign.name}</h3>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25 uppercase">
                    {campaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">Leads Inyectados</span>
                    <strong className="text-slate-900 dark:text-[#F9FAFB] font-mono text-sm">
                      {campaign.leadsCount}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">Ventas Cerradas</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                      {campaign.conversionsCount}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">ROI Publicitario</span>
                    <strong className="text-[#E50914] font-mono text-sm font-bold">
                      +{roi}%
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#94A3B8] mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60">
                <span>Inversión: ${campaign.budget}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB]">
                  Recaudado: ${campaign.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for creating campaign */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 flex flex-col text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1F2B3E]">
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">Crear Nueva Campaña Nextline</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="py-4 space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">Nombre de la Campaña</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Campaña Lanzamiento Python IA"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] rounded-lg p-2.5 text-xs text-slate-900 dark:text-[#F9FAFB] focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">
                  Tag de Nextline / ChatControl
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. TIKTOK-PYTHON-IA"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] rounded-lg p-2.5 text-xs text-slate-900 dark:text-[#F9FAFB] font-mono focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-[#94A3B8] block mb-1">Presupuesto ($ USD)</label>
                <input
                  type="number"
                  required
                  min={100}
                  value={newBudget}
                  onChange={(e) => setNewBudget(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] rounded-lg p-2.5 text-xs text-slate-900 dark:text-[#F9FAFB] font-mono focus:outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-[#121927] text-slate-700 dark:text-[#94A3B8] border border-slate-200 dark:border-[#1F2B3E] rounded-lg font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E50914] text-white rounded-lg font-bold shadow-md hover:bg-[#FF1E27]"
                >
                  Guardar Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
