import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useEntityList, AdminCard, MiniStat, Pill, StatusBadge, PageHead, adminToast, Bar } from './_admin';
import { LOGO_URL } from '@/lib/agriAssets';

export default function Registry() {
  const { items: farmers, reload } = useEntityList('Farmer', {}, '-created_date');
  const [selected, setSelected] = useState(0);
  const [busy, setBusy] = useState(false);
  const f = farmers[selected];

  const verified = farmers.filter(x => x.verification_status === 'verified').length;
  const queue = farmers.filter(x => x.verification_status === 'pending').length;
  const changes = farmers.filter(x => x.verification_status === 'changes_requested').length;

  const setVerification = async (status) => {
    if (!f) return;
    setBusy(true);
    try {
      await base44.entities.Farmer.update(f.id, { verification_status: status });
      await base44.entities.NotificationItem.create({
        farmer_id: f.farmer_code,
        title: status === 'verified' ? 'Profile verified' : 'Changes requested',
        body: status === 'verified' ? 'Your farmer profile is now verified. You can apply for grants and permits.' : 'Please review the requested changes and resubmit your documents.',
        type: status === 'verified' ? 'visit' : 'action',
        channel: 'push',
      });
      await base44.entities.AuditLog.create({
        actor: 'N. Mahlangu',
        action: status === 'verified' ? `Verified farmer ${f.farmer_code}` : `Requested changes for ${f.farmer_code}`,
        entity: 'Farmer',
        detail: f.name,
        timestamp: new Date().toLocaleString('en-ZA'),
      });
      adminToast(status === 'verified' ? `${f.name} verified – farmer notified` : 'Changes requested – farmer notified');
      reload();
    } finally { setBusy(false); }
  };

  return (
    <>
      <PageHead title="Farmer & Farm Registry" sub={`${farmers.length || 4826} farmers · 7,392 farms`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MiniStat label="Verified" value={verified} />
        <MiniStat label="Verification queue" value={queue} note={queue > 0 ? 'Review pending' : ''} />
        <MiniStat label="Possible duplicates" value={9} />
        <MiniStat label="Data quality score" value="91%" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1">
        <AdminCard title="All farmers" right={<Pill variant="light" onClick={() => adminToast('Bulk import wizard opened')}>Bulk import</Pill>}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>
                {['ID', 'Name', 'Type', 'Area', 'Status'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}
              </tr></thead>
              <tbody>
                {farmers.map((x, i) => (
                  <tr key={x.id} onClick={() => setSelected(i)} className="cursor-pointer hover:bg-black/5"
                    style={{ background: i === selected ? 'var(--ag-pn)' : 'transparent' }}>
                    <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{x.farmer_code}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{x.name}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{x.type}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{x.area}</td>
                    <td className="py-2.5 px-1.5"><StatusBadge text={x.verification_status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>

        {f && (
          <AdminCard title="Farmer 360">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full grid place-items-center text-white font-semibold text-[13px]" style={{ background: 'linear-gradient(135deg,#2f6f5a,#e2471b)' }}>
                {f.name.split(' ').slice(0, 2).map(x => x[0]).join('')}
              </div>
              <div><b style={{ color: 'var(--ag-ink)' }}>{f.name}</b><div className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{f.farmer_code} · {f.type}</div></div>
            </div>
            <div className="grid grid-cols-2 gap-2 my-3">
              <div className="rounded-xl p-2.5 text-[11.5px]" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}>Farms<b className="block text-[15px] font-medium" style={{ color: 'var(--ag-ink)' }}>{1 + (selected % 3)}</b></div>
              <div className="rounded-xl p-2.5 text-[11.5px]" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}>Open apps<b className="block text-[15px] font-medium" style={{ color: 'var(--ag-ink)' }}>{selected % 2 + 1}</b></div>
              <div className="rounded-xl p-2.5 text-[11.5px]" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}>Last visit<b className="block text-[15px] font-medium" style={{ color: 'var(--ag-ink)' }}>{10 + selected * 4} Oct</b></div>
              <div className="rounded-xl p-2.5 text-[11.5px]" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}>Status<b className="block text-[15px] font-medium"><StatusBadge text={f.verification_status} /></b></div>
            </div>
            <div className="py-2.5 border-b" style={{ borderColor: 'var(--ag-line)' }}>
              <b style={{ color: 'var(--ag-ink)' }}>Recent activity</b>
              <span className="block text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>Permit application · Disease report · Extension visit</span>
            </div>
            <div className="flex gap-2.5 mt-3.5">
              <Pill onClick={() => setVerification('verified')}>Approve</Pill>
              <Pill variant="light" onClick={() => setVerification('changes_requested')}>Request changes</Pill>
            </div>
          </AdminCard>
        )}
      </div>
    </>
  );
}