import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Reminder } from '../../types/crm';
import { useCRM } from '../../context/CRMContext';

interface ReminderItemProps {
  reminder: Reminder;
  leadId: string;
}

export const ReminderItem: React.FC<ReminderItemProps> = ({ reminder, leadId }) => {
  const { completeReminder } = useCRM();

  const isExpired = !reminder.isCompleted && new Date(reminder.scheduledFor) < new Date();
  const isToday =
    !reminder.isCompleted &&
    new Date(reminder.scheduledFor).toDateString() === new Date().toDateString();

  const getStatusBadge = () => {
    if (reminder.isCompleted) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-3 h-3" />
          Completado
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <AlertTriangle className="w-3 h-3" />
          Vencido
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" />
          Para Hoy
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <Calendar className="w-3 h-3" />
        Próximo
      </span>
    );
  };

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all ${
        reminder.isCompleted
          ? 'bg-[#090D16]/50 border-[#1F2B3E]/60 opacity-70'
          : isExpired
          ? 'bg-rose-500/5 border-rose-500/30'
          : 'bg-[#090D16] border-[#1F2B3E]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wide">
            {reminder.type === 'cobro'
              ? '💳 Recordatorio de Cobro'
              : reminder.type === 'seguimiento_whatsapp'
              ? '💬 Seguimiento WhatsApp'
              : '📞 Seguimiento Telefónico'}
          </span>
        </div>
        {getStatusBadge()}
      </div>

      <p className="text-xs text-[#94A3B8] mt-2 leading-relaxed">{reminder.message}</p>

      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1F2B3E]/60 text-xs">
        <span className="text-[11px] text-[#64748B] font-mono tabular-nums">
          Programado: {new Date(reminder.scheduledFor).toLocaleString('es-EC', { dateStyle: 'short', timeStyle: 'short' })}
        </span>

        {!reminder.isCompleted && (
          <button
            onClick={() => completeReminder(leadId, reminder.id)}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Marcar Hecho</span>
          </button>
        )}
      </div>
    </div>
  );
};
