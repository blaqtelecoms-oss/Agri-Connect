import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, LogOut } from 'lucide-react';
import { clearSession, DEMO_FARMER } from '@/lib/agriAuth';
import { FarmerCard, PageWrap, PageHeader, initials, DCard, DSectionHead } from './_shared';
import CertificateCard from './CertificateCard';

const TOGGLES = [
  { k: 'push', label: 'Push notifications' },
  { k: 'sms', label: 'SMS alerts' },
  { k: 'whatsapp', label: 'WhatsApp updates' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [toggles, setToggles] = useState({ push: true, sms: true, whatsapp: false });

  const signOut = () => { clearSession(); navigate('/signin'); };

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <PageWrap>
          <PageHeader title="Profile & settings"
            actions={<button onClick={() => navigate('/app/home')} className="w-10 h-10 rounded-full grid place-items-center shadow-sm border" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-g)', borderColor: 'var(--ag-line)' }}><ArrowLeft className="w-5 h-5" /></button>}
          />
          <FarmerCard className="mt-4 text-center">
            <div className="w-[70px] h-[70px] rounded-full mx-auto mb-2 grid place-items-center text-[22px] font-bold" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}>{initials(DEMO_FARMER.name)}</div>
            <b style={{ color: 'var(--ag-ink)' }}>{DEMO_FARMER.name}</b>
            <div className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{DEMO_FARMER.farmer_id} · Smallholder farmer · {DEMO_FARMER.area}</div>
          </FarmerCard>
          <h2 className="text-[17px] font-semibold mt-5">Digital certificate</h2>
          <div className="mt-2"><CertificateCard /></div>
          <h2 className="text-[17px] font-semibold mt-5">Notifications</h2>
          <FarmerCard className="mt-2">
            {TOGGLES.map(item => (
              <div key={item.k} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                <b className="text-[13px]" style={{ color: 'var(--ag-ink)' }}>{item.label}</b>
                <button onClick={() => setToggles(t => ({ ...t, [item.k]: !t[item.k] }))} className="w-[42px] h-6 rounded-full relative transition" style={{ background: toggles[item.k] ? 'var(--ag-g)' : 'var(--ag-line)' }}>
                  <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: toggles[item.k] ? '21px' : '3px' }} />
                </button>
              </div>
            ))}
          </FarmerCard>
          <h2 className="text-[17px] font-semibold mt-5">Privacy</h2>
          <FarmerCard className="mt-2">
            <div className="flex items-center gap-3 py-3">
              <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><ShieldCheck className="w-5 h-5" /></span>
              <div><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>POPIA data controls</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>Download or correct your data</span></div>
            </div>
          </FarmerCard>
          <button onClick={signOut} className="w-full mt-5 rounded-full py-3.5 font-semibold" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}>Sign out</button>
        </PageWrap>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="flex flex-col gap-5 min-w-0">
            <DCard className="text-center">
              <div className="w-[80px] h-[80px] rounded-full mx-auto mb-3 grid place-items-center text-[26px] font-bold font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}>{initials(DEMO_FARMER.name)}</div>
              <b className="font-fraunces block" style={{ fontSize: 20, fontWeight: 500, color: 'var(--ac-ink)' }}>{DEMO_FARMER.name}</b>
              <div className="text-[12.5px] font-jk mt-0.5" style={{ color: 'var(--ac-mu)' }}>{DEMO_FARMER.farmer_id} · Smallholder farmer · {DEMO_FARMER.area}</div>
            </DCard>

            <DCard>
              <DSectionHead title="Notifications" />
              {TOGGLES.map(item => (
                <div key={item.k} className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
                  <b className="text-[13px] font-jk" style={{ color: 'var(--ac-ink)' }}>{item.label}</b>
                  <button onClick={() => setToggles(t => ({ ...t, [item.k]: !t[item.k] }))} className="w-[44px] h-6 rounded-full relative transition" style={{ background: toggles[item.k] ? 'var(--ac-g)' : 'var(--ac-ln)' }}>
                    <span className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all" style={{ left: toggles[item.k] ? '22px' : '3px' }} />
                  </button>
                </div>
              ))}
            </DCard>
          </div>

          <div className="flex flex-col gap-5 min-w-0">
            <CertificateCard desktop />
            <DCard>
              <DSectionHead title="Privacy" />
              <div className="flex items-center gap-3 py-2">
                <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><ShieldCheck className="w-5 h-5" /></span>
                <div><b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>POPIA data controls</b><span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>Download or correct your data</span></div>
              </div>
            </DCard>
            <button onClick={signOut} className="rounded-full px-5 py-3.5 font-semibold font-jk inline-flex items-center justify-center gap-2 self-start" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><LogOut className="w-4 h-4" /> Sign out</button>
          </div>
        </div>
      </div>
    </>
  );
}