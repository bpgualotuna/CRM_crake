import React from 'react';
import { Calendar, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { CommittedPayment } from '../../types/crm';

interface InstallmentRowProps {
  installment: CommittedPayment;
  index: number;
}

export const InstallmentRow: React.FC<InstallmentRowProps> = ({ installment, index }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-[#090D16] border border-[#1F2B3E] text-xs">
      <div className="flex items-center gap-3">
        <span className="w-5 h-5 rounded-full bg-[#1A2337] text-[#94A3B8] font-mono text-[10px] font-bold flex items-center justify-center border border-[#1F2B3E]">
          {index + 1}
        </span>
        <div className="flex flex-col">
          <span className="font-semibold text-[#F9FAFB]">Cuota #{index + 1}</span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
            <Calendar className="w-3 h-3" />
            <span>Promesa: {installment.promisedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5 font-mono font-bold text-sm text-[#F9FAFB] tabular-nums">
          <DollarSign className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{installment.amount.toFixed(2)}</span>
        </div>

        <div>
          {installment.paid ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-semibold text-[10px]">
              <CheckCircle2 className="w-3 h-3" />
              Pagada
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-semibold text-[10px]">
              <Clock className="w-3 h-3" />
              Pendiente
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
