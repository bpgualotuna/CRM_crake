import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LayoutDashboard,
  Users,
  Megaphone,
  BarChart3,
  AppWindow,
  Target,
  FileSpreadsheet,
  History,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  PlusCircle,
} from 'lucide-react';

interface SidebarNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse,
}) => {
  const { currentRole, currentUser, openModal, leads, setAdminActiveScreen } = useCRM();

  const unassignedCount = leads.filter((l) => !l.assignedTo && !l.isCold).length;

  const adminNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'vendedores', label: 'Vendedores', icon: <Users className="w-4 h-4" /> },
    { id: 'campanas', label: 'Campañas', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'estadisticas', label: 'Estadísticas', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'aplicaciones', label: 'Hub Aplicaciones', icon: <AppWindow className="w-4 h-4" /> },
  ];

  const vendorNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leads', label: 'Mis Leads', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'historial', label: 'Historial', icon: <History className="w-4 h-4" /> },
    { id: 'exportar', label: 'Exportar', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'metas', label: 'Metas del Mes', icon: <Target className="w-4 h-4" /> },
  ];

  const items = currentRole === 'admin' ? adminNavItems : vendorNavItems;

  return (
    <aside
      className={`relative h-[calc(100vh-4rem)] bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-[#1F2B3E] flex flex-col justify-between transition-all duration-200 select-none shrink-0 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Navigation items */}
      <div className="flex flex-col p-3 gap-1">
        <div className="px-3 py-2 mb-1 flex items-center justify-between">
          {!collapsed && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#64748B]">
              {currentRole === 'admin' ? 'Módulos Admin' : 'Portal Vendedor'}
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            type="button"
            className="p-1 rounded text-slate-400 dark:text-[#94A3B8] hover:text-slate-800 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#121927] transition-colors cursor-pointer ml-auto"
            title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'aplicaciones') {
                  setAdminActiveScreen('hub');
                }
                onSelectTab(item.id);
              }}
              type="button"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-[#E50914] text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#121927]'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Action button inside sidebar for Admin / Vendor */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#1F2B3E]">
          <button
            onClick={() => openModal('createLead')}
            type="button"
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#E50914] to-[#C80710] hover:brightness-110 shadow-sm cursor-pointer transition-all active:scale-[0.98] ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Crear nuevo Lead manual"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Nuevo Prospecto</span>}
          </button>
        </div>
      </div>

      {/* Footer Info / User KPI Progress */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-xl bg-slate-50 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-xs">
          <div className="flex items-center justify-between text-slate-600 dark:text-[#94A3B8] mb-1.5 font-semibold">
            <span className="flex items-center gap-1 text-[11px]">
              <Flame className="w-3.5 h-3.5 text-[#E50914]" />
              {currentRole === 'admin' ? 'Leads sin asignar' : 'Meta del Mes'}
            </span>
            <span className="font-mono text-slate-900 dark:text-[#F9FAFB] tabular-nums font-bold">
              {currentRole === 'admin'
                ? unassignedCount
                : `${Math.round(((currentUser.monthlySales || 0) / (currentUser.monthlyGoal || 9000)) * 100)}%`}
            </span>
          </div>

          <div className="w-full bg-slate-200 dark:bg-[#090D16] h-1.5 rounded-full overflow-hidden border border-slate-200 dark:border-[#1F2B3E]/60">
            <div
              className="bg-gradient-to-r from-[#E50914] to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{
                width: `${
                  currentRole === 'admin'
                    ? Math.min(100, (unassignedCount / 10) * 100)
                    : Math.min(100, ((currentUser.monthlySales || 0) / (currentUser.monthlyGoal || 9000)) * 100)
                }%`,
              }}
            />
          </div>

          <p className="text-[10px] text-slate-500 dark:text-[#64748B] mt-2 leading-tight">
            {currentRole === 'admin'
              ? `${unassignedCount} leads esperan distribución a vendedores.`
              : `$${currentUser.monthlySales || 0} de $${currentUser.monthlyGoal || 9000} facturados.`}
          </p>
        </div>
      )}
    </aside>
  );
};
