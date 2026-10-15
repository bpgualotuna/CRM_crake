import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { KrakeLogo } from '../atoms/KrakeLogo';
import { ToggleTheme } from '../atoms/ToggleTheme';
import { ShieldCheck, UserCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, theme } = useCRM();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico corporativo.');
      return;
    }
    setError('');
    login(email.trim());
  };

  const handleQuickLogin = (role: 'admin' | 'vendedor') => {
    if (role === 'admin') {
      setEmail('admin@clearminds.com');
      setPassword('AdminKrake2026!');
      login('admin@clearminds.com', 'admin');
    } else {
      setEmail('vendedor@clearminds.com');
      setPassword('VendedorKrake2026!');
      login('vendedor@clearminds.com', 'vendedor');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-[#F9FAFB] transition-colors duration-200">
      {/* Top Bar with Logo & Theme Toggle */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-slate-200 dark:border-[#1F2B3E] bg-white/80 dark:bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <KrakeLogo size="md" />
        </div>
        <div className="flex items-center gap-3">
          <ToggleTheme />
        </div>
      </header>

      {/* Main Center Login Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4">
        <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#121927] border border-slate-200 dark:border-[#1F2B3E] shadow-xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E50914]">
              Acceso Corporativo Seguro
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-[#F9FAFB] tracking-tight">
              Clearminds Sales Engine
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#94A3B8]">
              Ingresa tus credenciales para acceder al CRM de KrakeDev
            </p>
          </div>

          {/* Quick Demo Access Pills */}
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-[#090D16] border border-slate-200 dark:border-[#1F2B3E] space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] block text-center">
              ⚡ Acceso Rápido de Prueba (1 Clic)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] hover:border-[#E50914] text-xs font-bold text-slate-800 dark:text-[#F9FAFB] hover:text-[#E50914] transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Administrador</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('vendedor')}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-white dark:bg-[#1A2337] border border-slate-200 dark:border-[#1F2B3E] hover:border-blue-500 text-xs font-bold text-slate-800 dark:text-[#F9FAFB] hover:text-blue-500 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Vendedor</span>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 font-medium text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B]" />
                <input
                  type="email"
                  required
                  placeholder="ej. admin@clearminds.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-[#94A3B8] block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#64748B]" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white dark:bg-[#090D16] border border-slate-300 dark:border-[#1F2B3E] text-slate-900 dark:text-[#F9FAFB] placeholder:text-slate-400 dark:placeholder:text-[#64748B] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-[#FF1E27] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <span>Iniciar Sesión en KRAKE</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-200 dark:border-[#1F2B3E]/60 text-[11px] text-slate-500 dark:text-[#64748B]">
            <span>Protegido con autenticación basada en JWT y Webhooks HMAC Nextline</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-xs text-slate-500 dark:text-[#64748B] border-t border-slate-200 dark:border-[#1F2B3E]">
        © 2026 KRAKEDEV · Clearminds Escuela de Programación. Todos los derechos reservados.
      </footer>
    </div>
  );
};
