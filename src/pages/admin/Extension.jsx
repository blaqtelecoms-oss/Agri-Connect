import React from 'react';
import { useEntityList, AdminCard, Pill, MiniStat, PageHead, Bar, adminToast, StatusBadge } from './_admin';

const ROSTER = [
  { name: 'N. Dlamini', wards: 'Ward 12, 14', visits: 42, cov: 82 },
  { name: 'S. Mokoena', wards: 'Ward 3, 5, 9', visits: 38, cov: 71 },
  { name: 'T. Pretorius', wards: 'Ward 20, 21', visits: 29, cov: 55 },
  { name: 'B. Khumalo', wards: 'Ward 7', visits: 51, cov: 88 },
  { name: 'L. Mahlangu', wards: 'Ward 30, 31', visits: 18, cov: 34 },
];
const GAPS = [
  ['Ward 30 · Sebokeng', '41 farms unvisited >90 days'],
  ['Ward 20 · Walkerville', '27 farms unvisited >60 days'],
  ['Ward 9 · Evaton', '19 farms · high need'],
];

export default function Extension() {
  const { items: training } = useEntityList('TrainingEvent', {}, '-created_date');
  return (
    <>
      <PageHead title="Extension & Field Operations" sub="Officer roster · coverage analysis" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MiniStat label="Active officers" value="24" />
        <MiniStat label="Visits this month" value="486" />
        <MiniStat label="Farmers reached" value="63%" note="Target 80%" />
        <MiniStat label="Farms not visited 90d+" value="212" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1">
        <AdminCard title="Officer roster" right={<Pill onClick={() => adminToast('Visit scheduled')}>Schedule visit</Pill>}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>{['Officer', 'Wards', 'Visits', 'Coverage'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {ROSTER.map(o => (
                  <tr key={o.name} className="hover:bg-black/5">
                    <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{o.name}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{o.wards}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{o.visits}</td>
                    <td className="py-2.5 px-1.5"><Bar percent={o.cov} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
        <AdminCard title="Coverage gaps">
          {GAPS.map(g => (
            <div key={g[0]} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'var(--ag-line)' }}>
              <i className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: '#e2471b' }} />
              <div className="flex-1 min-w-0"><b className="block text-[13px] font-medium" style={{ color: 'var(--ag-ink)' }}>{g[0]}</b><span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{g[1]}</span></div>
              <button onClick={() => adminToast('Officer assigned')} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>Assign</button>
            </div>
          ))}
          {training[0] && (
            <div className="flex items-center gap-3 py-2.5">
              <div className="flex-1"><b className="text-[13px] font-medium block" style={{ color: 'var(--ag-ink)' }}>Workshop: {training[0].topic}</b><span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{training[0].date} · {training[0].attendees} registered</span></div>
              <StatusBadge text={training[0].status} />
            </div>
          )}
        </AdminCard>
      </div>
    </>
  );
}