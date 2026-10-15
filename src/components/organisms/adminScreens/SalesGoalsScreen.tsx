import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import { ArrowLeft, Target, Plus, Edit2, Trash2, Check, X, TrendingUp } from 'lucide-react';
import { SalesGoal } from '../../../types/crm';

export const SalesGoalsScreen: React.FC = () => {
  const {
    salesGoals,
    users,
    addSalesGoal,
    updateSalesGoal,
    deleteSalesGoal,
    setAdminActiveScreen,
  } = useCRM();

  const vendors = users.filter((u) => u.role === 'vendedor' && u.isActive);

  // Modal / Form state for Create / Edit
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SalesGoal | null>(null);

  const [formVendorId, setFormVendorId] = useState(vendors[0]?.id || '');
  const [formMonth, setFormMonth] = useState('Octubre 2026');
  const [formTargetSales, setFormTargetSales] = useState(12);
  const [formTargetRevenue, setFormTargetRevenue] = useState(9000);

  const handleOpenCreate = () => {
    setEditingGoal(null);
    setFormVendorId(vendors[0]?.id || '');
    setFormMonth('Octubre 2026');
    setFormTargetSales(12);
    setFormTargetRevenue(9000);
    setShowGoalModal(true);
  };

  const handleOpenEdit = (goal: SalesGoal) => {
    setEditingGoal(goal);
    setFormVendorId(goal.vendorId);
    setFormMonth(goal.month);
    setFormTargetSales(goal.targetSales);
    setFormTargetRevenue(goal.targetRevenue);
    setShowGoalModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const vendorObj = vendors.find((v) => v.id === formVendorId);
    const vendorName = vendorObj ? vendorObj.name : 'Vendedor Krake';

    if (editingGoal) {
      updateSalesGoal(editingGoal.id, {
        vendorId: formVendorId,
        vendorName,
        month: formMonth,
        targetSales: Number(formTargetSales),
        targetRevenue: Number(formTargetRevenue),
      });
    } else {
      addSalesGoal({
        vendorId: formVendorId,
        vendorName,
        month: formMonth,
        targetSales: Number(formTargetSales),
        targetRevenue: Number(formTargetRevenue),
      });
    }
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
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
              <Target className="w-5 h-5 text-[#E50914]" />
              <span>Gestión de Metas Comerciales</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Parametrización de objetivos de venta por asesor y comisiones proyectadas.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Meta</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {salesGoals.map((sg) => {
          const progressPct = Math.min(
            100,
            Math.round((sg.currentRevenue / (sg.targetRevenue || 1)) * 100)
          );
          const estimatedCommission = Math.round(sg.currentRevenue * 0.08);

          return (
            <div
              key={sg.id}
              className="p-5 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-[#F9FAFB]">
                      {sg.vendorName}
                    </h3>
                    <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] font-mono">
                      {sg.month}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(sg)}
                      className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
                      title="Editar meta"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar meta de ${sg.vendorName}?`)) {
                          deleteSalesGoal(sg.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-rose-500"
                      title="Eliminar meta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Facturado:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">
                      ${sg.currentRevenue.toLocaleString()} / ${sg.targetRevenue.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Cierres:</span>
                    <strong className="text-slate-700 dark:text-slate-300 font-mono">
                      {sg.currentSales} de {sg.targetSales} ventas
                    </strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500 dark:text-[#94A3B8]">Avance</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#090D16] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E]">
                    <div
                      className="bg-gradient-to-r from-[#E50914] to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#64748B]">Comisión 8%:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                  ${estimatedCommission.toLocaleString()}
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for Creating / Editing Sales Goal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
              <h3 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB]">
                {editingGoal ? 'Editar Meta de Ventas' : 'Nueva Meta Mensual'}
              </h3>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                  Vendedor Asignado
                </label>
                <select
                  value={formVendorId}
                  onChange={(e) => setFormVendorId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                  Mes / Periodo
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Noviembre 2026"
                  value={formMonth}
                  onChange={(e) => setFormMonth(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Meta en Ventas (# Cierres)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formTargetSales}
                    onChange={(e) => setFormTargetSales(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Meta en Dólares ($ Facturación)
                  </label>
                  <input
                    type="number"
                    required
                    min={100}
                    step={100}
                    value={formTargetRevenue}
                    onChange={(e) => setFormTargetRevenue(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-[#1F2B3E]">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-600 dark:text-[#94A3B8] rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E50914] text-white font-extrabold rounded-lg shadow-md"
                >
                  {editingGoal ? 'Guardar Cambios' : 'Crear Meta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
