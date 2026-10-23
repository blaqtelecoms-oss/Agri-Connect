import React from 'react';
import { AdminCard, PageHead, Bar, adminToast } from './_admin';

const REPORTS = ['Registrations', 'Turnaround times', 'Permits issued', 'Disease incidents', 'Extension coverage', 'Grant spend'];
const AREAS = [['Vereeniging', 82], ['Vanderbijlpark', 68], ['Sebokeng', 57], ['Evaton', 44], ['De Deur', 31]];

export default function Reports() {
  return (
    <>
      <PageHead title="Reports & Analytics" sub="Export to Excel, PDF and CSV" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {REPORTS.map(r => (
          <AdminCard key={r} title={r}>
            <div className="text-[12px] mb-3.5" style={{ color: 'var(--ag-mut)' }}>Last run 15 Oct · scheduled weekly</div>
            <div className="flex gap-2">
              <button onClick={() => adminToast(`${r}.xlsx exported`)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>Excel</button>
              <button onClick={() => adminToast(`${r}.pdf exported`)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>PDF</button>
              <button onClick={() => adminToast(`${r}.csv exported`)} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>CSV</button>
            </div>
          </AdminCard>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5">
        <AdminCard title="Registrations by area">
          {AREAS.map(a => (
            <div key={a[0]} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
              <b className="w-[120px] flex-none font-normal text-[13px]" style={{ color: 'var(--ag-ink)' }}>{a[0]}</b>
              <Bar percent={a[1]} />
              <span className="text-[12.5px]">{a[1] * 14}</span>
            </div>
          ))}
        </AdminCard>
        <AdminCard title="Data quality">
          <b className="text-3xl font-light" style={{ color: 'var(--ag-ink)' }}>91%</b>
          <div className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>complete records</div>
          {['Missing GPS: 212', 'Outdated records: 340', 'Unverified entries: 38'].map(x => (
            <div key={x} className="py-2.5 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}><span className="text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{x}</span></div>
          ))}
        </AdminCard>
      </div>
    </>
  );
}