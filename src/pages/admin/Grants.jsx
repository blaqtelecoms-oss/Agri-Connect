import React from 'react';
import { useEntityList, AdminCard, Pill, MiniStat, PageHead, Bar, StatusBadge, adminToast } from './_admin';

export default function Grants() {
  const { items: programmes } = useEntityList('Programme', {}, '-created_date');
  const { items: grants } = useEntityList('GrantApplication', {}, '-created_date');

  return (
    <>
      <PageHead title="Grants & Programmes" sub="Budget, scoring and disbursement" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {programmes.map(p => (
          <AdminCard key={p.id} title={p.name}>
            <b className="block text-2xl font-light" style={{ color: 'var(--ag-ink)' }}>{p.budget}</b>
            <div className="mt-2"><Bar percent={p.committed_percent} /></div>
            <div className="text-[12px] mt-1.5" style={{ color: 'var(--ag-mut)' }}>{p.committed_percent}% committed · {p.window}</div>
          </AdminCard>
        ))}
      </div>
      <AdminCard title="Applications for scoring" right={<Pill onClick={() => adminToast('Panel review started')}>Start panel review</Pill>}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead><tr>{['Applicant', 'Programme', 'Score', 'Status', 'Milestone'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}</tr></thead>
            <tbody>
              {grants.map(g => (
                <tr key={g.id} className="hover:bg-black/5">
                  <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{g.applicant}</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{g.programme}</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{g.score}/100</td>
                  <td className="py-2.5 px-1.5"><StatusBadge text={g.status} /></td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{g.milestone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </>
  );
}