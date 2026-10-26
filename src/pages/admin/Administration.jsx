import React from 'react';
import { useEntityList, AdminCard, Pill, PageHead, StatusBadge, adminToast } from './_admin';

const USERS = [
  { name: 'Nomsa Mahlangu', role: 'Municipal manager', scope: 'Emfuleni', status: 'Active' },
  { name: 'Dr. P. Naidoo', role: 'State vet', scope: 'Sebokeng', status: 'Active' },
  { name: 'N. Dlamini', role: 'Extension officer', scope: 'Ward 12, 14', status: 'Active' },
  { name: 'A. Jacobs', role: 'Grants officer', scope: 'Municipal', status: 'Active' },
  { name: 'K. Sithole', role: 'Helpdesk agent', scope: 'Municipal', status: 'Pending' },
];
const SETTINGS = [
  ['Permit SLA', '5 working days'],
  ['Auto-escalate on breach', 'Enabled'],
  ['Data retention', '7 years (POPIA)'],
];
const AREAS = [['Vereeniging', 82], ['Vanderbijlpark', 68], ['Sebokeng', 57]];

export default function Administration() {
  const { items: audit } = useEntityList('AuditLog', {}, '-created_date');
  return (
    <>
      <PageHead title="Administration & Configuration" sub="Users, roles, audit trail and settings" />
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5">
        <AdminCard title="Users & roles" right={<Pill onClick={() => adminToast('Invite sent')}>Add user</Pill>}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>{['Name', 'Role', 'Scope', 'Status'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5 px-1.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}</tr></thead>
              <tbody>
                {USERS.map(u => (
                  <tr key={u.name} className="hover:bg-black/5">
                    <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{u.name}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{u.role}</td>
                    <td className="py-2.5 px-1.5 text-[12.5px]">{u.scope}</td>
                    <td className="py-2.5 px-1.5"><StatusBadge text={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
        <AdminCard title="Audit trail">
          {audit.map(a => (
            <div key={a.id} className="py-2.5 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
              <b className="block text-[13px] font-medium" style={{ color: 'var(--ag-ink)' }}>{a.action}</b>
              <span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{a.actor} · {a.timestamp}</span>
            </div>
          ))}
        </AdminCard>
      </div>
      <AdminCard title="System settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {SETTINGS.map(s => (
            <div key={s[0]} className="py-2.5">
              <b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>{s[0]}</b>
              <span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{s[1]}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </>
  );
}