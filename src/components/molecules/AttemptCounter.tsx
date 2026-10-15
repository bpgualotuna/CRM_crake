import React from 'react';
import { Plus, PhoneCall } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface AttemptCounterProps {
  leadId: string;
  attempts: number;
  className?: string;
  compact?: boolean;
}

export const AttemptCounter: React.FC<AttemptCounterProps> = ({
  leadId,
  attempts,
  className = '',
  compact = false,
}) => {
  const { incrementAttempts } = useCRM();

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    incrementAttempts(leadId);
  };

  const getHeatColor = (count: number) => {
    if (count === 0) return 'text-[#94A3B8] bg-[#1A2337] border-[#1F2B3E]';
    if (count < 3) return 'text-amber-400 bg-amber-500/10 border-amber-500/25';
    return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={`Intentos de contacto realizados: ${attempts}`}
    >
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-mono tabular-nums font-semibold ${getHeatColor(
          attempts
        )}`}
      >
        <PhoneCall className="w-3 h-3 shrink-0" />
        <span>{attempts}</span>
      </div>

      <button
        onClick={handleIncrement}
        type="button"
        title="Registrar llamada no contestada (+1 intento)"
        className="p-1 rounded bg-[#121927] hover:bg-[#E50914] text-[#94A3B8] hover:text-white border border-[#1F2B3E] hover:border-[#E50914] transition-all cursor-pointer active:scale-95"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};
