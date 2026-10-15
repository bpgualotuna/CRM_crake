import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  UserPlus,
  Users,
  Target,
  Shuffle,
  Radio,
  Snowflake,
  ListOrdered,
  Tag,
  CalendarDays,
  FileSpreadsheet,
  Download,
  ArrowRight,
} from 'lucide-react';

export const AdminAppsHub: React.FC = () => {
  const { openModal, exportLeadsCSV, exportSalesCSV, leads, setAdminActiveScreen } = useCRM();

  const tools = [
    {
      id: 'distribute',
      title: 'Distribuir Leads (Pantalla Completa)',
      description: 'Filtrado masivo por red social y campaña; asignación manual o Round-Robin balanceado.',
      icon: <Shuffle className="w-5 h-5 text-purple-500" />,
      action: () => setAdminActiveScreen('distribute'),
      badge: 'Pantalla Completa',
    },
    {
      id: 'coldLeads',
      title: 'Leads Fríos (Congelador Dedicado)',
      description: 'Gestión exhaustiva de prospectos congelados con motivos y reactivación inmediata.',
      icon: <Snowflake className="w-5 h-5 text-cyan-500" />,
      action: () => setAdminActiveScreen('coldLeads'),
      badge: `${leads.filter((l) => l.isCold).length} fríos`,
    },
    {
      id: 'salesGoals',
      title: 'Metas de Ventas (Gestión CRUD)',
      description: 'Definición y edición de cuotas mensuales por vendedor, comisiones y avance.',
      icon: <Target className="w-5 h-5 text-[#E50914]" />,
      action: () => setAdminActiveScreen('salesGoals'),
      badge: 'Pantalla Completa',
    },
    {
      id: 'events',
      title: 'Eventos & Webinars (Participantes)',
      description: 'Creación de masterclasses, asignación de prospectos y control de asistencia/cierres.',
      icon: <CalendarDays className="w-5 h-5 text-orange-500" />,
      action: () => setAdminActiveScreen('events'),
      badge: 'Pantalla Completa',
    },
    {
      id: 'createLead',
      title: 'Crear Prospecto Manual',
      description: 'Ingresa un lead directamente al CRM sin requerir webhook de Nextline.',
      icon: <UserPlus className="w-5 h-5 text-blue-500" />,
      action: () => openModal('createLead'),
      badge: 'Acción rápida',
    },
    {
      id: 'nextlineIntegration',
      title: 'Integración Nextline (WhatsApp)',
      description: 'Configuración de webhooks, llaves HMAC y monitoreo SSE en tiempo real.',
      icon: <Radio className="w-5 h-5 text-emerald-500" />,
      action: () => openModal('nextlineIntegration'),
      badge: 'API Webhook',
    },
    {
      id: 'users',
      title: 'Gestión de Usuarios',
      description: 'Administración de vendedores, contadores, permisos y roles de acceso.',
      icon: <Users className="w-5 h-5 text-amber-500" />,
      action: () => openModal('usersManagement'),
      badge: 'Equipo',
    },
    {
      id: 'processStatuses',
      title: 'Estados de Proceso (Priorizador)',
      description: 'CRUD de estados comerciales y organizador de secuencia arriba/abajo en el embudo.',
      icon: <ListOrdered className="w-5 h-5 text-indigo-500" />,
      action: () => openModal('processStatuses'),
      badge: 'Organizador',
    },
    {
      id: 'promotions',
      title: 'Promociones y Descuentos (CRUD)',
      description: 'Configuración de becas y promociones con asignación directa a curso/campaña.',
      icon: <Tag className="w-5 h-5 text-rose-500" />,
      action: () => openModal('promotions'),
      badge: 'Descuentos',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HIGHLIGHTED EXPORT BUTTONS ROW */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 dark:from-[#121927] dark:via-[#1A2337] dark:to-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#E50914] block">
            Reportes & Extracción de Datos
          </span>
          <h2 className="text-lg font-black text-slate-900 dark:text-[#F9FAFB] mt-0.5">
            Exportación Oficial de Base de Datos KRAKE
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1">
            Descarga en formato CSV / Excel compatible con hojas de cálculo y contabilidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Highlighted Button 1: Export Leads */}
          <button
            onClick={exportLeadsCSV}
            type="button"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Leads (CSV)</span>
          </button>

          {/* Highlighted Button 2: Export Sales */}
          <button
            onClick={exportSalesCSV}
            type="button"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Ventas (CSV)</span>
          </button>
        </div>
      </div>

      {/* Grid of Tools / Apps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={tool.action}
            className="p-5 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] hover:border-[#E50914] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E]">
                  {tool.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-[#1A2337] text-slate-700 dark:text-[#94A3B8] border border-slate-200 dark:border-[#1F2B3E]">
                  {tool.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F9FAFB] group-hover:text-[#E50914] transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1.5 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-[#E50914] mt-4 pt-3 border-t border-slate-100 dark:border-[#1F2B3E]/60 group-hover:translate-x-1 transition-transform">
              <span>Abrir herramienta</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
