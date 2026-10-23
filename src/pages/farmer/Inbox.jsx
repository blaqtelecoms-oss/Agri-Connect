import React, { useState } from 'react';
import { Phone, TriangleAlert, LifeBuoy, FileText, Bell } from 'lucide-react';
import { useFarmerNotifications, Chip, FarmerCard, PageWrap, PageHeader, showToast, DCard, DSectionHead, DChip } from './_shared';

const icons = { alert: TriangleAlert, action: FileText, visit: LifeBuoy, notice: Bell, message: FileText };
const variants = { alert: 'c-r', action: 'c-b', visit: 'c-g', notice: 'c-y', message: 'c-g' };

export default function Inbox() {
  const { items, loading } = useFarmerNotifications();
  const [tab, setTab] = useState('alerts');

  const filtered = items.filter(n => tab === 'alerts' ? ['alert', 'action', 'notice'].includes(n.type) : n.type === 'message' || n.type === 'visit');

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <PageWrap>
          <PageHeader title="Inbox" subtitle="Alerts and messages from your extension office."
            actions={<button onClick={() => showToast('Call-back requested – helpdesk will call within 2 hours')} className="w-10 h-10 rounded-full grid place-items-center shadow-sm border" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-g)', borderColor: 'var(--ag-line)' }}><Phone className="w-5 h-5" /></button>}
          />
          <div className="flex rounded-full p-1 my-4 max-w-xs" style={{ background: 'var(--ag-gl)' }}>
            <button onClick={() => setTab('alerts')} className="flex-1 py-2 rounded-full text-[12.5px] font-medium" style={tab === 'alerts' ? { background: 'var(--ag-g)', color: '#fff' } : { color: 'var(--ag-mut)' }}>Alerts</button>
            <button onClick={() => setTab('messages')} className="flex-1 py-2 rounded-full text-[12.5px] font-medium" style={tab === 'messages' ? { background: 'var(--ag-g)', color: '#fff' } : { color: 'var(--ag-mut)' }}>Messages</button>
          </div>
          <FarmerCard className="mt-2">
            {loading && <div className="py-6 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>Loading…</div>}
            {filtered.length === 0 && !loading && <div className="py-6 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>No {tab} yet.</div>}
            {filtered.map(n => {
              const I = icons[n.type] || FileText;
              return (
                <div key={n.id} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                  <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><I className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{n.title}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{n.body}</span></div>
                  <Chip text={n.type} variant={variants[n.type]} />
                </div>
              );
            })}
          </FarmerCard>
        </PageWrap>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-center mb-4">
          <div className="flex rounded-full p-1" style={{ background: 'var(--ac-gl)' }}>
            <button onClick={() => setTab('alerts')} className="px-5 py-2 rounded-full text-[12.5px] font-semibold font-jk" style={tab === 'alerts' ? { background: 'var(--ac-gd)', color: '#fff' } : { color: 'var(--ac-mu)' }}>Alerts</button>
            <button onClick={() => setTab('messages')} className="px-5 py-2 rounded-full text-[12.5px] font-semibold font-jk" style={tab === 'messages' ? { background: 'var(--ac-gd)', color: '#fff' } : { color: 'var(--ac-mu)' }}>Messages</button>
          </div>
          <button onClick={() => showToast('Call-back requested – helpdesk will call within 2 hours')} aria-label="Request call-back"
            className="rounded-full px-4 py-2 text-[12.5px] font-semibold font-jk flex items-center gap-2" style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-g)' }}><Phone className="w-4 h-4" /> Request call-back</button>
        </div>

        <DCard>
          {loading && <div className="py-10 text-center text-[13px] font-jk" style={{ color: 'var(--ac-mu)' }}>Loading…</div>}
          {filtered.length === 0 && !loading && <div className="py-10 text-center text-[13px] font-jk" style={{ color: 'var(--ac-mu)' }}>No {tab} yet.</div>}
          {filtered.map(n => {
            const I = icons[n.type] || FileText;
            return (
              <div key={n.id} className="flex gap-3 items-center py-3.5 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
                <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><I className="w-[18px] h-[18px]" /></span>
                <div className="flex-1 min-w-0">
                  <b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)', fontWeight: n.read ? 500 : 700 }}>{n.title}</b>
                  <span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{n.body}</span>
                </div>
                <DChip text={n.type} variant={variants[n.type]} />
              </div>
            );
          })}
        </DCard>
      </div>
    </>
  );
}