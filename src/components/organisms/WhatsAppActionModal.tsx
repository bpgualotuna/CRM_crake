import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { WhatsAppTemplateItem } from '../molecules/WhatsAppTemplateItem';
import { MessageSquare, Send, ExternalLink, X, Sparkles } from 'lucide-react';

export const WhatsAppActionModal: React.FC = () => {
  const { activeModal, modalLead, closeModal, whatsappTemplates, currentUser, sendWhatsApp } =
    useCRM();

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(whatsappTemplates[0]?.id || '');
  const [customText, setCustomText] = useState('');

  const selectedTemplate =
    whatsappTemplates.find((t) => t.id === selectedTemplateId) || whatsappTemplates[0];

  useEffect(() => {
    if (selectedTemplate && modalLead) {
      const interpolated = selectedTemplate.body
        .replace(/{{fullName}}/g, modalLead.fullName || 'Estudiante')
        .replace(/{{vendedor}}/g, currentUser.name || 'Asesor Krake')
        .replace(/{{curso}}/g, modalLead.courseInterest || 'Bootcamp KRAKE')
        .replace(/{{descuento}}/g, '100');
      setCustomText(interpolated);
    }
  }, [selectedTemplateId, modalLead, currentUser]);

  if (activeModal !== 'whatsapp' || !modalLead) return null;

  const handleSend = (openRealWhatsApp = false) => {
    sendWhatsApp(modalLead.id, selectedTemplateId, customText);

    if (openRealWhatsApp) {
      // Clean phone number: remove + and spaces
      const cleanPhone = modalLead.phoneNumber.replace(/[^0-9]/g, '');
      const encodedMsg = encodeURIComponent(customText);
      const url = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
      window.open(url, '_blank');
    }

    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-[#25D366]/15 dark:text-[#25D366] border border-emerald-200 dark:border-[#25D366]/25">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">Enviar WhatsApp Predefinido</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Destinatario: <strong className="text-slate-900 dark:text-white font-bold">{modalLead.fullName}</strong> ({modalLead.phoneNumber})
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

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Template Selection */}
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-2">
              1. Selecciona una Plantilla Predeterminada
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {whatsappTemplates.map((template) => (
                <WhatsAppTemplateItem
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={() => setSelectedTemplateId(template.id)}
                  previewVariables={{
                    fullName: modalLead.fullName,
                    vendedor: currentUser.name,
                    curso: modalLead.courseInterest || 'Bootcamp Full Stack',
                    descuento: '100',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Message Customization */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>2. Mensaje Personalizado Listo para Enviar</span>
              </label>
              <span className="text-[10px] text-slate-500 dark:text-[#64748B]">Variables auto-reemplazadas</span>
            </div>
            <textarea
              rows={4}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] rounded-xl p-3 text-xs text-slate-900 dark:text-[#F9FAFB] focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-emerald-500/20 font-sans leading-relaxed resize-y"
            />
          </div>

          {/* Action notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-[#1F2B3E] text-slate-600 dark:text-[#94A3B8] text-[11px] leading-relaxed">
            💡 Enviar mensaje registra automáticamente la interacción en la bitácora del lead y actualiza su estado en el CRM.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between gap-3 text-xs">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A2337] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2B3E] font-semibold cursor-pointer"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSend(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 dark:bg-[#1A2337] hover:bg-slate-700 dark:hover:bg-[#232F42] text-white font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Simular Envío</span>
            </button>

            <button
              type="button"
              onClick={() => handleSend(true)}
              className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp Web</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
