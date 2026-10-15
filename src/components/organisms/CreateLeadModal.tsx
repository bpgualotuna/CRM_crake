import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { UserPlus, X, Check } from 'lucide-react';
import { Priority, LeadPlatform } from '../../types/crm';

export const CreateLeadModal: React.FC = () => {
  const { activeModal, closeModal, addLead, users, courses } = useCRM();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+593');
  const [email, setEmail] = useState('');
  const [platform, setPlatform] = useState<LeadPlatform>('Nextline');
  const [courseInterest, setCourseInterest] = useState(courses[0]?.title || 'Bootcamp Full Stack');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState<Priority>('Alta');
  const [motivoEstudio, setMotivoEstudio] = useState('');
  const [nextlineTagName, setNextlineTagName] = useState('BOOTCAMP-FULLSTACK');

  if (activeModal !== 'createLead') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phoneNumber) return;

    addLead({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
      platform,
      courseInterest,
      assignedTo: assignedTo || undefined,
      priority,
      motivoEstudio: motivoEstudio.trim(),
      nextlineTagName: platform === 'Nextline' ? nextlineTagName : null,
      nextlineAgentName: platform === 'Nextline' ? 'Asesor Virtual Krake' : null,
      processStatus: 'Nuevo',
    });

    closeModal();
  };

  const vendors = users.filter((u) => u.role === 'vendedor');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#1F2B3E] bg-slate-50 dark:bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-[#E50914] dark:bg-[#E50914]/15 dark:text-[#E50914] border border-red-200 dark:border-[#E50914]/25">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#F9FAFB]">Crear Prospecto Manual</h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
                Registrar lead directo en el CRM Krake
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ej: David Alejandro Gómez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Teléfono / WhatsApp *
              </label>
              <input
                type="text"
                required
                placeholder="+593 99 999 9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                placeholder="cliente@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Canal / Plataforma
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value="Nextline">Nextline (WhatsApp)</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="TikTok">TikTok</option>
                <option value="Instagram">Instagram</option>
                <option value="Orgánico">Orgánico / Recomendación</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Prioridad Inicial
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value="Alta">Alta (Listo para pagar)</option>
                <option value="Media">Media (Evaluando)</option>
                <option value="Baja">Baja (Curioso)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Curso de Interés
              </label>
              <select
                value={courseInterest}
                onChange={(e) => setCourseInterest(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
                Asignar a Vendedor
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">Dejar sin asignar (Distribución pendiente)</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs tracking-wider uppercase block mb-1">
              Motivo o Expectativa de Estudio
            </label>
            <textarea
              rows={2}
              placeholder="¿Qué busca lograr? (Ej: inserción laboral remota, tesis, etc.)"
              value={motivoEstudio}
              onChange={(e) => setMotivoEstudio(e.target.value)}
              className="w-full bg-white dark:bg-[#0B0F19] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-red-500/20"
            />
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
              <span>Crear Lead</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
