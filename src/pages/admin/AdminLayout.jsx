import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, MoreHorizontal } from 'lucide-react';
import { LOGO_URL, ADMIN_BG } from '@/lib/agriAssets';
import { DEMO_OFFICIAL } from '@/lib/agriAuth';

const NAV = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Registry', path: '/admin/registry' },
  { label: 'Applications', path: '/admin/applications' },
  { label: 'Disease Control', path: '/admin/disease' },
  { label: 'Extension', path: '/admin/extension' },
];
const MORE = [
  { label: 'Grants', path: '/admin/grants' },
  { label: 'Communications', path: '/admin/communications' },
  { label: 'Reports', path: '/admin/reports' },
  { label: 'Administration', path: '/admin/administration' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [toast, setToast] = useState('');

  const isActive = (p) => location.pathname === p;
  const moreActive = MORE.some(m => isActive(m.path));
  const moreLabel = (MORE.find(m => isActive(m.path)) || { label: 'More' }).label;

  React.useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 2200); return () => clearTimeout(t); } }, [toast]);

  // expose toast via a global for child pages
  React.useEffect(() => {
    window.__agriToast = setToast;
  }, [setToast]);

  return (
    <div className="min-h-screen font-admin overflow-hidden" style={{ background: `url(${ADMIN_BG}) center/cover ${'#4d7f6e'}`, padding: '0' }}>
      <div className="h-screen max-w-[1320px] mx-auto flex flex-col overflow-hidden" style={{ background: 'var(--ag-pn)', borderRadius: 0, boxShadow: '0 20px 70px #0004' }}>
        {/* Header */}
        <header className="flex items-center gap-5 px-5 py-3.5 z-10 flex-wrap">
          <div className="flex items-center gap-2.5 whitespace-nowrap">
            <img src={LOGO_URL} alt="Emfuleni" className="h-10 bg-white rounded-[10px] p-0.5" />
            <div className="text-[20px] font-medium tracking-tight" style={{ color: 'var(--ag-ink)' }}>
              Agri Connect
              <small className="block text-[10px] font-normal" style={{ color: 'var(--ag-mut)' }}>Emfuleni Local Municipality · Agriculture</small>
            </div>
          </div>

          <nav className="flex gap-1.5 mx-auto items-center flex-wrap">
            {NAV.map(n => (
              <button key={n.path} onClick={() => navigate(n.path)} className="px-3.5 py-2 rounded-full font-medium text-[14px] hover:bg-black/5"
                style={{ color: isActive(n.path) ? 'var(--ag-or)' : 'var(--ag-ink)' }}>{n.label}</button>
            ))}
            <div className="relative">
              <button onClick={() => setMoreOpen(o => !o)} className="px-3.5 py-2 rounded-full font-medium text-[14px] hover:bg-black/5 flex items-center gap-1"
                style={{ color: moreActive ? 'var(--ag-or)' : 'var(--ag-ink)' }}>{moreLabel} <MoreHorizontal className="w-3.5 h-3.5" /></button>
              {moreOpen && (
                <div className="absolute top-10 right-0 rounded-2xl p-1.5 min-w-[180px] shadow-2xl z-50" style={{ background: 'var(--ag-card, #fff)' }}>
                  {MORE.map(m => (
                    <button key={m.path} onClick={() => { navigate(m.path); setMoreOpen(false); }} className="block w-full text-left rounded-[10px] px-3 py-2 text-[14px] hover:bg-black/5"
                      style={{ color: isActive(m.path) ? 'var(--ag-or)' : 'var(--ag-ink)' }}>{m.label}</button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-full px-4 py-2 w-[250px]" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-mut)' }}>
              <Search className="w-4 h-4" />
              <input placeholder="Search farmers, farms, permits…" className="flex-1 min-w-0 bg-transparent outline-none text-[14px]" style={{ color: 'var(--ag-ink)' }} />
              <kbd className="text-[11px] px-1.5 py-0.5 rounded" style={{ background: 'var(--ag-pn)' }}>⌘ K</kbd>
            </div>
            <button onClick={() => window.__agriToast && window.__agriToast('3 SLA breaches need attention')} className="w-9 h-9 rounded-full grid place-items-center relative" style={{ background: 'var(--ag-card, #fff)' }}>
              <Bell className="w-4 h-4" style={{ color: 'var(--ag-ink)' }} />
              <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ag-or)' }} />
            </button>
            <div className="w-9 h-9 rounded-full grid place-items-center text-white font-semibold text-[12px]" style={{ background: 'linear-gradient(135deg,#2f6f5a,#e2471b)' }} title={`${DEMO_OFFICIAL.name} · ${DEMO_OFFICIAL.role}`}>{DEMO_OFFICIAL.initials}</div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-auto p-4 lg:px-6 flex flex-col gap-3.5">
          <Outlet />
        </main>
      </div>

      {toast && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 px-5 py-3 rounded-full text-white text-[14px] z-[99]" style={{ background: '#14181a' }}>{toast}</div>
      )}
    </div>
  );
}