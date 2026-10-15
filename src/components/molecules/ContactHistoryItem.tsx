import React from 'react';
import { PhoneCall, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ContactHistory } from '../../types/crm';

interface ContactHistoryItemProps {
  item: ContactHistory;
}

export const ContactHistoryItem: React.FC<ContactHistoryItemProps> = ({ item }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'call':
        return <PhoneCall className="w-4 h-4 text-blue-400" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-[#25D366]" />;
      case 'intento':
        return <AlertCircle className="w-4 h-4 text-amber-400" />;
      case 'status_change':
      default:
        return <RefreshCw className="w-4 h-4 text-purple-400" />;
    }
  };

  const getBadgeStyle = () => {
    switch (item.status) {
      case 'completado':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'fallido':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/25';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/25';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#090D16] border border-[#1F2B3E] hover:border-[#2D3F5C] transition-colors">
      <div className="p-2 rounded-lg bg-[#121927] border border-[#1F2B3E] shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F9FAFB]">{item.userName}</span>
            <span className="text-[10px] text-[#64748B] font-mono tabular-nums">
              {item.date} · {item.time}
            </span>
          </div>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${getBadgeStyle()}`}
          >
            {item.status}
          </span>
        </div>

        <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed break-words">
          {item.reason}
        </p>
      </div>
    </div>
  );
};
