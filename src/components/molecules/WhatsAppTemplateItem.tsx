import React from 'react';
import { WhatsAppTemplate } from '../../types/crm';
import { Check, MessageSquare } from 'lucide-react';

interface WhatsAppTemplateItemProps {
  template: WhatsAppTemplate;
  isSelected: boolean;
  onSelect: () => void;
  previewVariables: {
    fullName: string;
    vendedor: string;
    curso: string;
    descuento: string;
  };
}

export const WhatsAppTemplateItem: React.FC<WhatsAppTemplateItemProps> = ({
  template,
  isSelected,
  onSelect,
  previewVariables,
}) => {
  const getInterpolatedBody = () => {
    return template.body
      .replace(/{{fullName}}/g, previewVariables.fullName || 'Estudiante')
      .replace(/{{vendedor}}/g, previewVariables.vendedor || 'Asesor Krake')
      .replace(/{{curso}}/g, previewVariables.curso || 'Bootcamp KRAKE')
      .replace(/{{descuento}}/g, previewVariables.descuento || '100');
  };

  return (
    <div
      onClick={onSelect}
      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
        isSelected
          ? 'bg-emerald-50 dark:bg-[#25D366]/10 border-[#25D366] ring-1 ring-[#25D366]/50'
          : 'bg-slate-50 dark:bg-[#121927] border-slate-200 dark:border-[#1F2B3E] hover:border-slate-300 dark:hover:border-[#2D3F5C] hover:bg-slate-100 dark:hover:bg-[#1A2337]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#25D366]" />
          <span className="text-xs font-bold text-slate-900 dark:text-[#F9FAFB]">{template.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-200 dark:bg-[#1A2337] text-slate-700 dark:text-[#94A3B8] border border-slate-300 dark:border-[#1F2B3E]">
            {template.category}
          </span>
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${
              isSelected
                ? 'bg-[#25D366] border-[#25D366] text-white'
                : 'border-slate-300 dark:border-[#1F2B3E] bg-white dark:bg-[#090D16]'
            }`}
          >
            {isSelected && <Check className="w-2.5 h-2.5" />}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-slate-600 dark:text-[#94A3B8] line-clamp-2 leading-relaxed">
        {getInterpolatedBody()}
      </p>
    </div>
  );
};
