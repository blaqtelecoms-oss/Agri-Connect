import React, { useState, useRef, useLayoutEffect } from 'react';
import { Home as HomeIcon, Leaf, FileText, Bell, PlusCircle, TriangleAlert, LogOut, Phone, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { getSession, clearSession, LANGUAGES } from '@/lib/agriAuth';
import { LOGO_URL } from '@/lib/agriAssets';
import { FARMER_NAME, FARMER_ID, initials, useFarmerNotifications } from './_shared';
import { useMediaQuery } from '@/hooks/use-media-query';

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon, path: '/app/home' },
  { id: 'farms', label: 'Farms', icon: Leaf, path: '/app/farms' },
  { id: 'report', label: 'Report', icon: PlusCircle, path: '/app/report', fab: true },
  { id: 'services', label: 'Services', icon: FileText, path: '/app/services' },
  { id: 'inbox', label: 'Inbox', icon: Bell, path: '/app/inbox' },
];

const NAV = [
  { id: 'home', label: 'Home', icon: HomeIcon, path: '/app/home', from: '#6ee0a8', to: '#1f7a57' },
  { id: 'farms', label: 'My Farms', icon: Leaf, path: '/app/farms', from: '#a6dc6a', to: '#3f9a3a' },
  { id: 'services', label: 'Services', icon: FileText, path: '/app/services', from: '#6db8f0', to: '#1a63a8' },
  { id: 'inbox', label: 'Inbox', icon: Bell, path: '/app/inbox', from: '#f3cd6a', to: '#b98d2c' },
];

const TITLES = { home: 'Home', farms: 'My Farms', services: 'Services', report: 'Report a problem', inbox: 'Inbox' };

function activeFrom(path) {
  if (path.includes('/farms')) return 'farms';
  if (path.includes('/services')) return 'services';
  if (path.includes('/report')) return 'report';
  if (path.includes('/inbox')) return 'inbox';
  return 'home';
}

export default function FarmerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const desktop = useMediaQuery('(min-width: 1024px)');

  const session = getSession();
  const farmerName = session?.name || FARMER_NAME;
  const farmerId = session?.farmer_id || FARMER_ID;
  const activeId = activeFrom(location.pathname);

  const { items: notifications } = useFarmerNotifications();
  const unread = notifications.filter(n => !n.read).length;

  if (!desktop) {
    return <MobileShell activeId={activeId} farmerName={farmerName} farmerId={farmerId} unread={unread} />;
  }
  return <DesktopShell activeId={activeId} farmerName={farmerName} farmerId={farmerId} unread={unread} />;
}

/* ------------------------------------------------------------------ Mobile */
function MobileShell({ activeId, farmerName, farmerId, unread }) {
  const navigate = useNavigate();
  const signOut = () => { clearSession(); navigate('/signin', { replace: true }); };

  return (
    <div className="min-h-screen font-farmer flex items-center justify-center" style={{ background: 'var(--ag-out)' }}>
      <div id="farmer-frame"
        className="relative w-full max-w-[430px] h-screen overflow-hidden sm:h-[780px] sm:w-[390px] sm:max-w-none sm:flex-none sm:rounded-[38px] sm:shadow-2xl"
        style={{ background: 'var(--ag-bg)' }}>
        <Outlet />

        <nav className="absolute left-3.5 right-3.5 bottom-3.5 h-[68px] rounded-[34px] flex items-center justify-around px-2 z-20"
          style={{ background: 'var(--ag-card, #fff)', boxShadow: '0 10px 34px rgba(10,50,35,0.25)' }}>
          {TABS.map((t) => {
            const Icon = t.icon;
            const on = activeId === t.id;
            if (t.fab) {
              return (
                <button key={t.id} onClick={() => navigate(t.path)}
                  className="relative w-[62px] h-[62px] rounded-full flex items-center justify-center -mt-[34px] border-[5px] transition"
                  style={{ background: 'linear-gradient(145deg,#f2b705,#d99a00)', color: '#3a2a00', borderColor: 'var(--ag-bg)', boxShadow: '0 8px 20px rgba(29,92,69,0.4)' }}
                  aria-label={t.label}>
                  {!on && <span className="absolute inset-[-5px] rounded-full border-2 border-[#2f8a66] ag-fab-ring" />}
                  <Icon className="w-6 h-6" />
                </button>
              );
            }
            return (
              <button key={t.id} onClick={() => navigate(t.path)} aria-label={t.label}
                className="h-12 rounded-3xl flex items-center gap-1.5 px-3 text-[12px] font-semibold transition relative"
                style={on ? { background: 'var(--ag-gl)', color: 'var(--ag-g)' } : { color: 'var(--ag-mut)' }}>
                <Icon className="w-5 h-5" />
                <span className={`overflow-hidden whitespace-nowrap transition-all ${on ? 'max-w-[70px]' : 'max-w-0'}`}>{t.label}</span>
                {t.id === 'inbox' && unread > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold grid place-items-center" style={{ background: 'var(--ag-r)', color: '#fff' }}>{unread}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Desktop */
function DesktopShell({ activeId, farmerName, farmerId, unread }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [lang, setLang] = useState(getSession()?.language || 'English');
  const [query, setQuery] = useState('');

  const signOut = () => { clearSession(); navigate('/signin', { replace: true }); };
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="h-screen flex overflow-hidden font-jk" style={{ background: 'var(--ac-bg)', color: 'var(--ac-ink)' }}>
      <Sidebar activeId={activeId} collapsed={collapsed} setCollapsed={setCollapsed}
        farmerName={farmerName} farmerId={farmerId} unread={unread} navigate={navigate} signOut={signOut} />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-20 flex items-center gap-3.5 px-8 lg:px-10 h-[72px]"
          style={{ background: 'color-mix(in srgb, var(--ac-bg) 85%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--ac-ln)' }}>
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold font-jk leading-tight" style={{ color: 'var(--ac-ink)' }}>{TITLES[activeId] || 'Home'}</h1>
            <small className="text-[12px] font-jk" style={{ color: 'var(--ac-mu)' }}>{today}</small>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 rounded-full px-4 py-2 w-[280px]"
              style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-mu)' }}>
              <Search className="w-4 h-4" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search services, permits, farms…"
                className="bg-transparent outline-none flex-1 text-[13px] min-w-0 font-jk" style={{ color: 'var(--ac-ink)' }} />
            </div>

            <div className="relative">
              <select value={lang} onChange={e => setLang(e.target.value)} aria-label="Language"
                className="appearance-none rounded-full pl-3.5 pr-7 py-2 text-[12.5px] font-medium font-jk cursor-pointer"
                style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-ink)' }}>
                {LANGUAGES.map(l => <option key={l}>{l}</option>)}
              </select>
              <ChevronLeft className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 rotate-[-90deg] pointer-events-none" style={{ color: 'var(--ac-mu)' }} />
            </div>

            <button onClick={() => navigate('/app/inbox')} aria-label="Notifications"
              className="w-10 h-10 rounded-full grid place-items-center relative"
              style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)' }}>
              <Bell className="w-[18px] h-[18px]" style={{ color: 'var(--ac-ink)' }} />
              {unread > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full" style={{ background: 'var(--ac-r)', boxShadow: '0 0 0 2px var(--ac-cd)' }} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto ac-scr">
          <div key={location.pathname} className="ac-rise px-8 lg:px-10 py-7 pb-12 max-w-[1240px] mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Sidebar */
function Sidebar({ activeId, collapsed, setCollapsed, farmerName, farmerId, unread, navigate, signOut }) {
  const navRef = useRef(null);
  const btnRefs = useRef({});
  const [hl, setHl] = useState({ top: 0, h: 0, show: false });

  useLayoutEffect(() => {
    const el = btnRefs.current[activeId];
    if (!el) { setHl(h => ({ ...h, show: false })); return; }
    setHl({ top: el.offsetTop, h: el.offsetHeight, show: true });
  }, [activeId, collapsed]);

  const go = (path) => navigate(path);

  return (
    <div className="relative flex-none" style={{ margin: '14px 0 14px 14px', zIndex: 30 }}>
    <aside
      className="hidden lg:flex flex-col h-full relative overflow-y-auto ac-scr transition-[width] duration-300"
      style={{
        width: collapsed ? 96 : 276,
        borderRadius: 30,
        padding: collapsed ? '20px 12px' : '20px 14px',
        color: '#fff',
        background: 'radial-gradient(90% 40% at 15% 0%, #2fa77555, transparent 70%), radial-gradient(80% 40% at 100% 100%, #c9a24b33, transparent 70%), linear-gradient(170deg, #0f4533, #07241a)',
        boxShadow: '0 24px 60px #06241a55, inset 0 0 0 1px #ffffff14',
      }}>
      {/* dotted texture */}
      <div className="pointer-events-none absolute inset-0 rounded-[30px]" style={{ backgroundImage: 'radial-gradient(#ffffff12 1px, transparent 1px)', backgroundSize: '16px 16px', maskImage: 'linear-gradient(#000, transparent 70%)', WebkitMaskImage: 'linear-gradient(#000, transparent 70%)' }} />

      {/* brand */}
      <div className="relative flex items-center gap-3 px-1.5 mb-4" style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div className="w-[46px] h-[46px] rounded-[14px] bg-white grid place-items-center overflow-hidden flex-none">
          <img src={LOGO_URL} alt="Emfuleni Local Municipality" className="w-9 h-9 object-contain" />
        </div>
        {!collapsed && (
          <div className="leading-tight min-w-0">
            <b className="block text-[16px] tracking-tight font-jk">Agri Connect</b>
            <span className="text-[11px] text-[#9fc7b4] font-jk">Emfuleni Local Municipality</span>
          </div>
        )}
      </div>

      {/* farmer card */}
      {!collapsed && (
        <button type="button" onClick={() => navigate('/app/profile')}
          className="relative flex items-center gap-3 rounded-[18px] px-3 py-3 mb-3 w-full text-left transition hover:bg-white/10 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#ffffff1c,#ffffff08)', border: '1px solid #ffffff1c', backdropFilter: 'blur(10px)' }}>
          <span className="relative w-[42px] h-[42px] rounded-full grid place-items-center font-bold text-[13px] flex-none"
            style={{ background: 'linear-gradient(135deg,#4fb98a,#1f7a57)', border: '2px solid #ffffff44' }}>
            {initials(farmerName)}
            <span className="absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full" style={{ background: '#4be08f', border: '2px solid #0f4533' }} />
          </span>
          <div className="min-w-0 flex-1">
            <b className="block text-[13.5px] font-jk truncate">{farmerName}</b>
            <span className="text-[11px] text-[#8fe0b6] font-jk">✓ Verified · {farmerId}</span>
          </div>
          <ChevronRight className="w-4 h-4 flex-none" style={{ color: '#8fe0b6' }} />
        </button>
      )}
      {collapsed && (
        <button type="button" onClick={() => navigate('/app/profile')} aria-label="Profile"
          className="relative w-[42px] h-[42px] rounded-full grid place-items-center font-bold text-[13px] flex-none mx-auto mb-3 cursor-pointer"
          style={{ background: 'linear-gradient(135deg,#4fb98a,#1f7a57)', border: '2px solid #ffffff44' }}>
          {initials(farmerName)}
          <span className="absolute -bottom-0.5 -right-0.5 w-[11px] h-[11px] rounded-full" style={{ background: '#4be08f', border: '2px solid #0f4533' }} />
          <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap rounded-[10px] px-3 py-1.5 text-[12px] font-jk z-30"
            style={{ background: '#10211a', color: '#fff', boxShadow: '0 8px 20px #0004' }}>Profile</span>
        </button>
      )}

      {!collapsed && <div className="text-[10.5px] tracking-[1.4px] text-[#7fa896] font-jk px-2.5 mb-1">MENU</div>}

      {/* nav */}
      <div ref={navRef} className="relative flex flex-col gap-1.5">
        {hl.show && !collapsed && (
          <div className="absolute left-0 right-0 rounded-[18px] transition-transform"
            style={{
              top: 0,
              height: hl.h,
              transform: `translateY(${hl.top}px)`,
              background: 'linear-gradient(90deg,#ffffff30,#ffffff10)',
              boxShadow: 'inset 0 0 0 1px #ffffff26, 0 10px 24px #0003',
              transitionProperty: 'transform',
              transitionDuration: '450ms',
              transitionTimingFunction: 'cubic-bezier(.3,1.35,.5,1)',
              pointerEvents: 'none',
            }} />
        )}
        {NAV.map((n) => {
          const Icon = n.icon;
          const on = activeId === n.id;
          return (
            <button key={n.id} ref={el => { btnRefs.current[n.id] = el; }} onClick={() => go(n.path)} data-tip={n.label}
              className="relative flex items-center gap-3 rounded-[18px] transition group"
              style={{ padding: collapsed ? '8px 0' : '8px 12px 8px 8px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <span className="w-[38px] h-[38px] rounded-[13px] grid place-items-center text-white flex-none transition-transform group-hover:rotate-[-8deg] group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${n.from}, ${n.to})`, boxShadow: '0 6px 14px #0004, inset 0 1px 0 #ffffff55', transform: on ? 'scale(1.06)' : undefined }}>
                <Icon className="w-[18px] h-[18px]" />
              </span>
              {!collapsed && <span className="text-[13.5px] font-medium font-jk transition" style={{ color: on ? '#fff' : '#c5ddd0', fontWeight: on ? 600 : 500 }}>{n.label}</span>}
              {n.id === 'inbox' && !collapsed && unread > 0 && (
                <span className="ml-auto text-[11px] font-bold rounded-full px-2 py-px font-jk" style={{ background: 'var(--ac-au)', color: '#2b2108' }}>{unread}</span>
              )}
              {on && !collapsed && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full" style={{ background: 'var(--ac-au)', boxShadow: '0 0 12px var(--ac-au)' }} />}
              {collapsed && (
                <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap rounded-[10px] px-3 py-1.5 text-[12px] font-jk z-30"
                  style={{ background: '#10211a', color: '#fff', boxShadow: '0 8px 20px #0004' }}>{n.label}</span>
              )}
            </button>
          );
        })}

        {/* Report CTA */}
        <button onClick={() => go('/app/report')}
          className={`relative flex items-center gap-3 rounded-[18px] mt-3 ac-pulse ${collapsed ? 'justify-center' : ''}`}
          style={{
            padding: collapsed ? '8px 0' : '10px 12px 10px 8px',
            background: 'linear-gradient(135deg,#d8b45a,#b98d2c)',
            color: '#2b2108',
            fontWeight: 700,
            boxShadow: '0 8px 20px #b98d2c55',
          }}>
          <span className="w-[38px] h-[38px] rounded-[13px] grid place-items-center flex-none" style={{ background: '#2b210822' }}>
            <TriangleAlert className="w-[18px] h-[18px]" />
          </span>
          {!collapsed && <span className="text-[13.5px] font-jk">Report a problem</span>}
          {collapsed && (
            <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 hidden group-hover:block whitespace-nowrap rounded-[10px] px-3 py-1.5 text-[12px] font-jk z-30"
              style={{ background: '#10211a', color: '#fff', boxShadow: '0 8px 20px #0004' }}>Report a problem</span>
          )}
        </button>
      </div>

      <div className="flex-1" />

      {/* farm health */}
      {!collapsed && (
        <div className="relative flex items-center gap-3 rounded-[18px] px-3 py-3 mb-2" style={{ background: '#ffffff0d', border: '1px solid #ffffff18' }}>
          <svg viewBox="0 0 44 44" width="44" height="44" className="flex-none">
            <circle cx="22" cy="22" r="18" fill="none" stroke="#ffffff22" strokeWidth="5" />
            <circle cx="22" cy="22" r="18" fill="none" stroke="#4be08f" strokeWidth="5" strokeDasharray="104 113" transform="rotate(-90 22 22)" strokeLinecap="round" />
          </svg>
          <div>
            <b className="block text-[12.5px] font-jk">Farm health</b>
            <span className="text-[11px] text-[#8fe0b6] font-jk">Good · 92%</span>
          </div>
        </div>
      )}

      {/* help card */}
      {!collapsed && (
        <div className="relative rounded-[18px] px-3.5 py-3.5 mb-2" style={{ background: '#ffffff0d', border: '1px solid #ffffff1c' }}>
          <b className="block text-[13px] font-jk mb-0.5">Need a hand?</b>
          <span className="text-[12px] text-[#cfe5d8] font-jk">Your extension officer or helpdesk can assist.</span>
          <button onClick={() => navigate('/app/inbox')} className="mt-2.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold font-jk" style={{ background: '#fff', color: 'var(--ac-gd)' }}>Request call-back</button>
        </div>
      )}

      <button onClick={signOut} className="relative flex items-center gap-3 rounded-[14px] px-3 py-2.5 transition hover:bg-white/10"
        style={{ justifyContent: collapsed ? 'center' : 'flex-start', color: '#c5ddd0' }}>
        <LogOut className="w-5 h-5 flex-none" />
        {!collapsed && <span className="text-[13px] font-medium font-jk">Sign out</span>}
      </button>
    </aside>

    {/* collapse toggle — kept outside the scrollable aside so it is never clipped */}
    <button onClick={() => setCollapsed(c => !c)} aria-label="Collapse menu"
      className="absolute right-[-14px] top-[38px] w-7 h-7 rounded-full grid place-items-center transition z-20"
      style={{ background: '#fff', color: 'var(--ac-gd)', boxShadow: '0 6px 16px #0004' }}>
      <ChevronLeft className="w-4 h-4 transition-transform" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} />
    </button>
    </div>
  );
}