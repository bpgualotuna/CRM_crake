import React, { useState } from 'react';
import { useCRM } from '../../../context/CRMContext';
import {
  ArrowLeft,
  CalendarDays,
  Plus,
  Edit2,
  Trash2,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  DollarSign,
  UserPlus,
  Calendar,
  X,
  ChevronRight,
} from 'lucide-react';
import { CRMEvent } from '../../../types/crm';

export const EventsScreen: React.FC = () => {
  const {
    events,
    courses,
    leads,
    addEvent,
    updateEvent,
    deleteEvent,
    inscribeLeadToEvent,
    updateParticipantAttendance,
    setAdminActiveScreen,
  } = useCRM();

  // Selected event for detail and participants management
  const [selectedEventId, setSelectedEventId] = useState<string | null>(events[0]?.id || null);

  // Modal for Create / Edit Event
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CRMEvent | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState('2026-10-30');
  const [formTime, setFormTime] = useState('19:00');
  const [formSpeaker, setFormSpeaker] = useState('');
  const [formCourseId, setFormCourseId] = useState(courses[0]?.id || '');
  const [formCapacity, setFormCapacity] = useState(100);

  // Inscribe Lead Selector state
  const [selectedLeadToInscribe, setSelectedLeadToInscribe] = useState('');

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('19:00');
    setFormSpeaker('Mentor KrakeDev');
    setFormCourseId(courses[0]?.id || '');
    setFormCapacity(100);
    setShowEventModal(true);
  };

  const handleOpenEdit = (evt: CRMEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEvent(evt);
    setFormTitle(evt.title);
    setFormDate(evt.date);
    setFormTime(evt.time);
    setFormSpeaker(evt.speaker);
    setFormCourseId(evt.associatedCourseId);
    setFormCapacity(evt.capacity);
    setShowEventModal(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = courses.find((c) => c.id === formCourseId);
    const courseTitle = courseObj ? courseObj.title : 'Bootcamp Krake';

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        title: formTitle,
        date: formDate,
        time: formTime,
        speaker: formSpeaker,
        associatedCourseId: formCourseId,
        associatedCourseTitle: courseTitle,
        capacity: Number(formCapacity),
      });
    } else {
      addEvent({
        title: formTitle,
        date: formDate,
        time: formTime,
        speaker: formSpeaker,
        associatedCourseId: formCourseId,
        associatedCourseTitle: courseTitle,
        capacity: Number(formCapacity),
        status: 'Programado',
      });
    }
    setShowEventModal(false);
  };

  const handleInscribeLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadToInscribe || !currentEvent) return;
    inscribeLeadToEvent(currentEvent.id, selectedLeadToInscribe);
    setSelectedLeadToInscribe('');
  };

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
              <CalendarDays className="w-5 h-5 text-orange-500" />
              <span>Gestión de Eventos, Masterclasses & Webinars</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Administración de talleres virtuales, inscripción de leads y conversiones en vivo.
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          type="button"
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Evento</span>
        </button>
      </div>

      {/* Main Layout: Events List (Left) + Selected Event & Participants Manager (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Events Grid */}
        <div className="space-y-3">
          <span className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider text-xs block">
            Eventos Disponibles ({events.length})
          </span>

          <div className="space-y-3">
            {events.map((evt) => {
              const isSelected = currentEvent?.id === evt.id;
              const attendeesCount = evt.participants.length;

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 shadow-sm ${
                    isSelected
                      ? 'bg-red-50/70 dark:bg-[#1A2337] border-[#E50914] ring-1 ring-[#E50914]'
                      : 'bg-white dark:bg-[#121927] border-slate-200 dark:border-[#1F2B3E] hover:border-slate-300 dark:hover:border-[#2D3F5C]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-[#F9FAFB] line-clamp-2">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleOpenEdit(evt, e)}
                        className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white"
                        title="Editar evento"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`¿Eliminar evento "${evt.title}"?`)) {
                            deleteEvent(evt.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500"
                        title="Eliminar evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-[#94A3B8]">
                    <span className="font-mono">{evt.date} · {evt.time}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {evt.speaker}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-[#1F2B3E]/60">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#090D16] text-slate-700 dark:text-[#94A3B8]">
                      {attendeesCount} / {evt.capacity} cupos
                    </span>
                    <span className="font-bold text-[#E50914] flex items-center gap-1 text-[11px]">
                      <span>Ver participantes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Event Detail & Participants Table */}
        {currentEvent && (
          <div className="lg:col-span-2 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm p-6 space-y-6 text-xs">
            {/* Event Header Banner */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E50914] block">
                  Evento Seleccionado
                </span>
                <h2 className="text-base font-black text-slate-900 dark:text-[#F9FAFB] mt-0.5">
                  {currentEvent.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-[#94A3B8] mt-1 font-mono">
                  <span>📅 {currentEvent.date} ({currentEvent.time})</span>
                  <span>🎙️ {currentEvent.speaker}</span>
                  <span>🎓 {currentEvent.associatedCourseTitle}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {currentEvent.participants.length}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] block">
                  Inscritos confirmados
                </span>
              </div>
            </div>

            {/* Inscribe Lead to this Event Form */}
            <form
              onSubmit={handleInscribeLead}
              className="p-4 rounded-xl bg-white dark:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
            >
              <div className="flex-1">
                <label className="font-bold text-slate-700 dark:text-[#94A3B8] text-[11px] block mb-1">
                  Inscribir Prospecto del CRM a este Evento
                </label>
                <select
                  value={selectedLeadToInscribe}
                  onChange={(e) => setSelectedLeadToInscribe(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                >
                  <option value="">Selecciona un lead de la cartera...</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} ({l.phoneNumber}) - {l.processStatus}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={!selectedLeadToInscribe}
                className="sm:self-end px-4 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold text-xs shadow transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Inscribir</span>
              </button>
            </form>

            {/* Participants Table */}
            <div className="space-y-3">
              <span className="font-bold text-slate-700 dark:text-[#94A3B8] uppercase tracking-wider text-xs block">
                Lista de Asistentes e Invitados ({currentEvent.participants.length})
              </span>

              <div className="border border-slate-200 dark:border-[#1F2B3E] rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-[#090D16] border-b border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8] font-bold text-[11px] uppercase">
                      <th className="py-2.5 px-3">Lead / Participante</th>
                      <th className="py-2.5 px-3">Contacto</th>
                      <th className="py-2.5 px-3">Asistencia</th>
                      <th className="py-2.5 px-3 text-right">Cierre en Evento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-slate-900 dark:text-[#F9FAFB]">
                    {currentEvent.participants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-[#64748B]">
                          No hay leads inscritos aún en este evento. Usa el selector arriba para asignar prospectos.
                        </td>
                      </tr>
                    ) : (
                      currentEvent.participants.map((participant) => (
                        <tr key={participant.leadId} className="hover:bg-slate-50 dark:hover:bg-[#1A2337]/50">
                          <td className="py-3 px-3">
                            <strong className="text-slate-900 dark:text-[#F9FAFB] block">
                              {participant.leadName}
                            </strong>
                            <span className="text-[10px] text-slate-500 dark:text-[#64748B]">
                              Inscrito: {participant.inscribedAt}
                            </span>
                          </td>

                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-[#94A3B8]">
                            {participant.phoneNumber}
                          </td>

                          <td className="py-3 px-3">
                            <select
                              value={participant.attendanceStatus}
                              onChange={(e) =>
                                updateParticipantAttendance(
                                  currentEvent.id,
                                  participant.leadId,
                                  e.target.value as any
                                )
                              }
                              className={`p-1 rounded text-xs font-bold border ${
                                participant.attendanceStatus === 'Asistió'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                                  : participant.attendanceStatus === 'No asistió'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30'
                              }`}
                            >
                              <option value="Confirmado">Confirmado</option>
                              <option value="Asistió">Asistió</option>
                              <option value="No asistió">No asistió</option>
                            </select>
                          </td>

                          <td className="py-3 px-3 text-right">
                            {participant.closedSaleDuringEvent ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold">
                                <DollarSign className="w-3 h-3" />
                                Venta Cerrada (${participant.saleAmount || 750})
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 dark:text-[#64748B]">
                                Pendiente
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0E1422] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl p-6 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
              <h3 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB]">
                {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento / Webinar'}
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5">
              <div>
                <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                  Título del Evento
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Masterclass en Vivo de Backend con NestJS"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Hora (24h)
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Expositor / Speaker
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Ing. Carlos Méndez"
                    value={formSpeaker}
                    onChange={(e) => setFormSpeaker(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                    Cupo Máximo
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                  Curso Asociado
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => setFormCourseId(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] text-xs"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-[#1F2B3E]">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-[#121927] text-slate-600 dark:text-[#94A3B8] rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#E50914] text-white font-extrabold rounded-lg shadow-md"
                >
                  {editingEvent ? 'Guardar Cambios' : 'Crear Evento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
