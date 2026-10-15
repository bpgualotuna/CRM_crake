import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Radio, Shield, Copy, Check, Terminal, Play, X, Key } from 'lucide-react';

export const NextlineIntegrationModal: React.FC = () => {
  const { activeModal, closeModal, addLead } = useCRM();

  const [copiedKey, setCopiedKey] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<string | null>(null);

  if (activeModal !== 'nextlineIntegration') return null;

  const webhookUrl = 'https://api.clearminds.edu.ec/api/v1/webhooks/nextline';
  const hmacKey = 'krake_live_sec_994a3b8_hmac_256_nextline';

  const handleCopyKey = () => {
    navigator.clipboard.writeText(hmacKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSimulateWebhook = () => {
    setIsSimulating(true);
    setSimulatedResult(null);

    setTimeout(() => {
      const names = [
        'Mateo Sebastián Torres',
        'Doménica Valeria Castro',
        'Alejandro Javier Andrade',
      ];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPhone = `+593 99 ${Math.floor(1000000 + Math.random() * 9000000)}`;

      addLead({
        fullName: randomName,
        phoneNumber: randomPhone,
        email: `${randomName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        platform: 'Nextline',
        nextlineContactId: `nl-live-${Date.now().toString().slice(-5)}`,
        nextlineTagName: 'BOOTCAMP-FULLSTACK',
        nextlineAgentName: 'Nextline AI Assistant',
        formName: 'WSP KRAKE DEV FULLSTACK',
        courseInterest: 'Bootcamp Full Stack Web & Cloud',
        processStatus: 'Nuevo',
        priority: 'Alta',
        motivoEstudio: 'Simulación de prospecto entrando en vivo desde WhatsApp.',
      });

      setIsSimulating(false);
      setSimulatedResult(
        `HTTP 201 Created: Lead inyectado exitosamente con ID nl-live y Action Log creado en el timeline de auditoría.`
      );
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/25">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">
                Integración Nextline (WhatsApp Webhook)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Canal de sincronización bidireccional y recepción de leads
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

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Status badge */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-[#121927] border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <div>
                <span className="font-bold text-sm text-slate-900 dark:text-[#F9FAFB]">
                  Servicio Nextline Operativo (Server-Sent Events)
                </span>
                <p className="text-slate-600 dark:text-[#94A3B8] text-[11px] mt-0.5">
                  Conexión activa recibiendo eventos de ChatControl WhatsApp.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold text-[11px] font-mono border border-emerald-200 dark:border-emerald-500/30">
              200 OK
            </span>
          </div>

          {/* Webhook endpoint box */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block">
              URL del Webhook (Payload Ingest)
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] font-mono text-[11px] text-slate-900 dark:text-[#F9FAFB]">
              <span className="flex-1 truncate">{webhookUrl}</span>
              <button
                onClick={() => navigator.clipboard.writeText(webhookUrl)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                title="Copiar URL"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HMAC Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Clave Secreta HMAC (X-Nextline-Signature)</span>
            </label>
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] font-mono text-[11px] text-slate-900 dark:text-[#F9FAFB]">
              <span className="flex-1 truncate">{hmacKey}</span>
              <button
                onClick={handleCopyKey}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer flex items-center gap-1 text-[11px]"
              >
                {copiedKey ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedKey ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Live Simulator button */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 dark:text-[#F9FAFB] block">Simulador de Evento Webhook</span>
                <p className="text-slate-500 dark:text-[#94A3B8] text-[11px]">
                  Inyecta un prospecto en vivo vía webhook simulado con payload real.
                </p>
              </div>
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleSimulateWebhook}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isSimulating ? 'Inyectando...' : 'Disparar Webhook'}</span>
              </button>
            </div>

            {simulatedResult && (
              <div className="p-3 rounded-lg bg-white dark:bg-[#121927] border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-[11px] flex items-start gap-2">
                <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{simulatedResult}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 rounded-lg bg-white dark:bg-[#1A2337] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#1F2B3E] font-semibold text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
