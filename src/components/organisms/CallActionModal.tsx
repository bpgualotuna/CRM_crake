import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Phone, Calendar, Clock, X, Check } from 'lucide-react';

export const CallActionModal: React.FC = () => {
  const { activeModal, modalLead, closeModal, recordCall } = useCRM();

  const [reason, setReason] = useState('Llamada informativa inicial sobre Bootcamp');
  const [notes, setNotes] = useState('');
  const [scheduleReminder, setScheduleReminder] = useState(false);
  const [reminderDate, setReminderDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [reminderTime, setReminderTime] = useState('16:00');

  if (activeModal !== 'call' || !modalLead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reminderIso = scheduleReminder ? `${reminderDate}T${reminderTime}:00Z` : '';
    recordCall(modalLead.id, reason, notes, scheduleReminder, reminderIso);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-600/15 dark:text-blue-400 border border-blue-200 dark:border-blue-500/25">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">Registrar Llamada</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Prospecto: <strong className="text-slate-900 dark:text-white font-bold">{modalLead.fullName}</strong> ({modalLead.phoneNumber})
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

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Motivo de la Llamada
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
            >
              <option value="Llamada informativa inicial sobre Bootcamp">
                Llamada informativa inicial sobre Bootcamp
              </option>
              <option value="Seguimiento de pensum y temario académico">
                Seguimiento de pensum y temario académico
              </option>
              <option value="Negociación de facilidades de pago y descuento">
                Negociación de facilidades de pago y descuento
              </option>
              <option value="Confirmación de abono o transferencia">
                Confirmación de abono o transferencia
              </option>
              <option value="Cliente no contestó (timbró sin respuesta)">
                Cliente no contestó (timbró sin respuesta)
              </option>
              <option value="Otro motivo de contacto">Otro motivo de contacto</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Notas / Observaciones del Contacto
            </label>
            <textarea
              rows={3}
              placeholder="¿Qué conversaron? ¿Interés real? ¿Fecha tentativa de pago?..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20 resize-y"
            />
          </div>

          {/* Schedule Reminder Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2B3E] space-y-3">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 dark:text-[#F9FAFB]">
              <input
                type="checkbox"
                checked={scheduleReminder}
                onChange={(e) => setScheduleReminder(e.target.checked)}
                className="rounded text-[#E50914] focus:ring-[#E50914] w-4 h-4"
              />
              <span>Programar Recordatorio Automático</span>
            </label>

            {scheduleReminder && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-[#1F2B3E]">
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-[#94A3B8] font-bold block mb-1">
                    Fecha de Alerta
                  </label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-600 dark:text-[#94A3B8] font-bold block mb-1">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-white dark:bg-[#121927] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A2337] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2B3E] font-semibold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer text-xs uppercase tracking-wider"
            >
              <Check className="w-4 h-4" />
              <span>Guardar Llamada (+1 Intento)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
