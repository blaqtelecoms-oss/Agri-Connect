import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

// Toast helper for admin pages — writes through the global set in AdminLayout.
export function adminToast(msg) {
  if (window.__agriToast) window.__agriToast(msg);
}

export function useEntityList(entity, query = {}, sort = '-created_date', limit = 50) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    try {
      const page = await base44.entities[entity].filter(query, { sort, limit });
      setItems(Array.isArray(page) ? page : page.items);
    } catch (e) {
      console.error(entity, e);
    } finally {
      setLoading(false);
    }
  }, [entity, JSON.stringify(query), sort, limit]);
  useEffect(() => { reload(); }, [reload]);
  return { items, loading, reload };
}

export function useCounts(queryObj) {
  const [counts, setCounts] = useState({});
  const reload = useCallback(async () => {
    try {
      const [farmers, apps, incidents] = await Promise.all([
        base44.entities.Farmer.count({}),
        base44.entities.Application.count(queryObj || {}),
        base44.entities.Incident.count({}),
      ]);
      setCounts({ farmers, apps, incidents });
    } catch (e) { /* noop */ }
  }, [JSON.stringify(queryObj)]);
  useEffect(() => { reload(); }, [reload]);
  return { counts, reload };
}

// Status classification for admin tables.
export const statusClass = (s) => {
  s = String(s || '').toLowerCase();
  if (/review|progress|open|investigat|in_review/.test(s)) return 't-or';
  if (/approved|verified|complet|valid|active|sent|issued|cleared/.test(s)) return 't-gr';
  if (/pending|draft|warning|scheduled|queued|submitted/.test(s)) return 't-am';
  if (/reject|changes|breach|critical|high|escalat/.test(s)) return 't-rd';
  return 't-bl';
};
export const statusColors = { 't-or': 'var(--ag-or)', 't-gr': 'var(--ag-gr)', 't-am': 'var(--ag-am)', 't-rd': '#b3261e', 't-bl': 'var(--ag-b)' };

export const StatusBadge = ({ text }) => (
  <span className="text-[12px] font-medium capitalize" style={{ color: statusColors[statusClass(text)] }}>
    {text.replace(/_/g, ' ')}
  </span>
);

export const AdminCard = ({ title, right, children, className = '' }) => (
  <div className={`rounded-[22px] p-5 ${className}`} style={{ background: 'var(--ag-card, #fff)' }}>
    {(title || right) && (
      <div className="flex justify-between items-center mb-3">
        {title && <h4 className="text-[16px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{title}</h4>}
        {right}
      </div>
    )}
    {children}
  </div>
);

export const PageHead = ({ title, sub }) => (
  <div className="flex items-end justify-between mt-1">
    <h2 className="text-2xl font-light tracking-tight" style={{ color: 'var(--ag-ink)' }}>{title}</h2>
    <span className="text-[13px]" style={{ color: 'var(--ag-mut)' }}>{sub}</span>
  </div>
);

export const Bar = ({ percent, color = 'var(--ag-gr)' }) => (
  <div className="h-1.5 rounded-full overflow-hidden min-w-[60px]" style={{ background: 'var(--ag-line)' }}>
    <span className="block h-full rounded-full" style={{ width: percent + '%', background: color }} />
  </div>
);

export const Pill = ({ children, onClick, variant = 'dark' }) => (
  <button onClick={onClick} className="rounded-full px-4 py-2 text-[14px] font-medium whitespace-nowrap"
    style={variant === 'dark' ? { background: '#14181a', color: '#fff' } : { background: 'transparent', color: 'var(--ag-ink)', border: '1px solid var(--ag-line)' }}>
    {children}
  </button>
);

export const MiniStat = ({ label, value, note }) => (
  <div className="rounded-[22px] px-4 py-3.5" style={{ background: 'var(--ag-card, #fff)' }}>
    <span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{label}</span>
    <b className="block text-[26px] font-light tracking-tight" style={{ color: 'var(--ag-ink)' }}>{value}</b>
    {note && <span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>{note}</span>}
  </div>
);

export const StatCard = ({ heading, value, sub, variant }) => {
  const bg = variant === 'or' ? 'var(--ag-or)' : variant === 'gr' ? 'var(--ag-gr)' : 'var(--ag-card, #fff)';
  const light = variant === 'or' || variant === 'gr';
  return (
    <div className="rounded-[24px] p-5 flex flex-col justify-between min-h-[140px]" style={{ background: bg, color: light ? '#fff' : 'var(--ag-ink)' }}>
      <h3 className="text-[24px] font-light leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: heading }} />
      <div>
        <b className="block text-[34px] font-light tracking-tight">{value}</b>
        <small className="text-[11px]" style={{ color: light ? (variant === 'or' ? '#ffd24d' : '#e7ff7a') : 'var(--ag-gr)' }}>{sub}</small>
      </div>
    </div>
  );
};