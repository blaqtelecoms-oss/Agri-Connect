import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useEntityList, AdminCard, Pill, StatusBadge, PageHead, adminToast } from './_admin';
import { qrSvgFromToken } from '@/lib/agriAssets';
import { Check, CircleDashed } from 'lucide-react';

export default function Applications() {
  const { items: apps, reload } = useEntityList('Application', {}, '-created_date');
  const [queue, setQueue] = useState('all');
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);

  const filtered = apps.filter(a => {
    if (queue === 'escalated') return a.status === 'escalated';
    if (queue === 'breached') return a.progress > 80 && !['approved', 'issued', 'rejected'].includes(a.status);
    return true;
  });
  const a = filtered[selected] || apps[selected];

  const approve = async () => {
    if (!a) return;
    setBusy(true);
    try {
      await base44.entities.Application.update(a.id, { status: 'approved', progress: 100, review_notes: 'Approved and permit issued.' });
      const permitNum = 'PRM-2026-' + String(Math.floor(1000 + Math.random() * 8999));
      await base44.entities.Permit.create({
        number: permitNum,
        type: a.service_type,
        farmer_id: a.farmer_id,
        farmer_name: a.farmer_name,
        application_id: a.reference,
        issue_date: new Date().toLocaleDateString('en-ZA'),
        expiry_date: 'Nov 2026',
        qr_token: a.reference + permitNum,
        status: 'active',
      });
      await base44.entities.NotificationItem.create({
        farmer_id: a.farmer_id,
        title: 'Application approved',
        body: `${a.service_type} (${a.reference}) has been approved. Your permit ${permitNum} is ready.`,
        type: 'visit',
        channel: 'push',
      });
      await base44.entities.AuditLog.create({ actor: 'N. Mahlangu', action: `Approved ${a.reference}`, entity: 'Application', detail: a.service_type, timestamp: new Date().toLocaleString('en-ZA') });
      adminToast(`${a.reference} approved – QR permit issued · farmer notified`);
      reload();
    } finally { setBusy(false); }
  };
  const requestInfo = async () => {
    if (!a) return; setBusy(true);
    try {
      await base44.entities.Application.update(a.id, { status: 'more_info_required' });
      await base44.entities.NotificationItem.create({ farmer_id: a.farmer_id, title: 'More information required', body: `Upload a clearer copy for ${a.reference}.`, type: 'action', channel: 'push' });
      adminToast(`${a.reference} – more info requested · farmer notified`); reload();
    } finally { setBusy(false); }
  };
  const reject = async () => {
    if (!a) return; setBusy(true);
    try {
      await base44.entities.Application.update(a.id, { status: 'rejected' });
      await base44.entities.NotificationItem.create({ farmer_id: a.farmer_id, title: 'Application rejected', body: `${a.reference} was rejected. Contact your extension officer.`, type: 'alert', channel: 'push' });
      adminToast(`${a.reference} rejected · farmer notified`); reload();
    } finally { setBusy(false); }
  };

  return (
    <>
      <PageHead title="Applications & Permits" sub="Workflow engine · work queues by role and region" />
      <div className="flex gap-2 mb-3 flex-wrap">
        {[
          { k: 'all', label: `All queues (${apps.length})` },
          { k: 'mine', label: 'My queue (14)' },
          { k: 'escalated', label: `Escalated (${apps.filter(x => x.status === 'escalated').length})` },
          { k: 'breached', label: 'SLA breached (2)' },
        ].map(t => (
          <button key={t.k} onClick={() => { setQueue(t.k); setSelected(0); }} className="px-3.5 py-1.5 rounded-full text-[12px] border"
            style={queue === t.k ? { background: '#14181a', color: '#fff', borderColor: '#14181a' } : { borderColor: 'var(--ag-line)', color: 'var(--ag-ink)' }}>{t.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1">
        <AdminCard title="Work queue">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>{['Reference', 'Service', 'Applicant', 'Status', 'Due'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {(filtered.length ? filtered : apps).map((x, i) => (
                  <tr key={x.id} onClick={() => setSelected(apps.indexOf(x))} className="cursor-pointer hover:bg-black/5"
                    style={{ background: apps[selected] === x ? 'var(--ag-pn)' : 'transparent' }}>
                    <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{x.reference}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{x.service_type}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{x.farmer_name}</td>
                    <td className="py-2.5 px-1.5"><StatusBadge text={x.status} /></td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{x.due_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {a && (
          <AdminCard title="Reviewer tools">
            <b style={{ color: 'var(--ag-ink)' }}>{a.service_type}</b>
            <div className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{a.reference} · {a.farmer_name}</div>
            <div className="rounded-[14px] h-[90px] grid place-items-center my-3 text-[12px]" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}>Document viewer · ID copy, lease, vaccination record</div>
            <div className="flex gap-2.5 items-center py-1.5"><span className="w-[18px] h-[18px] rounded-md grid place-items-center text-white text-[11px]" style={{ background: 'var(--ag-gr)' }}><Check className="w-3 h-3" /></span>Identity verified</div>
            <div className="flex gap-2.5 items-center py-1.5"><span className="w-[18px] h-[18px] rounded-md grid place-items-center text-white text-[11px]" style={{ background: 'var(--ag-gr)' }}><Check className="w-3 h-3" /></span>Vaccination status checked</div>
            <div className="flex gap-2.5 items-center py-1.5"><span className="w-[18px] h-[18px] rounded-md" style={{ border: '1.5px solid var(--ag-line)' }} />No active movement restrictions at destination</div>
            <label className="block text-[11.5px] mt-2.5 mb-1" style={{ color: 'var(--ag-mut)' }}>Reason code</label>
            <select className="w-full rounded-xl px-3 py-2.5 text-[14px] border" style={{ background: 'var(--ag-pn)', borderColor: 'var(--ag-line)', color: 'var(--ag-ink)' }}>
              <option>Complete – approve</option><option>Missing document</option><option>Zone restriction</option>
            </select>
            <div className="flex gap-2 mt-3.5 flex-wrap">
              <Pill onClick={approve}>Approve & issue QR</Pill>
              <Pill variant="light" onClick={requestInfo}>Request info</Pill>
              <Pill variant="light" onClick={reject}>Reject</Pill>
            </div>
          </AdminCard>
        )}
      </div>
    </>
  );
}