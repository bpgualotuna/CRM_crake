import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Users,
  ListOrdered,
  Tag,
  X,
  Plus,
  Check,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Power,
} from 'lucide-react';
import { Promotion, ProcessStatusItem, ProcessStatus } from '../../types/crm';

export const HubModals: React.FC = () => {
  const {
    activeModal,
    closeModal,
    users,
    courses,
    campaigns,
    promotions,
    addPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotionActive,
    processStatuses,
    addProcessStatus,
    updateProcessStatus,
    deleteProcessStatus,
    moveProcessStatusOrder,
  } = useCRM();

  // PROMOTIONS MODAL CRUD STATE
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [promoName, setPromoName] = useState('');
  const [promoType, setPromoType] = useState<'fixed' | 'percentage'>('fixed');
  const [promoValue, setPromoValue] = useState(100);
  const [promoValidUntil, setPromoValidUntil] = useState('2026-11-30');
  const [promoCourseOrCampId, setPromoCourseOrCampId] = useState(courses[0]?.id || '');

  // PROCESS STATUSES CRUD STATE
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ProcessStatusItem | null>(null);
  const [statusName, setStatusName] = useState('');
  const [statusColor, setStatusColor] = useState('#3B82F6');
  const [statusDesc, setStatusDesc] = useState('');

  if (!activeModal) return null;

  // 1. PROMOTIONS MODAL (CRUD REAL + CAMPAIGN/COURSE SELECTOR)
  if (activeModal === 'promotions') {
    const handleSavePromo = (e: React.FormEvent) => {
      e.preventDefault();
      const courseOrCamp =
        courses.find((c) => c.id === promoCourseOrCampId)?.title ||
        campaigns.find((c) => c.id === promoCourseOrCampId)?.name ||
        'Programa General';

      if (editingPromo) {
        updatePromotion(editingPromo.id, {
          name: promoName,
          discountType: promoType,
          discountValue: Number(promoValue),
          validUntil: promoValidUntil,
          campaignOrCourseId: promoCourseOrCampId,
          campaignOrCourseName: courseOrCamp,
        });
      } else {
        addPromotion({
          name: promoName,
          discountType: promoType,
          discountValue: Number(promoValue),
          validUntil: promoValidUntil,
          campaignOrCourseId: promoCourseOrCampId,
          campaignOrCourseName: courseOrCamp,
          isActive: true,
        });
      }
      setShowPromoForm(false);
      setEditingPromo(null);
      setPromoName('');
    };

    const handleOpenEditPromo = (p: Promotion) => {
      setEditingPromo(p);
      setPromoName(p.name);
      setPromoType(p.discountType);
      setPromoValue(p.discountValue);
      setPromoValidUntil(p.validUntil);
      setPromoCourseOrCampId(p.campaignOrCourseId);
      setShowPromoForm(true);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 text-xs flex flex-col max-h-[88vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/15 text-rose-500 border border-rose-200 dark:border-rose-500/25">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">
                  Catálogo de Promociones & Descuentos (CRUD)
                </h3>
                <p className="text-slate-500 dark:text-[#94A3B8]">
                  Gestión de becas y convenios autorizados para cierres de venta
                </p>
              </div>
            </div>
            <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List or Form */}
          <div className="py-4 overflow-y-auto space-y-4 flex-1">
            {!showPromoForm ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider text-[11px]">
                    Promociones Activas ({promotions.length})
                  </span>
                  <button
                    onClick={() => {
                      setEditingPromo(null);
                      setPromoName('');
                      setPromoValue(80);
                      setShowPromoForm(true);
                    }}
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E50914] text-white font-bold text-xs shadow hover:bg-[#FF1E27] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Crear Promoción</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {promotions.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
                        p.isActive
                          ? 'bg-slate-50 dark:bg-[#121927] border-slate-200 dark:border-[#1F2B3E]'
                          : 'bg-slate-100/60 dark:bg-[#090D16] border-slate-200 dark:border-[#1F2B3E]/60 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm">{p.name}</strong>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              p.isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {p.isActive ? 'Activa' : 'Inactiva'}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] block mt-0.5">
                          Aplica a: <strong className="text-slate-700 dark:text-slate-300">{p.campaignOrCourseName}</strong> · Hasta {p.validUntil}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-base">
                          {p.discountType === 'fixed' ? `-$${p.discountValue}` : `-${p.discountValue}%`}
                        </span>

                        <button
                          onClick={() => togglePromotionActive(p.id)}
                          className={`p-1.5 rounded-lg border cursor-pointer ${
                            p.isActive
                              ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20'
                              : 'text-slate-400 border-slate-200 bg-slate-100 dark:bg-slate-900'
                          }`}
                          title={p.isActive ? 'Desactivar promoción' : 'Activar promoción'}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditPromo(p)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          title="Editar promoción"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deletePromotion(p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                          title="Eliminar promoción"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSavePromo} className="space-y-3.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  {editingPromo ? 'Editar Promoción' : 'Nueva Promoción Comercial'}
                </span>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Nombre o Código de la Promoción
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Beca Talento Krake 2026"
                    value={promoName}
                    onChange={(e) => setPromoName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                      Tipo de Descuento
                    </label>
                    <select
                      value={promoType}
                      onChange={(e) => setPromoType(e.target.value as any)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                    >
                      <option value="fixed">Monto Fijo en Dólares ($)</option>
                      <option value="percentage">Porcentaje de Descuento (%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                      Valor del Descuento
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={promoValue}
                      onChange={(e) => setPromoValue(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                      Campaña / Curso Asociado
                    </label>
                    <select
                      value={promoCourseOrCampId}
                      onChange={(e) => setPromoCourseOrCampId(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                    >
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                      Fecha de Vigencia
                    </label>
                    <input
                      type="date"
                      required
                      value={promoValidUntil}
                      onChange={(e) => setPromoValidUntil(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPromoForm(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-600 dark:text-[#94A3B8] rounded-lg font-bold"
                  >
                    Volver a Lista
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E50914] text-white font-extrabold rounded-lg shadow-md"
                  >
                    Guardar Promoción
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-[#1F2B3E] flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-800 dark:text-white rounded-lg text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. PROCESS STATUSES MODAL (CRUD REAL + REORDERING ARRIBA / ABAJO)
  if (activeModal === 'processStatuses') {
    const sortedStatuses = [...processStatuses].sort((a, b) => a.order - b.order);

    const handleSaveStatus = (e: React.FormEvent) => {
      e.preventDefault();
      if (!statusName.trim()) return;

      if (editingStatus) {
        updateProcessStatus(editingStatus.id, {
          name: statusName.trim() as ProcessStatus,
          color: statusColor,
          description: statusDesc.trim(),
        });
      } else {
        addProcessStatus({
          name: statusName.trim() as ProcessStatus,
          color: statusColor,
          description: statusDesc.trim(),
        });
      }
      setShowStatusForm(false);
      setEditingStatus(null);
      setStatusName('');
      setStatusDesc('');
    };

    const handleOpenEditStatus = (s: ProcessStatusItem) => {
      setEditingStatus(s);
      setStatusName(s.name);
      setStatusColor(s.color);
      setStatusDesc(s.description);
      setShowStatusForm(true);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 text-xs flex flex-col max-h-[88vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-500 border border-indigo-200 dark:border-indigo-500/25">
                <ListOrdered className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">
                  Estados de Proceso & Priorizador
                </h3>
                <p className="text-slate-500 dark:text-[#94A3B8]">
                  Reordena las fases del embudo comercial con las flechas Arriba/Abajo
                </p>
              </div>
            </div>
            <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 overflow-y-auto space-y-4 flex-1">
            {!showStatusForm ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider text-[11px]">
                    Secuencia del Pipeline ({sortedStatuses.length} fases)
                  </span>
                  <button
                    onClick={() => {
                      setEditingStatus(null);
                      setStatusName('');
                      setStatusDesc('');
                      setShowStatusForm(true);
                    }}
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#E50914] text-white font-bold text-xs shadow hover:bg-[#FF1E27] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo Estado</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {sortedStatuses.map((s, index) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-[#090D16] text-slate-700 dark:text-slate-300 font-mono font-bold text-xs flex items-center justify-center">
                          {s.order}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: s.color }}
                            />
                            <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm">{s.name}</strong>
                          </div>
                          <p className="text-slate-500 dark:text-[#94A3B8] text-[11px] mt-0.5">
                            {s.description}
                          </p>
                        </div>
                      </div>

                      {/* Reordering and Edit buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => moveProcessStatusOrder(s.id, 'up')}
                          className="p-1.5 rounded bg-white dark:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-slate-300 hover:text-[#E50914] disabled:opacity-30 cursor-pointer"
                          title="Subir prioridad"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={index === sortedStatuses.length - 1}
                          onClick={() => moveProcessStatusOrder(s.id, 'down')}
                          className="p-1.5 rounded bg-white dark:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-slate-300 hover:text-[#E50914] disabled:opacity-30 cursor-pointer"
                          title="Bajar prioridad"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditStatus(s)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                          title="Editar"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {!s.isSystemDefault && (
                          <button
                            onClick={() => deleteProcessStatus(s.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveStatus} className="space-y-3.5">
                <span className="font-bold text-slate-900 dark:text-white text-xs block">
                  {editingStatus ? 'Editar Estado de Proceso' : 'Crear Nuevo Estado Comercial'}
                </span>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Nombre del Estado
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. En Seguimiento VIP"
                    value={statusName}
                    onChange={(e) => setStatusName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Color Representativo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={statusColor}
                      onChange={(e) => setStatusColor(e.target.value)}
                      className="w-10 h-8 rounded border border-slate-200 dark:border-[#1F2B3E] cursor-pointer"
                    />
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{statusColor}</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Descripción / Definición
                  </label>
                  <textarea
                    rows={2}
                    placeholder="¿Cuándo se mueve un prospecto a esta fase?"
                    value={statusDesc}
                    onChange={(e) => setStatusDesc(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStatusForm(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-600 dark:text-[#94A3B8] rounded-lg font-bold"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#E50914] text-white font-extrabold rounded-lg shadow-md"
                  >
                    Guardar Estado
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-[#1F2B3E] flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-800 dark:text-white rounded-lg text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. USERS MANAGEMENT MODAL
  if (activeModal === 'usersManagement') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 flex flex-col max-h-[85vh] text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-500 border border-amber-200 dark:border-amber-500/25">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">
                  Administración de Usuarios y Permisos
                </h3>
                <p className="text-slate-500 dark:text-[#94A3B8]">
                  Perfiles comerciales y contables con acceso al sistema Krake
                </p>
              </div>
            </div>
            <button onClick={closeModal} className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 overflow-y-auto space-y-4 flex-1">
            <div className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60">
              {users.map((u) => (
                <div key={u.id} className="py-3 flex items-center justify-between">
                  <div>
                    <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm block">{u.name}</strong>
                    <span className="text-slate-500 dark:text-[#94A3B8]">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-[#1A2337] text-slate-800 dark:text-white font-mono uppercase text-[10px] font-bold border border-slate-200 dark:border-[#1F2B3E]">
                      {u.role}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                      ● Activo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-[#1F2B3E] flex justify-end">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-800 dark:text-white rounded-lg text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
