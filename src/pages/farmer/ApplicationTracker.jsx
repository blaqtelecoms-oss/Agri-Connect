import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CATEGORY_META } from './ServiceApplyForm';
import { Chip, DChip } from './_shared';

// Status → desktop chip colour variant.
const statusVariant = (status) => {
  const s = String(status || '').toLowerCase();
  if (/review|progress|open|needs|more/.test(s)) return 'c-y';
  if (/approved|verified|complete|valid|issued/.test(s)) return 'c-g';
  if (/reject|changes|breach|critical/.test(s)) return 'c-r';
  return 'c-b';
};

// Generic status-aware timeline steps shared by every application row.
function timelineSteps(app) {
  const s = String(app.status || '').toLowerCase();
  const approved = /approved|issued|complete|valid/.test(s);
  const rejected = /reject/.test(s);
  const moreInfo = /more_info|info/.test(s);
  return [
    { t: 'Submitted', d: app.submitted_date || '—', st: 'done' },
    {
      t: 'Officer review',
      d: moreInfo ? 'More info requested — check Notifications' : `${app.assigned_officer || 'Officer'} · due ${app.due_date || '—'}`,
      st: approved || rejected ? 'done' : 'cur',
    },
    {
      t: 'Outcome',
      d: approved ? 'Approved & issued with QR-verifiable document' : rejected ? 'Not approved' : 'Awaiting decision',
      st: approved ? 'done' : rejected ? 'rej' : '',
    },
  ];
}

const dotColor = (st, t) => (st === 'done' ? t.g : st === 'cur' ? t.au : st === 'rej' ? t.r : t.line);

function ApplicationRow({ app, defaultOpen, desktop }) {
  const [open, setOpen] = useState(!!defaultOpen);
  const meta = CATEGORY_META[app.category] || CATEGORY_META.permit;
  const I = meta.Icon;
  const jk = desktop ? 'font-jk' : '';
  const t = {
    ink: desktop ? 'var(--ac-ink)' : 'var(--ag-ink)',
    mut: desktop ? 'var(--ac-mu)' : 'var(--ag-mut)',
    line: desktop ? 'var(--ac-ln)' : 'var(--ag-line)',
    g: desktop ? 'var(--ac-g)' : 'var(--ag-g)',
    au: desktop ? 'var(--ac-au)' : 'var(--ag-y)',
    auGlow: desktop ? '#c9a24b33' : '#f2b70533',
    r: '#a3281b',
    card: desktop ? 'var(--ac-cd)' : 'var(--ag-card, #fff)',
  };
  const steps = timelineSteps(app);

  return (
    <div className={desktop ? 'border-b last:border-0 py-2.5' : 'rounded-[20px] border p-3.5'}
      style={desktop ? { borderColor: t.line } : { background: t.card, borderColor: 'var(--ag-line)', boxShadow: '0 3px 14px rgba(15,40,30,0.06)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 text-left">
        <span className="w-[40px] h-[40px] rounded-[13px] grid place-items-center flex-none text-white"
          style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, boxShadow: `0 5px 12px ${meta.to}40, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
          <I className="w-5 h-5" strokeWidth={2.1} />
        </span>
        <span className="flex-1 min-w-0">
          <b className={`block text-[13px] font-semibold leading-tight ${jk}`} style={{ color: t.ink }}>{app.service_type}</b>
          <span className={`block text-[11.5px] mt-0.5 ${jk}`} style={{ color: t.mut }}>{app.reference} · Submitted {app.submitted_date || '—'}</span>
        </span>
        {desktop
          ? <DChip text={(app.status || '').replace(/_/g, ' ')} variant={statusVariant(app.status)} />
          : <Chip text={(app.status || '').replace(/_/g, ' ')} />}
        <ChevronDown className={`w-4 h-4 flex-none transition-transform ${open ? 'rotate-180' : ''}`} style={{ color: t.mut }} />
      </button>
      {open && (
        <div className="relative pl-6 mt-3">
          {steps.map((step, i, arr) => (
            <div key={i} className={`relative pb-3.5 last:pb-0 text-[12.5px] ${jk}`} style={{ color: t.ink }}>
              <span className="absolute -left-6 top-[3px] w-3.5 h-3.5 rounded-full border-[3px]"
                style={{ background: dotColor(step.st, t), borderColor: dotColor(step.st, t), boxShadow: step.st === 'cur' ? `0 0 0 4px ${t.auGlow}` : 'none' }} />
              {step.t}<br /><span className={`text-[12px] ${jk}`} style={{ color: t.mut }}>{step.d}</span>
              {i < arr.length - 1 && <span className="absolute -left-[19px] top-4 bottom-0 w-0.5" style={{ background: step.st === 'done' ? t.g : t.line }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Lists every application the farmer made (newest first), each expandable to
// its status timeline. Used by the Services page in both portal layouts.
export default function ApplicationTracker({ apps, desktop = false }) {
  if (!apps.length) {
    return <div className={`py-6 text-center text-[13px] ${desktop ? 'font-jk' : ''}`} style={{ color: desktop ? 'var(--ac-mu)' : 'var(--ag-mut)' }}>No applications to track yet.</div>;
  }
  return (
    <div className={desktop ? '' : 'space-y-2.5'}>
      {apps.map((a, i) => (
        <ApplicationRow key={a.id || a.reference} app={a} defaultOpen={i === 0} desktop={desktop} />
      ))}
    </div>
  );
}
