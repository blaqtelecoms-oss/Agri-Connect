import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, Check, Award, Megaphone, BarChart3, Settings, MapPin } from 'lucide-react';
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
  { label: 'Grants', path: '/admin/grants', icon: Award },
  { label: 'Communications', path: '/admin/communications', icon: Megaphone },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Administration', path: '/admin/administration', icon: Settings },
  { label: 'Farmer Map', path: '/admin/map', icon: MapPin },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [toast, setToast] = useState('');
  const moreRef = useRef(null);

  const isActive = (p) => location.pathname === p;
  const moreActive = MORE.some(m => isActive(m.path));
  const moreLabel = (MORE.find(m => isActive(m.path)) || { label: 'More' }).label;

  // Close the More menu on outside click, Escape, or navigation.
  useEffect(() => {
    if (!moreOpen) return;
    const onDown = (e) => { if (moreRef.current && !moreRef.current.contains(e.target)) setMoreOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMoreOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [moreOpen]);
  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

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
            <div className="relative" ref={moreRef}>
              <button onClick={() => setMoreOpen(o => !o)} aria-haspopup="menu" aria-expanded={moreOpen}
                className="px-3.5 py-2 rounded-full font-medium text-[14px] flex items-center gap-1 border transition"
                style={{
                  color: moreActive ? 'var(--ag-or)' : 'var(--ag-ink)',
                  borderColor: moreOpen ? 'var(--ag-line)' : 'transparent',
                  background: moreOpen ? 'var(--ag-card, #fff)' : 'transparent',
                }}>
                {moreLabel}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
              </button>
              {moreOpen && (
                <div role="menu" className="absolute top-11 right-0 rounded-2xl p-1.5 min-w-[210px] border z-50"
                  style={{ background: 'var(--ag-card, #fff)', borderColor: 'var(--ag-line)', boxShadow: '0 24px 60px rgba(10,40,30,0.18)' }}>
                  <div className="px-3 pt-1.5 pb-1 text-[10.5px] font-semibold uppercase tracking-[1.2px]" style={{ color: 'var(--ag-mut)' }}>More sections</div>
                  {MORE.map(m => {
                    const Icon = m.icon;
                    const on = isActive(m.path);
                    return (
                      <button key={m.path} role="menuitem" onClick={() => { navigate(m.path); setMoreOpen(false); }}
                        className="w-full flex items-center gap-2.5 rounded-[12px] px-3 py-2 text-[13.5px] font-medium hover:bg-black/5 transition"
                        style={{ color: on ? 'var(--ag-or)' : 'var(--ag-ink)' }}>
                        <Icon className="w-4 h-4" style={{ color: on ? 'var(--ag-or)' : 'var(--ag-mut)' }} />
                        <span className="flex-1 text-left">{m.label}</span>
                        {on && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
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
            <button onClick={() => navigate('/admin/profile')} aria-label="Open profile"
              className={`w-9 h-9 rounded-full grid place-items-center text-white font-semibold text-[12px] transition ${isActive('/admin/profile') ? 'outline outline-2 outline-offset-2' : 'hover:opacity-85'}`}
              style={{ background: 'linear-gradient(135deg,#2f6f5a,#e2471b)', outlineColor: 'var(--ag-or)' }}
              title={`${DEMO_OFFICIAL.name} · ${DEMO_OFFICIAL.role}`}>{DEMO_OFFICIAL.initials}</button>
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