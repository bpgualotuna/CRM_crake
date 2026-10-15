import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { KPICard } from '../molecules/KPICard';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Layers,
  Radio,
  Clock,
} from 'lucide-react';

export const AdminDashboardGrid: React.FC = () => {
  const { leads, users, campaigns, actionLogs, openModal } = useCRM();

  // Metrics computation
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.processStatus === 'Nuevo').length;
  const contactedLeads = leads.filter((l) => l.processStatus === 'Contactado').length;
  const interestedLeads = leads.filter((l) => l.processStatus === 'Interesado').length;
  const soldLeads = leads.filter((l) => l.processStatus === 'Venta realizada').length;
  const coldLeads = leads.filter((l) => l.isCold).length;

  const totalRevenue = leads.reduce((acc, lead) => {
    const leadSalesTotal = (lead.sales || []).reduce((sAcc, s) => sAcc + s.totalAmount, 0);
    return acc + leadSalesTotal;
  }, 0);

  const collectedCash = leads.reduce((acc, lead) => {
    const leadPaidTotal = (lead.sales || []).reduce((sAcc, s) => sAcc + s.amountPaid, 0);
    return acc + leadPaidTotal;
  }, 0);

  const conversionRate = totalLeads > 0 ? ((soldLeads / totalLeads) * 100).toFixed(1) : '0';
  const activeVendors = users.filter((u) => u.role === 'vendedor' && u.isActive).length;

  return (
    <div className="space-y-6">
      {/* 1. Master KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Leads Totales"
          value={totalLeads}
          subValue={`${newLeads} nuevos sin gestionar`}
          trend={{ value: '+18.4% vs mes anterior', isPositive: true }}
          icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconBgColor="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20"
        />

        <KPICard
          title="Facturación Pactada"
          value={`$${totalRevenue.toLocaleString()}`}
          subValue={`$${collectedCash.toLocaleString()} cobrados en caja`}
          trend={{ value: '+24.1% vs mes anterior', isPositive: true }}
          icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          iconBgColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
        />

        <KPICard
          title="Tasa de Conversión"
          value={`${conversionRate}%`}
          subValue={`${soldLeads} ventas cerradas`}
          trend={{ value: '+3.2% vs promedio', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5 text-[#E50914]" />}
          iconBgColor="bg-red-50 text-[#E50914] dark:bg-[#E50914]/10 dark:text-[#E50914] border border-red-200 dark:border-[#E50914]/20"
        />

        <KPICard
          title="Vendedores Activos"
          value={activeVendors}
          subValue={`${coldLeads} prospectos en fríos`}
          trend={{ value: '100% operativos', isPositive: true }}
          icon={<Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          iconBgColor="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20"
        />
      </div>

      {/* 2. Middle Row: Sales Funnel & Nextline Webhook live health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Pipeline Funnel */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#1F2B3E]">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#E50914]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider">
                Embudo de Conversión (Pipeline de Ventas)
              </h3>
            </div>
            <span className="text-xs text-slate-500 dark:text-[#94A3B8]">Tiempo real</span>
          </div>

          <div className="space-y-4 my-4">
            {/* Stage: Nuevo */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-600 dark:text-blue-400">1. Nuevos Prospectos</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB] tabular-nums">
                  {newLeads} leads ({Math.round((newLeads / (totalLeads || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(newLeads / (totalLeads || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Stage: Contactado */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-600 dark:text-amber-400">2. Contactados (Llamada / WA)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB] tabular-nums">
                  {contactedLeads} leads ({Math.round((contactedLeads / (totalLeads || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${(contactedLeads / (totalLeads || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Stage: Interesado */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-purple-600 dark:text-purple-400">3. Interesados en Negociación</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB] tabular-nums">
                  {interestedLeads} leads ({Math.round((interestedLeads / (totalLeads || 1)) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(interestedLeads / (totalLeads || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Stage: Venta realizada */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">4. Ventas Cerradas</span>
                <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB] tabular-nums">
                  {soldLeads} ventas ({conversionRate}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${(soldLeads / (totalLeads || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] text-xs flex items-center justify-between text-slate-600 dark:text-[#94A3B8]">
            <span>Capacidad de respuesta promedio inicial:</span>
            <strong className="text-slate-900 dark:text-white font-mono">14 minutos</strong>
          </div>
        </div>

        {/* Nextline & Campaign summary card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Rendimiento de Campañas
              </span>
              <button
                onClick={() => openModal('nextlineIntegration')}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
              >
                Ver Webhook
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/60 text-xs mt-3">
              {campaigns.slice(0, 3).map((camp) => (
                <div key={camp.id} className="py-2.5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-[#F9FAFB] truncate max-w-[170px]">
                      {camp.name}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                      {camp.nextlineTag}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-900 dark:text-[#F9FAFB]">
                      {camp.conversionsCount} ventas
                    </span>
                    <span className="block text-[10px] text-slate-500 dark:text-[#64748B] font-mono">
                      ${camp.totalRevenue.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => openModal('distribute')}
            type="button"
            className="w-full mt-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Distribuir Leads a Vendedores</span>
          </button>
        </div>
      </div>

      {/* 3. Action Logs Timeline (Seguimiento Completo) */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1F2B3E]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#E50914]" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider">
              Seguimiento Completo & Auditoría (Action Logs Inmutables)
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-[#94A3B8]">Últimas 10 acciones registradas</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#1F2B3E]/50 text-xs">
          {actionLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E50914] mt-1.5 shrink-0" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 dark:text-[#F9FAFB]">{log.userName}</strong>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1A2337] text-slate-700 dark:text-[#94A3B8] font-mono uppercase border border-slate-200 dark:border-[#1F2B3E]">
                      {log.userRole}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-[#94A3B8] mt-0.5">{log.description}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#64748B] font-mono tabular-nums shrink-0">
                {new Date(log.date).toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
