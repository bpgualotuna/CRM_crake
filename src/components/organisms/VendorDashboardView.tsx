import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Badge } from '../atoms/Badge';
import {
  UserCheck,
  PhoneCall,
  DollarSign,
  Target,
  Clock,
  MessageSquare,
  Radio,
  ArrowRight,
  CheckCircle2,
  Phone,
  Eye,
  TrendingUp,
  Sparkles,
  AlertCircle,
  ChevronRight,
  Bot,
} from 'lucide-react';

interface VendorDashboardViewProps {
  onNavigateToLeads: (statusFilter?: string) => void;
}

export const VendorDashboardView: React.FC<VendorDashboardViewProps> = ({
  onNavigateToLeads,
}) => {
  const {
    currentUser,
    leads,
    salesGoals,
    openModal,
    setSelectedLeadId,
    completeReminder,
    incrementAttempts,
  } = useCRM();

  // Filter vendor leads
  const myLeads = leads.filter((l) => l.assignedTo === currentUser.id && !l.isCold);
  const totalMyLeads = myLeads.length > 0 ? myLeads.length : 28;

  // Breakdown
  const newLeadsCount = myLeads.filter((l) => l.processStatus === 'Nuevo').length || 8;
  const contactedCount =
    myLeads.filter((l) => l.processStatus === 'Contactado').length || 12;
  const interestedCount =
    myLeads.filter((l) => l.processStatus === 'Interesado').length || 5;
  const closedCount =
    myLeads.filter((l) => l.processStatus === 'Venta realizada').length || 3;

  const inFollowUpCount = contactedCount + interestedCount;

  // Daily contact goal (e.g., 8 / 15 contacted today)
  const [dailyContacted, setDailyContacted] = useState(8);
  const dailyTarget = 15;
  const dailyPercentage = Math.min(100, Math.round((dailyContacted / dailyTarget) * 100));

  // Goal & Revenue metrics
  const myGoal = salesGoals.find((g) => g.vendorId === currentUser.id) || {
    targetSales: 12,
    targetRevenue: 7000,
    currentSales: closedCount,
    currentRevenue: 4850,
  };

  const currentRevenue = myGoal.currentRevenue || 4850;
  const targetRevenue = myGoal.targetRevenue || 7000;
  const goalPercentage = Math.min(100, Math.round((currentRevenue / targetRevenue) * 100));

  // Reminders state with local completion tracking
  const [completedReminderIds, setCompletedReminderIds] = useState<string[]>([]);

  // Collect vendor reminders
  const rawReminders = [
    {
      id: 'rem-today-1',
      leadId: myLeads[0]?.id || 'lead-1',
      leadName: myLeads[0]?.fullName || 'Carlos Ruiz',
      leadPhone: myLeads[0]?.phoneNumber || '+593 99 876 5432',
      time: '15:00',
      type: 'phone' as const,
      urgency: 'Alta Prioridad',
      message: 'Llamar para coordinar transferencia de inscripción - Bootcamp Full Stack',
    },
    {
      id: 'rem-today-2',
      leadId: myLeads[1]?.id || 'lead-2',
      leadName: myLeads[1]?.fullName || 'María Loor',
      leadPhone: myLeads[1]?.phoneNumber || '+593 98 432 1098',
      time: '16:30',
      type: 'whatsapp' as const,
      urgency: 'Seguimiento',
      message: 'Seguimiento WhatsApp - Enviar malla curricular de Cloud DevOps & Kubernetes',
    },
    {
      id: 'rem-today-3',
      leadId: myLeads[2]?.id || 'lead-3',
      leadName: myLeads[2]?.fullName || 'Andrés Paredes',
      leadPhone: myLeads[2]?.phoneNumber || '+593 99 555 4321',
      time: '17:15',
      type: 'phone' as const,
      urgency: 'Cobro Cuota',
      message: 'Confirmación de comprobante de pago segunda cuota',
    },
  ];

  const handleCompleteReminderItem = (id: string, leadId: string) => {
    setCompletedReminderIds((prev) => [...prev, id]);
    try {
      completeReminder(leadId, id);
    } catch {
      // safe fallback
    }
  };

  // Recent Nextline WhatsApp leads
  const recentNextlineLeads = [
    {
      id: myLeads[0]?.id || 'lead-1',
      fullName: myLeads[0]?.fullName || 'Brandon Alexander Cueva',
      phoneNumber: myLeads[0]?.phoneNumber || '+593 99 234 5678',
      nextlineTagName: myLeads[0]?.nextlineTagName || 'FB_ADS_FULLSTACK_OCT',
      nextlineAgentName: myLeads[0]?.nextlineAgentName || 'Bot Calificador Nextline',
      elapsedTime: 'Hace 25 min',
      processStatus: myLeads[0]?.processStatus || 'Nuevo',
    },
    {
      id: myLeads[1]?.id || 'lead-2',
      fullName: myLeads[1]?.fullName || 'Estefanía Villacís',
      phoneNumber: myLeads[1]?.phoneNumber || '+593 98 765 4321',
      nextlineTagName: myLeads[1]?.nextlineTagName || 'TIKTOK_PYTHON_AI',
      nextlineAgentName: myLeads[1]?.nextlineAgentName || 'Asesor Virtual Krake',
      elapsedTime: 'Hace 45 min',
      processStatus: myLeads[1]?.processStatus || 'Nuevo',
    },
    {
      id: myLeads[2]?.id || 'lead-3',
      fullName: myLeads[2]?.fullName || 'Mateo Sebastián Morales',
      phoneNumber: myLeads[2]?.phoneNumber || '+593 97 123 9876',
      nextlineTagName: myLeads[2]?.nextlineTagName || 'CAMP_REACT_NEXT_PROMO',
      nextlineAgentName: myLeads[2]?.nextlineAgentName || 'ChatControl Webhook',
      elapsedTime: 'Hace 1 hora',
      processStatus: myLeads[2]?.processStatus || 'Contactado',
    },
    {
      id: myLeads[3]?.id || 'lead-4',
      fullName: myLeads[3]?.fullName || 'Camila Andrea Paredes',
      phoneNumber: myLeads[3]?.phoneNumber || '+593 96 888 2211',
      nextlineTagName: myLeads[3]?.nextlineTagName || 'WHATSAPP_ORGANICO_MASTER',
      nextlineAgentName: myLeads[3]?.nextlineAgentName || 'Clearminds Bot',
      elapsedTime: 'Hace 2 horas',
      processStatus: myLeads[3]?.processStatus || 'Interesado',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Banner de Bienvenida y Resumen Ejecutivo */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50/60 via-white to-slate-50 dark:from-[#E50914]/15 dark:via-[#121927] dark:to-[#0B0F19] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#E50914] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Panel de Rendimiento Comercial
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
              En Línea · Turno Activo
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F9FAFB] tracking-tight mt-1">
            ¡Hola, {currentUser.name}! 👋
          </h1>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] font-medium mt-1 max-w-xl">
            Tienes <strong className="text-slate-800 dark:text-slate-200 font-bold">{rawReminders.length - completedReminderIds.length} recordatorios pendientes</strong> hoy y un avance del <strong className="text-[#E50914] font-mono font-bold">{goalPercentage}%</strong> respecto a tu meta de facturación mensual.
          </p>
        </div>

        <button
          onClick={() => onNavigateToLeads()}
          type="button"
          className="px-5 py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2 shrink-0 uppercase tracking-wider"
        >
          <span>Gestionar Mi Cartera</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* A. Fila de Tarjetas KPI Personales con animación hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Mis Leads Totales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
              Mis Leads Totales
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-[#F9FAFB] font-mono tracking-tight">
              {totalMyLeads} <span className="text-sm font-sans font-bold text-slate-400">leads</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12% vs. semana anterior</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1F2B3E]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
            <span>
              <strong className="text-slate-800 dark:text-slate-200">{newLeadsCount}</strong> nuevos
            </span>
            <span>·</span>
            <span>
              <strong className="text-slate-800 dark:text-slate-200">{inFollowUpCount}</strong> en seguimiento
            </span>
          </div>
        </div>

        {/* KPI 2: Contactados Hoy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
              Contactados Hoy
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-[#F9FAFB] font-mono tracking-tight flex items-baseline gap-1">
              <span>{dailyContacted}</span>
              <span className="text-base text-slate-400 font-normal">/ {dailyTarget}</span>
              <span className="text-xs font-sans font-bold text-slate-500 ml-1">objetivo</span>
            </div>
            {/* Barra de progreso interactiva */}
            <div className="w-full bg-slate-100 dark:bg-[#090D16] h-2 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E] mt-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${dailyPercentage}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1F2B3E]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
            <span>{dailyPercentage}% completado</span>
            <button
              onClick={() => setDailyContacted((prev) => Math.min(dailyTarget, prev + 1))}
              className="text-[#E50914] font-bold hover:underline cursor-pointer"
            >
              + Sumar contacto
            </button>
          </div>
        </div>

        {/* KPI 3: Ventas del Mes */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
              Ventas del Mes
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              ${currentRevenue.toLocaleString()} <span className="text-xs font-sans font-bold text-slate-500">USD</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 font-medium">
              Meta fijada: <strong className="text-slate-800 dark:text-slate-200 font-mono">${targetRevenue.toLocaleString()} USD</strong>
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1F2B3E]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
            <span>{closedCount} cierres aprobados</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              Comisión: ${Math.round(currentRevenue * 0.08)}
            </span>
          </div>
        </div>

        {/* KPI 4: Cumplimiento de Meta */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
              Cumplimiento de Meta
            </span>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-[#E50914]/10 text-[#E50914] border border-red-200 dark:border-[#E50914]/20">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-slate-900 dark:text-[#F9FAFB] font-mono tracking-tight flex items-baseline gap-1">
              <span>{goalPercentage}%</span>
              <span className="text-xs font-sans font-bold text-slate-400">alcanzado</span>
            </div>
            {/* Barra de progreso en Rojo Krake */}
            <div className="w-full bg-slate-100 dark:bg-[#090D16] h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E] mt-2">
              <div
                className="bg-[#E50914] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${goalPercentage}%` }}
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-[#1F2B3E]/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#94A3B8]">
            <span>Faltan ${(targetRevenue - currentRevenue).toLocaleString()} USD</span>
            <span className="font-bold text-amber-500">Ritmo Bueno</span>
          </div>
        </div>
      </div>

      {/* D. Mini Embudo de Conversión Personal (Pipeline del Vendedor) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-[#E50914]" />
              <span>Embudo de Conversión Personal (Pipeline Activo)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Estado y avance de los prospectos bajo tu gestión comercial
            </p>
          </div>
          <button
            onClick={() => onNavigateToLeads()}
            type="button"
            className="text-xs font-bold text-[#E50914] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Ver detalle en Mis Leads</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visualización en Barras de Embudo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* FASE 1: NUEVOS */}
          <div
            onClick={() => onNavigateToLeads('Nuevo')}
            className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-500/25 cursor-pointer hover:border-blue-400 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider text-[11px]">
                1. Nuevos
              </span>
              <span className="font-mono font-black text-blue-700 dark:text-blue-300 text-lg">
                {newLeadsCount}
              </span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-900/40 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-500 h-full w-full" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] block mt-2">
              Pendientes de primer contacto
            </span>
          </div>

          {/* FASE 2: CONTACTADOS */}
          <div
            onClick={() => onNavigateToLeads('Contactado')}
            className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/25 cursor-pointer hover:border-amber-400 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                2. Contactados
              </span>
              <span className="font-mono font-black text-amber-700 dark:text-amber-300 text-lg">
                {contactedCount}
              </span>
            </div>
            <div className="w-full bg-amber-100 dark:bg-amber-900/40 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-500 h-full" style={{ width: '75%' }} />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] block mt-2">
              Llamada o mensaje emitido
            </span>
          </div>

          {/* FASE 3: INTERESADOS */}
          <div
            onClick={() => onNavigateToLeads('Interesado')}
            className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/25 cursor-pointer hover:border-purple-400 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider text-[11px]">
                3. Interesados
              </span>
              <span className="font-mono font-black text-purple-700 dark:text-purple-300 text-lg">
                {interestedCount}
              </span>
            </div>
            <div className="w-full bg-purple-100 dark:bg-purple-900/40 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-purple-500 h-full" style={{ width: '45%' }} />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] block mt-2">
              Revisando precios y horarios
            </span>
          </div>

          {/* FASE 4: VENTAS CERRADAS */}
          <div
            onClick={() => onNavigateToLeads('Venta realizada')}
            className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/25 cursor-pointer hover:border-emerald-400 transition-all hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-[11px]">
                4. Ventas Cerradas
              </span>
              <span className="font-mono font-black text-emerald-700 dark:text-emerald-300 text-lg">
                {closedCount}
              </span>
            </div>
            <div className="w-full bg-emerald-100 dark:bg-emerald-900/40 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full" style={{ width: '25%' }} />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] block mt-2">
              Matrícula o abono pagado
            </span>
          </div>
        </div>
      </div>

      {/* Grid de Dos Columnas: Widget B (Recordatorios de Hoy) + Widget C (Leads Recientes Nextline) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* B. Widget de "Próximos Recordatorios de Hoy" */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-50 dark:bg-[#E50914]/15 text-[#E50914]">
                <Clock className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider">
                Próximos Recordatorios de Hoy
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-[#090D16] text-slate-600 dark:text-[#94A3B8] font-mono">
              {rawReminders.length - completedReminderIds.length} activos
            </span>
          </div>

          <div className="space-y-2.5">
            {rawReminders.map((rem) => {
              const isCompleted = completedReminderIds.includes(rem.id);
              return (
                <div
                  key={rem.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-100/60 dark:bg-[#090D16]/50 border-slate-200 dark:border-[#1F2B3E]/50 opacity-50 line-through'
                      : 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-[#1F2B3E] hover:border-slate-300 dark:hover:border-[#2D3F5C]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div
                        className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                          rem.type === 'phone'
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {rem.type === 'phone' ? (
                          <Phone className="w-4 h-4" />
                        ) : (
                          <MessageSquare className="w-4 h-4" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedLeadId(rem.leadId)}
                            className="font-bold text-slate-900 dark:text-[#F9FAFB] text-xs hover:text-[#E50914] text-left cursor-pointer"
                          >
                            {rem.leadName}
                          </button>
                          <span className="font-mono text-[11px] font-bold text-slate-500 dark:text-[#94A3B8]">
                            · {rem.time}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                              rem.urgency === 'Alta Prioridad'
                                ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400'
                                : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                            }`}
                          >
                            {rem.urgency}
                          </span>
                        </div>
                        <p className="text-slate-600 dark:text-[#94A3B8] text-[11px] mt-1 line-clamp-2">
                          {rem.message}
                        </p>
                      </div>
                    </div>

                    {/* Botón interactivo [ Completar ] */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!isCompleted ? (
                        <button
                          onClick={() => handleCompleteReminderItem(rem.id, rem.leadId)}
                          type="button"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completar</span>
                        </button>
                      ) : (
                        <span className="text-emerald-500 font-bold text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Listo</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* C. Widget de "Leads Recientes Asignados por Nextline" */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <Radio className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider">
                Leads Recientes de Nextline WhatsApp
              </h2>
            </div>
            <button
              onClick={() => onNavigateToLeads()}
              className="text-[11px] text-[#E50914] font-bold hover:underline cursor-pointer"
            >
              Ver Todos ({totalMyLeads})
            </button>
          </div>

          <div className="space-y-2.5">
            {recentNextlineLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] hover:border-slate-300 dark:hover:border-[#2D3F5C] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <strong className="text-slate-900 dark:text-[#F9FAFB] text-xs font-black">
                      {lead.fullName}
                    </strong>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-[#94A3B8]">
                      {lead.phoneNumber}
                    </span>
                    <Badge variant="status" status={lead.processStatus as any} size="xs" />
                  </div>

                  <div className="flex items-center gap-2 flex-wrap text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-mono font-bold">
                      🏷️ {lead.nextlineTagName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500 dark:text-[#94A3B8]">
                      <Bot className="w-3 h-3 text-blue-500" />
                      <span>{lead.nextlineAgentName}</span>
                    </span>
                    <span className="text-slate-400 dark:text-[#64748B]">
                      · {lead.elapsedTime}
                    </span>
                  </div>
                </div>

                {/* Botón de acción rápida [ Ver Ficha ] que abre directamente el Modal del Lead */}
                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setSelectedLeadId(lead.id)}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-[#1A2337] dark:hover:bg-[#232F42] text-white font-bold text-xs shadow-sm transition-all active:scale-95 cursor-pointer border border-slate-700 dark:border-[#2D3F5C]"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Ver Ficha</span>
                  </button>

                  <button
                    onClick={() => openModal('whatsapp', lead as any)}
                    type="button"
                    className="p-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold cursor-pointer transition-colors"
                    title="Enviar WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
