import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Mail, Building } from 'lucide-react';
import { clearSession, DEMO_OFFICIAL } from '@/lib/agriAuth';
import { AdminCard, PageHead } from './_admin';

const TOGGLES = [
  { k: 'email', label: 'Email digests' },
  { k: 'sla', label: 'SLA breach alerts' },
  { k: 'sms', label: 'SMS escalation notices' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({ email: true, sla: true, sms: false });

  const signOut = () => { clearSession(); navigate('/signin', { replace: true }); };

  return (
    <>
      <PageHead title="Profile & settings" sub="Your official account and alert preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        <AdminCard className="text-center">
          <div className="w-[80px] h-[80px] rounded-full mx-auto mb-3 grid place-items-center text-white font-semibold text-[26px]" style={{ background: 'linear-gradient(135deg,#2f6f5a,#e2471b)' }}>{DEMO_OFFICIAL.initials}</div>
          <b className="block text-[20px] font-medium tracking-tight" style={{ color: 'var(--ag-ink)' }}>{DEMO_OFFICIAL.name}</b>
          <div className="text-[12.5px] mt-0.5" style={{ color: 'var(--ag-mut)' }}>{DEMO_OFFICIAL.role}</div>
        </AdminCard>

        <AdminCard title="Account">
          <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'var(--ag-line)' }}>
            <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}><Mail className="w-5 h-5" /></span>
            <div><b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>Email</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{DEMO_OFFICIAL.email}</span></div>
          </div>
          <div className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: 'var(--ag-line)' }}>
            <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}><Building className="w-5 h-5" /></span>
            <div><b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>Municipality</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>Emfuleni Local Municipality · Agriculture</span></div>
          </div>
          <div className="flex items-center gap-3 py-2.5">
            <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ag-pn)', color: 'var(--ag-mut)' }}><ShieldCheck className="w-5 h-5" /></span>
            <div><b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>Role</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{DEMO_OFFICIAL.role}</span></div>
          </div>
        </AdminCard>

        <AdminCard title="Notifications">
          {TOGGLES.map(item => (
            <div key={item.k} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
              <b className="text-[13px]" style={{ color: 'var(--ag-ink)' }}>{item.label}</b>
              <button onClick={() => setToggles(t => ({ ...t, [item.k]: !t[item.k] }))} aria-label={item.label} className="w-[44px] h-6 rounded-full relative transition" style={{ background: toggles[item.k] ? 'var(--ag-gr)' : 'var(--ag-line)' }}>
                <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: toggles[item.k] ? '22px' : '3px' }} />
              </button>
            </div>
          ))}
        </AdminCard>

        <AdminCard title="Session">
          <div className="flex items-center justify-between gap-4 py-1.5">
            <span className="text-[12.5px]" style={{ color: 'var(--ag-mut)' }}>End your session on this device.</span>
            <button onClick={signOut} className="rounded-full px-5 py-3 font-semibold text-[14px] inline-flex items-center justify-center gap-2 whitespace-nowrap flex-none" style={{ background: '#b3261e', color: '#fff' }}>
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
