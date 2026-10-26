import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { sampleList } from './_farmerSampleData';

// Shared farmer-side data hooks. The demo farmer identity is fixed to
// Thabo Mokoena (FRM-EMF-00231) so the portal reads live entity records.
export const FARMER_ID = 'FRM-EMF-00231';
export const FARMER_NAME = 'Thabo Mokoena';

// Toast context-lite: a tiny event bus so any screen can show a toast.
const toastListeners = new Set();
export function showToast(message) {
  toastListeners.forEach((fn) => fn(message));
}
export function useToastBus() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const fn = (m) => { setMsg(m); };
    toastListeners.add(fn);
    return () => toastListeners.delete(fn);
  }, []);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 2600);
    return () => clearTimeout(t);
  }, [msg]);
  return [msg, setMsg];
}

export function useFarmerFarms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const page = await base44.entities.Farm.filter({ farmer_id: FARMER_ID });
      const items = Array.isArray(page) ? page : page.items;
      setFarms(items);
    } catch (e) {
      // Backend unreachable (not configured): serve sample rows so farmer
      // pages still populate. Live data always wins once a backend responds.
      setFarms(sampleList('Farm', { farmer_id: FARMER_ID }));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { farms, loading, reload: load };
}

export function useFarmerApplications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const page = await base44.entities.Application.filter({ farmer_id: FARMER_ID }, { sort: '-created_date' });
      const items = Array.isArray(page) ? page : page.items;
      setItems(items);
    } catch (e) {
      // Backend unreachable (not configured): serve sample rows so farmer
      // pages still populate. Live data always wins once a backend responds.
      setItems(sampleList('Application', { farmer_id: FARMER_ID }));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { items, loading, reload: load };
}

export function useServiceTypes() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try {
      const page = await base44.entities.ServiceType.filter({}, { sort: 'sort_order' });
      const items = Array.isArray(page) ? page : page.items;
      setItems(items);
    } catch (e) {
      // Backend unreachable (not configured): serve sample rows so farmer
      // pages still populate. Live data always wins once a backend responds.
      setItems(sampleList('ServiceType'));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);
  return { items, loading };
}

export function useFarmerNotifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      const page = await base44.entities.NotificationItem.filter({ farmer_id: FARMER_ID }, { sort: '-created_date' });
      const items = Array.isArray(page) ? page : page.items;
      setItems(items);
    } catch (e) {
      // Backend unreachable (not configured): serve sample rows so farmer
      // pages still populate. Live data always wins once a backend responds.
      setItems(sampleList('NotificationItem', { farmer_id: FARMER_ID }));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { items, loading, reload };
}

export function useIncidents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      const page = await base44.entities.Incident.filter({}, { sort: '-created_date' });
      const items = Array.isArray(page) ? page : page.items;
      setItems(items);
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { items, loading, reload };
}

// Status chip colour mapping for farmer portal
export const chipClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (/review|progress|open|needs|more/.test(s)) return 'c-y';
  if (/approved|verified|complete|valid|active|issued|sent/.test(s)) return 'c-g';
  if (/pending|draft|warning|scheduled|queued/.test(s)) return 'c-b';
  if (/reject|changes|breach|critical|high|escalat/.test(s)) return 'c-r';
  return 'c-b';
};

export const Chip = ({ text, variant }) => {
  const v = variant || chipClass(text);
  const map = {
    'c-g': 'bg-[#d9f0e3] text-[#15693f]',
    'c-y': 'bg-[#fdf0c4] text-[#8a6500]',
    'c-b': 'bg-[#dbeafb] text-[#1a63a8]',
    'c-r': 'bg-[#fadcd8] text-[#a3281b]',
  };
  return <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap ${map[v]}`}>{text}</span>;
};

export const FarmerCard = ({ children, className = '' }) => (
  <div className={`rounded-2xl p-3.5 lg:p-5 border lg:shadow-[0_2px_20px_rgba(15,40,30,0.06)] ${className}`} style={{ background: 'var(--ag-card, #fff)', borderColor: 'var(--ag-line)' }}>{children}</div>
);

// Responsive page shell: phone-bleed on mobile, centered padded column on desktop.
export const PageWrap = ({ children }) => (
  <div className="absolute inset-0 overflow-y-auto px-4 pb-[120px] lg:px-8 lg:py-9">
    <div className="lg:max-w-[1040px] lg:mx-auto">{children}</div>
  </div>
);

// Consistent modern page heading with optional subtitle + actions.
export const PageHeader = ({ title, subtitle, actions }) => (
  <div className="flex items-start gap-3 pt-5 lg:pt-0 lg:items-end">
    <div className="flex-1 min-w-0">
      <h1 className="text-xl lg:text-[26px] font-semibold tracking-tight" style={{ color: 'var(--ag-ink)' }}>{title}</h1>
      {subtitle && <p className="text-[13px] mt-1" style={{ color: 'var(--ag-mut)' }}>{subtitle}</p>}
    </div>
    {actions}
  </div>
);

export function initials(name) {
  return String(name || '').split(' ').slice(0, 2).map(x => x[0]).join('');
}

// ---------------------------------------------------------------------------
// Premium desktop portal primitives (ac-* tokens)
// ---------------------------------------------------------------------------

export const DCard = ({ children, className = '', style = {}, pad = true }) => (
  <div className={`rounded-[22px] border ${pad ? 'p-5' : 'p-0'} ${className}`}
    style={{ background: 'var(--ac-cd)', borderColor: 'var(--ac-ln)', boxShadow: 'var(--ac-sh)', minWidth: 0, ...style }}>
    {children}
  </div>
);

export const DSectionHead = ({ title, right }) => (
  <div className="flex justify-between items-center mb-3.5">
    <h3 className="text-[16px] font-bold tracking-tight font-jk" style={{ color: 'var(--ac-ink)' }}>{title}</h3>
    {right}
  </div>
);

export const DLink = ({ children, onClick }) => (
  <button onClick={onClick} className="text-[12px] font-semibold font-jk" style={{ color: 'var(--ac-g)' }}>{children}</button>
);

export const DChip = ({ text, variant = 'c-b' }) => (
  <span className={`text-[11px] font-semibold px-2.5 py-[3px] rounded-full inline-block font-jk ac-c-${variant}`}>{text}</span>
);

export const DIconTile = ({ children, from = '#6ee0a8', to = '#1f7a57', size = 38, r = 13, className = '', style = {} }) => (
  <span className={`grid place-items-center text-white flex-none font-jk ${className}`}
    style={{ width: size, height: size, borderRadius: r, background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: '0 6px 14px #0006, inset 0 1px 0 #ffffff55', ...style }}>
    {children}
  </span>
);

export const DListItem = ({ icon, title, sub, right, tileFrom = '#6ee0a8', tileTo = '#1f7a57' }) => {
  const I = icon;
  return (
    <div className="flex gap-3 items-center py-3 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
      <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}>
        {I ? <I className="w-[18px] h-[18px]" /> : null}
      </span>
      <div className="flex-1 min-w-0">
        <b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>{title}</b>
        <span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{sub}</span>
      </div>
      {right}
    </div>
  );
};

export const Sparkline = ({ data = [], color = '#1f7a57', w = 90, h = 36 }) => {
  if (!data.length) return null;
  const m = Math.max(...data), n = Math.min(...data);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${(i * w) / (data.length - 1)} ${h - 6 - ((v - n) / (m - n || 1)) * (h - 14)}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d={d} />
    </svg>
  );
};

export const Progress = ({ value = 0 }) => (
  <div className="h-[7px] rounded-[9px] overflow-hidden min-w-[80px]" style={{ background: 'var(--ac-ln)' }}>
    <i className="block h-full rounded-[9px]" style={{ width: `${Math.min(100, value)}%`, background: 'linear-gradient(90deg,#1f7a57,#4fb98a)' }} />
  </div>
);