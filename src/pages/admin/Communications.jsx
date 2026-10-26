import React, { useState } from 'react';
import { useEntityList, AdminCard, Pill, PageHead, adminToast } from './_admin';

export default function Communications() {
  const { items: messages, reload } = useEntityList('Message', {}, '-created_date');
  const [body, setBody] = useState('Compulsory FMD vaccination ends 31 Oct. Visit your nearest extension office or book via Agri Connect.');

  const send = (mode) => {
    adminToast(mode === 'emergency' ? 'Emergency broadcast sent with priority delivery' : mode === 'schedule' ? 'Notice scheduled' : 'Notice sent to selected audience');
    reload();
  };

  return (
    <>
      <PageHead title="Communications Centre" sub="Multi-channel notices to targeted groups" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1">
        <AdminCard title="Compose notice">
          <label className="block text-[11.5px] mt-1 mb-1" style={{ color: 'var(--ag-mut)' }}>Audience</label>
          <select className="w-full rounded-xl px-3 py-2.5 text-[14px] border" style={{ background: 'var(--ag-pn)', borderColor: 'var(--ag-line)', color: 'var(--ag-ink)' }}>
            <option>Evaton · Livestock farmers (1,240)</option><option>All farmers – Emfuleni</option><option>Maize growers – Walkerville</option>
          </select>
          <label className="block text-[11.5px] mt-2.5 mb-1" style={{ color: 'var(--ag-mut)' }}>Channels</label>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>Push ✓</span>
            <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>SMS ✓</span>
            <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>WhatsApp ✓</span>
            <span className="text-[11px] px-2.5 py-1 rounded-full opacity-50" style={{ background: 'var(--ag-pn)' }}>Email</span>
          </div>
          <label className="block text-[11.5px] mt-2.5 mb-1" style={{ color: 'var(--ag-mut)' }}>Message</label>
          <textarea rows={4} value={body} onChange={e => setBody(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-[14px] border" style={{ background: 'var(--ag-pn)', borderColor: 'var(--ag-line)', color: 'var(--ag-ink)' }} />
          <div className="flex gap-2.5 mt-3.5 flex-wrap items-center">
            <Pill onClick={() => send('now')}>Send now</Pill>
            <Pill variant="light" onClick={() => send('schedule')}>Schedule</Pill>
            <button onClick={() => send('emergency')} className="rounded-full px-4 py-2 text-[14px] font-medium text-white ml-auto" style={{ background: 'var(--ag-or)' }}>Emergency broadcast</button>
          </div>
        </AdminCard>
        <AdminCard title="Recent notices">
          <table className="w-full border-collapse">
            <thead><tr>{['Notice', 'Delivered', 'Read'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {messages.map(m => (
                <tr key={m.id} className="hover:bg-black/5">
                  <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{m.title}</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{m.delivered_percent}%</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{m.read_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
      </div>
    </>
  );
}