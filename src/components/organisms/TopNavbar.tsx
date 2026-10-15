import React, { useState } from 'react';
import { KrakeLogo } from '../atoms/KrakeLogo';
import { ToggleTheme } from '../atoms/ToggleTheme';
import { RolePill } from '../atoms/RolePill';
import { Avatar } from '../atoms/Avatar';
import { useCRM } from '../../context/CRMContext';
import { Bell, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';

export const TopNavbar: React.FC = () => {
  const {
    currentUser,
    isSSEConnected,
    notifications,
    markNotificationRead,
    logout,
  } = useCRM();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-200 dark:border-[#1F2B3E] px-4 lg:px-6 flex items-center justify-between gap-4 transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-4 shrink-0">
        <KrakeLogo size="md" />
        <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-[#1F2B3E]">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#94A3B8]">
            Clearminds Sales Engine
          </span>
        </div>
      </div>

      {/* Zone 2: Realtime telemetry & Quick actions */}
      <div className="hidden md:flex items-center gap-4">
        {/* SSE Realtime Indicator */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] text-xs text-slate-600 dark:text-[#94A3B8]"
          title="Server-Sent Events / Stream de Nextline en tiempo real activo"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSSEConnected ? 'bg-emerald-400' : 'bg-rose-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isSSEConnected ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="font-mono text-[11px] font-semibold text-slate-900 dark:text-[#F9FAFB]">
            {isSSEConnected ? 'SSE Conectado' : 'Reconectando'}
          </span>
        </div>
      </div>

      {/* Zone 3: Controls, Role simulator, Theme, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Role Simulator Pill */}
        <RolePill />

        {/* Theme Toggle */}
        <ToggleTheme />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            type="button"
            className="relative p-2 rounded-lg text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F9FAFB] hover:bg-slate-100 dark:hover:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] transition-colors cursor-pointer"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E50914] text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-xl p-3 z-50 flex flex-col gap-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-[#1F2B3E]">
                <span className="text-xs font-bold text-slate-900 dark:text-[#F9FAFB] uppercase tracking-wider">
                  Notificaciones
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#94A3B8]">
                  {unreadCount} sin leer
                </span>
              </div>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      n.read
                        ? 'bg-slate-50 dark:bg-[#090D16] border-slate-200 dark:border-[#1F2B3E]/60 opacity-60'
                        : 'bg-slate-100 dark:bg-[#1A2337] border-slate-300 dark:border-[#2D3F5C]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-[#F9FAFB]">{n.title}</strong>
                      <span className="text-[10px] text-slate-500 dark:text-[#64748B]">{n.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-[#94A3B8] mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile & Logout Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-[#1F2B3E]">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            type="button"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#121927] transition-colors cursor-pointer text-left"
          >
            <Avatar name={currentUser.name} role={currentUser.role} size="sm" />
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F9FAFB] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-[#94A3B8] capitalize font-medium">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-[#64748B] ml-0.5" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-xl p-2 z-50 flex flex-col text-xs">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-[#1F2B3E] mb-1">
                <span className="font-bold text-slate-900 dark:text-[#F9FAFB] block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] block truncate">
                  {currentUser.email}
                </span>
              </div>

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
