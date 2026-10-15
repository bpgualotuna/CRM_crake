import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Badge } from '../atoms/Badge';
import { ContactHistoryItem } from '../molecules/ContactHistoryItem';
import { ReminderItem } from '../molecules/ReminderItem';
import {
  X,
  Phone,
  MessageSquare,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Mail,
  GraduationCap,
  Snowflake,
  Send,
  Plus,
  FileText,
  History,
  Bell,
  Radio,
  CheckCircle2,
  User,
  ShieldCheck,
  RotateCcw,
  Tag,
  AlertTriangle,
} from 'lucide-react';

export const LeadDetailModal: React.FC = () => {
  const {
    selectedLead,
    setSelectedLeadId,
    openModal,
    addInternalNote,
    addReminder,
    incrementAttempts,
    moveToCold,
    restoreFromCold,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'history' | 'reminders' | 'notes'>('history');

  // Internal note text
  const [newNoteContent, setNewNoteContent] = useState('');

  // Reminder form
  const [reminderType, setReminderType] = useState<
    'cobro' | 'seguimiento_llamada' | 'seguimiento_whatsapp'
  >('seguimiento_llamada');
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminderDate, setReminderDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [reminderTime, setReminderTime] = useState('15:00');

  if (!selectedLead) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    addInternalNote(selectedLead.id, newNoteContent.trim());
    setNewNoteContent('');
  };

  const handleCreateReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderMessage.trim() || !reminderDate) return;

    const scheduledIso = new Date(
      `${reminderDate}T${reminderTime || '12:00'}:00`
    ).toISOString();

    addReminder(selectedLead.id, {
      leadId: selectedLead.id,
      leadName: selectedLead.fullName,
      type: reminderType,
      scheduledFor: scheduledIso,
      message: reminderMessage.trim(),
      priority: 'Alta',
    });

    setReminderMessage('');
  };

  const sales = selectedLead.sales || [];
  const contactHistory = selectedLead.contactHistory || [];
  const reminders = selectedLead.reminders || [];
  const internalNotes = selectedLead.internalNotes || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      {/* Cuerpo del Modal 2XL Centrado */}
      <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col rounded-2xl shadow-2xl transition-all bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-slate-100 text-xs">
        {/* Cabecera Destacada del Modal */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50/70 dark:bg-[#0B0F19] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 dark:text-[#F9FAFB] tracking-tight">
                {selectedLead.fullName}
              </h1>
              {selectedLead.isCold && <Badge variant="cold" size="sm" />}
              <Badge variant="status" status={selectedLead.processStatus} size="sm" />
              <Badge variant="priority" priority={selectedLead.priority} size="sm" />
              <Badge variant="platform" platform={selectedLead.platform} size="sm" />
            </div>

            {/* Subtítulo con Teléfono, Correo y badges visibles */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#94A3B8] font-mono mt-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-slate-800 dark:text-[#F9FAFB] font-bold">
                <Phone className="w-3.5 h-3.5 text-[#E50914]" />
                {selectedLead.phoneNumber}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 font-sans text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                {selectedLead.email}
              </span>
              {selectedLead.nextlineTagName && (
                <>
                  <span>·</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {selectedLead.nextlineTagName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Grupo de Botones de Acción de Alto Impacto (Grandes y Resaltados) */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              onClick={() => openModal('call', selectedLead)}
              type="button"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>📞 Llamar</span>
            </button>

            <button
              onClick={() => openModal('whatsapp', selectedLead)}
              type="button"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>💬 WhatsApp</span>
            </button>

            <button
              onClick={() => openModal('sale', selectedLead)}
              type="button"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-black text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <DollarSign className="w-4 h-4" />
              <span>💰 Registrar Venta</span>
            </button>

            {/* Botón de Cerrar Modal [ ✕ ] */}
            <button
              onClick={() => setSelectedLeadId(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1A2337] transition-colors ml-1 cursor-pointer"
              title="Cerrar modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cuerpo Interior en Dos Columnas (Layout Dividido 35% / 65%) */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Columna Izquierda (35% del ancho - Ficha Técnica del Lead) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-3.5 shadow-sm">
              <span className="font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider text-[11px] block">
                Ficha Técnica del Lead
              </span>

              <div className="space-y-3">
                {/* Curso / Programa */}
                <div>
                  <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                    Curso o Programa de Interés
                  </span>
                  <strong className="text-slate-900 dark:text-[#F9FAFB] text-sm flex items-center gap-1.5 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>{selectedLead.courseInterest || 'Bootcamp Full Stack Web & Cloud'}</span>
                  </strong>
                </div>

                {/* Ubicación & Canal */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-[#1F2B3E]/60">
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                      Ubicación / Provincia
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-[#F9FAFB] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
                      {selectedLead.provinciaEstado || 'Pichincha, Quito'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                      Canal de Captación
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-[#F9FAFB] mt-0.5 block">
                      {selectedLead.platform || 'Nextline'}
                    </span>
                  </div>
                </div>

                {/* Asesor Asignado & Fecha */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-[#1F2B3E]/60">
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                      Asesor Asignado
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-[#F9FAFB] mt-0.5 block">
                      {selectedLead.assignedToName || 'Sin Asignar'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                      Fecha de Asignación
                    </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 mt-0.5 block">
                      {new Date(selectedLead.createdTime).toLocaleDateString('es-EC')}
                    </span>
                  </div>
                </div>

                {/* Contador Interactivo de Intentos de Contacto con botón [ + Sumar Intento ] */}
                <div className="p-3 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px]">
                      Intentos de Contacto
                    </span>
                    <span className="text-base font-black text-amber-600 dark:text-amber-400 font-mono">
                      {selectedLead.attempts} intentos
                    </span>
                  </div>

                  <button
                    onClick={() => incrementAttempts(selectedLead.id)}
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Sumar Intento</span>
                  </button>
                </div>

                {/* Motivo de estudio / Observaciones iniciales */}
                {selectedLead.motivoEstudio && (
                  <div className="pt-2 border-t border-slate-200 dark:border-[#1F2B3E]/60">
                    <span className="text-slate-500 dark:text-[#64748B] block text-[11px] mb-1">
                      Motivo de Estudio / Observaciones
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic p-3 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] leading-relaxed">
                      "{selectedLead.motivoEstudio}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sincronización Nextline */}
            {selectedLead.platform === 'Nextline' && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#0e2118] border border-emerald-200 dark:border-emerald-500/30 space-y-2">
                <span className="font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5 text-xs">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Sincronización Nextline WhatsApp</span>
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 dark:text-[#94A3B8]">Etiqueta ChatControl:</span>
                    <p className="font-mono font-bold text-slate-800 dark:text-white">
                      {selectedLead.nextlineTagName || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#94A3B8]">Bot de Atención:</span>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {selectedLead.nextlineAgentName || 'Asesor Virtual'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Venta Registrada */}
            {sales.length > 0 && (
              <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-[#090D16] border border-emerald-300 dark:border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Venta Registrada</span>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono">
                    {sales[0].status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B]">Total Acordado:</span>
                    <strong className="text-slate-900 dark:text-white font-mono block text-sm">
                      ${sales[0].totalAmount}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-[#64748B]">Abono Inicial:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono block text-sm">
                      ${sales[0].amountPaid}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Acción de Congelador de Fríos */}
            <div>
              {selectedLead.isCold ? (
                <button
                  onClick={() => restoreFromCold(selectedLead.id)}
                  type="button"
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reactivar Prospecto al Embudo</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    const reason = prompt('Motivo de enfriamiento (ej. Sin presupuesto, No contesta llamadas):');
                    if (reason) moveToCold(selectedLead.id, reason);
                  }}
                  type="button"
                  className="w-full py-2 px-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 hover:bg-cyan-100 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>Enviar a Congelador de Fríos</span>
                </button>
              )}
            </div>
          </div>

          {/* Columna Derecha (65% del ancho - Pestañas Interactivas) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Barra de pestañas navegable: [ Historial de Contacto ], [ Recordatorios ], [ Notas Internas ] */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E]">
              <button
                onClick={() => setActiveTab('history')}
                type="button"
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-white dark:bg-[#1A2337] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-[#2D3F5C]'
                    : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <History className="w-4 h-4 text-blue-500" />
                <span>Historial de Contacto ({contactHistory.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('reminders')}
                type="button"
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'reminders'
                    ? 'bg-white dark:bg-[#1A2337] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-[#2D3F5C]'
                    : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Bell className="w-4 h-4 text-amber-500" />
                <span>Recordatorios ({reminders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('notes')}
                type="button"
                className={`flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-[#1A2337] text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-[#2D3F5C]'
                    : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4 text-[#E50914]" />
                <span>Notas Internas ({internalNotes.length})</span>
              </button>
            </div>

            {/* CONTENIDO DE PESTAÑAS */}
            <div className="flex-1 overflow-y-auto max-h-[500px] pr-1 space-y-4">
              {/* PESTAÑA 1: HISTORIAL DE CONTACTO */}
              {activeTab === 'history' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#1F2B3E]">
                    <span className="font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider text-[11px]">
                      Línea de Tiempo de Interacciones
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-[#64748B]">
                      Registros de llamadas, WhatsApp y eventos
                    </span>
                  </div>

                  {contactHistory.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 dark:text-[#64748B] rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E]">
                      No hay registros de contacto previos. Usa los botones superiores de <strong>Llamar</strong> o <strong>WhatsApp</strong> para iniciar.
                    </div>
                  ) : (
                    contactHistory.map((item) => (
                      <ContactHistoryItem key={item.id} item={item} />
                    ))
                  )}
                </div>
              )}

              {/* PESTAÑA 2: RECORDATORIOS */}
              {activeTab === 'reminders' && (
                <div className="space-y-4">
                  {/* Formulario integrado para agendar uno nuevo */}
                  <form
                    onSubmit={handleCreateReminder}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-3"
                  >
                    <span className="font-bold text-slate-900 dark:text-white block text-xs">
                      Agendar Nuevo Recordatorio
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#94A3B8] block mb-1">
                          Motivo / Tipo
                        </label>
                        <select
                          value={reminderType}
                          onChange={(e) => setReminderType(e.target.value as any)}
                          className="w-full p-2 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-white text-xs"
                        >
                          <option value="seguimiento_llamada">📞 Seguimiento Llamada</option>
                          <option value="seguimiento_whatsapp">💬 Seguimiento WhatsApp</option>
                          <option value="cobro">💳 Recordatorio Cobro</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#94A3B8] block mb-1">
                          Fecha
                        </label>
                        <input
                          type="date"
                          required
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                          className="w-full p-2 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-white text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-[#94A3B8] block mb-1">
                          Hora
                        </label>
                        <input
                          type="time"
                          required
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="w-full p-2 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-[#94A3B8] block mb-1">
                        Detalle del Recordatorio
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ej. Llamar para confirmar comprobante de depósito..."
                        value={reminderMessage}
                        onChange={(e) => setReminderMessage(e.target.value)}
                        className="w-full p-2 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-white text-xs"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        Guardar Recordatorio
                      </button>
                    </div>
                  </form>

                  {/* Lista de recordatorios del lead */}
                  <div className="space-y-2">
                    {reminders.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-[#64748B]">
                        No hay recordatorios agendados para este prospecto.
                      </div>
                    ) : (
                      reminders.map((rem) => (
                        <ReminderItem key={rem.id} reminder={rem} leadId={selectedLead.id} />
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* PESTAÑA 3: NOTAS INTERNAS */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <form
                    onSubmit={handleAddNote}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-2.5"
                  >
                    <label className="font-bold text-slate-900 dark:text-white block text-xs">
                      Agregar Comentario / Nota Interna
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Escribe aquí las observaciones confidenciales sobre este prospecto (ej. Horario preferido, objeciones planteadas)..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      className="w-full p-3 rounded-lg bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-white text-xs resize-y"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Guardar Nota</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5">
                    {internalNotes.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-[#64748B]">
                        No hay notas internas registradas aún.
                      </div>
                    ) : (
                      internalNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#64748B]">
                            <strong className="text-slate-900 dark:text-white font-bold flex items-center gap-1">
                              <User className="w-3 h-3 text-[#E50914]" />
                              {note.authorName}
                            </strong>
                            <span className="font-mono">
                              {new Date(note.createdAt).toLocaleDateString('es-EC')} · {new Date(note.createdAt).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap text-xs leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#0B0F19] flex justify-end">
          <button
            onClick={() => setSelectedLeadId(null)}
            type="button"
            className="px-5 py-2 bg-slate-200 dark:bg-[#1A2337] text-slate-800 dark:text-white font-extrabold rounded-lg text-xs hover:bg-slate-300 dark:hover:bg-[#232F42] transition-colors cursor-pointer"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
