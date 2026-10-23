import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Droplet, Bell, TriangleAlert, FileText, LifeBuoy, Leaf, Clock, Calendar, Shield, ArrowUpRight, Phone, MapPin } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { HERO_FARMER } from '@/lib/agriAssets';
import { qrSvgFromToken } from '@/lib/agriAssets';
import { FARMER_NAME, FARMER_ID, useFarmerApplications, Chip, FarmerCard, PageWrap, PageHeader, initials, useToastBus, DCard, DSectionHead, DLink, DChip, DIconTile, Sparkline, Progress } from './_shared';

const FARMS = {
  a: { n: 'De Deur Smallholding', ha: '12.4 ha', t: 'Leased', w: 'Borehole', c: [['Maize (summer)', '6 ha · Planted Oct', 'leaf'], ['Spinach', '2 ha · Harvest Nov', 'leaf'], ['Nguni cattle', '18 head · Tagged', 'pin'], ['Goats', '24 head · Vaccinated', 'pin']] },
  b: { n: 'Walkerville Plot 14', ha: '4.8 ha', t: 'Owned', w: 'Municipal', c: [['Cabbage', '2 ha · Harvest Dec', 'leaf'], ['Tomatoes', '1.5 ha · Tunnel', 'leaf'], ['Layer hens', '350 birds', 'pin']] },
};
const LeafI = Leaf; // alias for commodity rows

function FarmMap() {
  return (
    <div className="rounded-[18px] overflow-hidden" style={{ background: '#dbe6d2' }}>
      <svg viewBox="0 0 640 300" className="w-full block">
        <rect width="640" height="300" fill="#dbe6d2" />
        <path d="M0 245C140 210 300 270 640 215V300H0z" fill="#a9cfe4" />
        <path d="M0 40C200 70 420 20 640 60" stroke="#fff" strokeWidth="9" fill="none" />
        <path d="M90 60L330 40 470 100 440 220 190 240 70 160z" fill="#ffffff59" stroke="#1d5c45" strokeWidth="3" strokeDasharray="8 6" />
        <path d="M104 66L240 54 250 150 110 154z" fill="#58a06f" />
        <path d="M250 52L330 46 400 90 390 160 252 152z" fill="#c9b24b" />
        <path d="M110 160L250 158 380 166 430 214 190 232 80 170z" fill="#8fbf7a" />
        <g fill="#fff" fontSize="12" fontWeight="700" fontFamily="Plus Jakarta Sans">
          <text x="130" y="112">Maize · 6 ha</text>
          <text x="276" y="106">Spinach · 2 ha</text>
          <text x="190" y="202">Grazing · 4.4 ha</text>
        </g>
        <circle cx="410" cy="120" r="14" fill="#1a63a8" fillOpacity="0.25" />
        <circle cx="410" cy="120" r="6" fill="#1a63a8" stroke="#fff" strokeWidth="2" />
      </svg>
    </div>
  );
}

export default function FarmerHome() {
  const navigate = useNavigate();
  const { items: apps } = useFarmerApplications();
  const [toast] = useToastBus();
  const [farmKey, setFarmKey] = useState('a');

  const openApps = apps.filter(a => !['approved', 'issued', 'rejected'].includes(a.status));
  const needsInfo = apps.filter(a => a.status === 'more_info_required').length;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = FARMER_NAME.split(' ')[0];
  const statusLine = openApps.length
    ? `${openApps.length} ${openApps.length === 1 ? 'application is' : 'applications are'} in progress and an extension visit is confirmed for Tuesday.`
    : 'Your farms are in good shape today. No open applications right now.';

  const inReview = apps.find(a => a.status === 'in_review' || a.status === 'more_info_required') || apps[0];

  return (
    <>
      {/* ============================ MOBILE ============================ */}
      <div className="lg:hidden">
        <PageWrap>
          {toast && (
            <div className="fixed left-1/2 top-4 -translate-x-1/2 z-[60] rounded-full px-4 py-2.5 text-[12.5px] text-white whitespace-nowrap" style={{ background: 'var(--ag-ink)' }}>{toast}</div>
          )}

          <div className="-mx-4 px-4 pt-5 pb-7 text-white lg:hidden"
            style={{ background: `linear-gradient(120deg, rgba(10,58,42,0.92), rgba(10,58,42,0.55) 55%, rgba(26,99,168,0.35)), url(${HERO_FARMER}) center/cover` }}>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/app/profile')} className="w-[46px] h-[46px] rounded-full bg-white font-bold grid place-items-center border-2 border-white" style={{ color: 'var(--ag-g)' }}>{initials(FARMER_NAME)}</button>
              <div>
                <span className="text-[11px] opacity-90">Welcome back</span>
                <b className="block text-[16px]">{FARMER_NAME}</b>
              </div>
              <button onClick={() => navigate('/app/inbox')} className="ml-auto w-11 h-11 rounded-full bg-white grid place-items-center relative" style={{ color: 'var(--ag-g)' }}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-3 w-2 h-2 rounded-full" style={{ background: 'var(--ag-r)' }} />
              </button>
            </div>
            <span className="inline-block mt-3.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/95" style={{ color: '#15693f' }}>✔ Verified Farmer · {FARMER_ID}</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 -mt-6">
            {[{ bg: '#d9f0fb', icon: Sun, l: 'Weather', v: 'Sunny · 27°C' }, { bg: '#dff3e0', icon: Droplet, l: 'Soil moisture', v: 'Adequate' }, { bg: '#fdf0c4', icon: Bell, l: 'Alerts', v: '2 active' }].map(t => {
              const I = t.icon;
              return <div key={t.l} className="rounded-[18px] p-2.5 text-[11px] shadow-sm" style={{ background: t.bg, color: '#1b3a2c' }}><I className="w-5 h-5 mb-1" />{t.l}<b className="block text-[13px]">{t.v}</b></div>;
            })}
          </div>

          <h2 className="text-[17px] font-semibold mt-5">Quick actions</h2>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-medium mt-2">
            {[{ i: TriangleAlert, l: 'Report a problem', p: '/app/report' }, { i: FileText, l: 'Apply for permit', p: '/app/services' }, { i: LifeBuoy, l: 'Request support', p: '/app/inbox' }, { i: Leaf, l: 'View my farm', p: '/app/farms' }].map(q => {
              const I = q.i;
              return <button key={q.l} onClick={() => navigate(q.p)} className="flex flex-col items-center gap-1.5"><span className="w-14 h-14 rounded-[20px] grid place-items-center shadow-sm" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-g)' }}><I className="w-6 h-6" /></span>{q.l}</button>;
            })}
          </div>

          <h2 className="text-[17px] font-semibold mt-5">At a glance</h2>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 mt-2 pb-1">
            {[{ l: 'Open applications', v: openApps.length, chip: needsInfo > 0 ? `${needsInfo} needs info` : null }, { l: 'Next deadline', v: '31 Oct', chip: 'Vaccination', chipVar: 'c-y' }, { l: 'Extension visit', v: 'Tue 20', chip: 'Confirmed', chipVar: 'c-g' }].map(g => (
              <FarmerCard key={g.l} className="flex-none w-[150px]">
                <span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{g.l}</span>
                <b className="block text-2xl mt-0.5" style={{ color: 'var(--ag-ink)' }}>{g.value}</b>
                {g.chip && <Chip text={g.chip} variant={g.chipVar || 'c-b'} />}
              </FarmerCard>
            ))}
          </div>

          <div className="mt-5">
            <h2 className="text-[17px] font-semibold flex items-center justify-between">Alerts for your area <button onClick={() => navigate('/app/inbox')} className="text-[12px] font-medium" style={{ color: 'var(--ag-b)' }}>See all</button></h2>
            <FarmerCard className="mt-2">
              {[{ i: TriangleAlert, t: 'Foot-and-mouth vigilance', s: 'Control zone near Vereeniging · 2h ago', c: 'High', v: 'c-r' }, { i: FileText, t: 'Emerging Farmer Support Grant', s: 'Window opens 3 Nov · You are eligible', c: 'Grant', v: 'c-g' }, { i: Leaf, t: 'Fall armyworm warning', s: 'Maize fields in your ward · Yesterday', c: 'Pest', v: 'c-y' }].map((a, i) => {
                const I = a.i;
                return <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}><span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><I className="w-5 h-5" /></span><div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{a.t}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{a.s}</span></div><Chip text={a.c} variant={a.v} /></div>;
              })}
            </FarmerCard>
          </div>

          <div className="mt-5">
            <h2 className="text-[17px] font-semibold flex items-center justify-between">My applications <button onClick={() => navigate('/app/services')} className="text-[12px] font-medium" style={{ color: 'var(--ag-b)' }}>Track</button></h2>
            <FarmerCard className="mt-2">
              {apps.length === 0 && <div className="py-4 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>No applications yet.</div>}
              {apps.map(a => (
                <div key={a.id} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                  <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><FileText className="w-5 h-5" /></span>
                  <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{a.service_type}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{a.reference}</span></div>
                  <Chip text={a.status.replace(/_/g, ' ')} />
                </div>
              ))}
            </FarmerCard>
          </div>
        </PageWrap>
      </div>

      {/* ============================ DESKTOP ============================ */}
      <div className="hidden lg:block">
        {toast && (
          <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-[80] rounded-full px-5 py-2.5 text-[13px] text-white whitespace-nowrap font-jk" style={{ background: '#10211a' }}>{toast}</div>
        )}

        {/* Hero */}
        <div className="relative rounded-[28px] text-white flex justify-between gap-6 overflow-hidden"
          style={{ minHeight: 230, padding: '34px 38px', background: 'linear-gradient(100deg,rgba(8,37,25,0.95),rgba(14,59,44,0.7) 55%,rgba(14,59,44,0.3)), url(' + HERO_FARMER + ') center/cover #0e3b2c', boxShadow: 'var(--ac-sh)' }}>
          <div className="pointer-events-none absolute right-[-80px] top-[-120px] w-[360px] h-[360px] rounded-full" style={{ border: '1px solid #ffffff1f', boxShadow: '0 0 0 50px #ffffff06, 0 0 0 100px #ffffff04' }} />
          <div className="relative z-10 max-w-[520px]">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold font-jk"
              style={{ background: '#ffffff1f', border: '1px solid #ffffff2e', backdropFilter: 'blur(8px)' }}>✓ Verified Farmer · {FARMER_ID}</span>
            <h2 className="font-fraunces mt-2.5" style={{ fontSize: 38, fontWeight: 500, letterSpacing: '-0.8px', lineHeight: 1.1 }}>{greeting}, {firstName}</h2>
            <p className="mt-2 max-w-[470px] text-[14px]" style={{ color: '#d3e8dc' }}>{statusLine}</p>
            <div className="flex gap-2.5 mt-5.5">
              <button onClick={() => navigate('/app/report')} className="rounded-full px-5 py-2.5 font-bold text-[13px] font-jk flex items-center gap-2" style={{ background: 'linear-gradient(135deg,#dcb85e,#b98d2c)', color: '#2b2108' }}>
                <TriangleAlert className="w-[18px] h-[18px]" /> Report a problem
              </button>
              <button onClick={() => navigate('/app/services')} className="rounded-full px-5 py-2.5 font-semibold text-[13px] font-jk" style={{ background: '#ffffff1f', border: '1px solid #ffffff38', backdropFilter: 'blur(8px)' }}>Apply for a permit</button>
            </div>
          </div>

          {/* weather */}
          <div className="relative z-10 self-end rounded-[22px] px-5 py-4 min-w-[260px]" style={{ background: '#ffffff1c', border: '1px solid #ffffff30', backdropFilter: 'blur(16px)' }}>
            <div className="flex justify-between items-center">
              <span className="text-[12px] font-jk" style={{ color: '#d3e8dc' }}>Vereeniging today</span>
              <Sun className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <b className="font-fraunces" style={{ fontSize: 42, fontWeight: 500 }}>27°C</b>
              <span className="text-[13px]">Sunny</span>
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3 text-[11.5px] font-jk" style={{ color: '#d3e8dc' }}>
              {[['Wind', '12 km/h'], ['Humidity', '38%'], ['Rain', '10%'], ['Soil', 'Adequate']].map(r => (
                <div key={r[0]}>{r[0]}<span className="block font-bold text-white text-[13px]">{r[1]}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 mt-5" style={{ gap: 18 }}>
          {[
            { icon: FileText, sp: [1, 2, 2, 3, 2, 1], c: '#1f7a57', label: 'Open applications', val: openApps.length, chip: needsInfo > 0 ? `${needsInfo} needs info` : null, chipVar: 'c-b' },
            { icon: Clock, sp: [2, 3, 4, 6, 7, 9], c: '#c9a24b', label: 'Next deadline', val: '31 Oct', chip: 'FMD vaccination', chipVar: 'c-y' },
            { icon: Calendar, sp: null, c: null, label: 'Extension visit', val: 'Tue 20 Oct', chip: 'Confirmed', chipVar: 'c-g' },
            { icon: Shield, sp: null, c: null, label: 'Profile completeness', val: '85%', bar: 85 },
          ].map(k => {
            const I = k.icon;
            return (
              <DCard key={k.label}>
                <div className="flex justify-between">
                  <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><I className="w-5 h-5" /></span>
                  {k.sp && <Sparkline data={k.sp} color={k.c} />}
                </div>
                <span className="block text-[12px] mt-3.5 font-jk" style={{ color: 'var(--ac-mu)' }}>{k.label}</span>
                <b className="font-fraunces block" style={{ fontSize: 30, fontWeight: 500, letterSpacing: '-0.5px' }}>{k.val}</b>
                {k.chip && <div className="mt-1.5"><DChip text={k.chip} variant={k.chipVar} /></div>}
                {k.bar != null && <div className="mt-3"><Progress value={k.bar} /></div>}
              </DCard>
            );
          })}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-4 mt-5" style={{ gap: 18 }}>
          {[
            { i: TriangleAlert, t: 'Report a problem', d: 'Disease, pests, theft, disaster', p: '/app/report', from: '#1f7a57', to: '#0e3b2c' },
            { i: FileText, t: 'Apply for a permit', d: 'Movement, health, export', p: '/app/services', from: '#6db8f0', to: '#1a63a8' },
            { i: LifeBuoy, t: 'Request support', d: 'Book an extension visit', act: 'support', from: '#f3cd6a', to: '#b98d2c' },
            { i: Leaf, t: 'View my farms', d: 'Maps, crops and livestock', p: '/app/farms', from: '#a6dc6a', to: '#3f9a3a' },
          ].map(q => {
            const I = q.i;
            return (
              <button key={q.t} onClick={() => q.act ? requestSupport() : navigate(q.p)}
                className="ac-qa text-left rounded-[22px] p-5 relative"
                style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', boxShadow: 'var(--ac-sh)' }}>
                <DIconTile from={q.from} to={q.to} size={48} r={16} className="mb-3.5"><I className="w-6 h-6" /></DIconTile>
                <b className="block text-[14.5px] font-jk" style={{ color: 'var(--ac-ink)' }}>{q.t}</b>
                <span className="text-[12px] font-jk" style={{ color: 'var(--ac-mu)' }}>{q.d}</span>
                <ArrowUpRight className="w-4 h-4 absolute right-4 top-5" style={{ color: 'var(--ac-mu)' }} />
              </button>
            );
          })}
        </div>

        {/* Two column grid */}
        <div className="grid mt-7" style={{ gridTemplateColumns: '1.65fr 1fr', gap: 20 }}>
          <div className="flex flex-col gap-5 min-w-0">
            {/* My farm */}
            <DCard>
              <DSectionHead title="My farm" right={<DLink onClick={() => navigate('/app/farms')}>Open farm profile →</DLink>} />
              <div className="flex gap-2 mb-3.5">
                {Object.entries(FARMS).map(([k, x]) => (
                  <button key={k} onClick={() => setFarmKey(k)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold font-jk"
                    style={k === farmKey ? { background: 'var(--ac-gd)', color: '#fff' } : { background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-ink)' }}>{x.n}</button>
                ))}
              </div>
              <FarmMap />
              <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                {[['Size', FARMS[farmKey].ha], ['Tenure', FARMS[farmKey].t], ['Water', FARMS[farmKey].w], ['Status', 'Verified']].map(x => (
                  <div key={x[0]} className="rounded-[14px] px-3 py-2.5 text-[11.5px] font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-mu)' }}>{x[0]}<b className="block text-[14px]" style={{ color: x[0] === 'Status' ? 'var(--ac-g)' : 'var(--ac-ink)' }}>{x[1]}</b></div>
                ))}
              </div>
            </DCard>

            {/* Applications */}
            <DCard>
              <DSectionHead title="My applications" right={<DLink onClick={() => navigate('/app/services')}>Track all →</DLink>} />
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Service', 'Status', 'Progress', 'Due'].map(h => <th key={h} className="text-left text-[11.5px] font-semibold font-jk pb-2.5 px-2" style={{ color: 'var(--ac-mu)', borderBottom: '1px solid var(--ac-ln)' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {apps.length === 0 && (
                    <tr><td colSpan={4} className="py-6 text-center text-[13px] font-jk" style={{ color: 'var(--ac-mu)' }}>No applications yet.</td></tr>
                  )}
                  {apps.map(a => (
                    <tr key={a.id}>
                      <td className="py-3 px-2 text-[13px] font-jk" style={{ borderBottom: '1px solid var(--ac-ln)' }}>
                        <b style={{ color: 'var(--ac-ink)' }}>{a.service_type}</b>
                        <div className="text-[11.5px]" style={{ color: 'var(--ac-mu)' }}>{a.reference}</div>
                      </td>
                      <td className="py-3 px-2" style={{ borderBottom: '1px solid var(--ac-ln)' }}><DChip text={a.status.replace(/_/g, ' ')} variant={chipVar(a.status)} /></td>
                      <td className="py-3 px-2" style={{ borderBottom: '1px solid var(--ac-ln)' }}><Progress value={a.progress || 0} /></td>
                      <td className="py-3 px-2 text-[13px] font-jk" style={{ borderBottom: '1px solid var(--ac-ln)', color: 'var(--ac-ink)' }}>{a.due_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DCard>

            {/* Rainfall */}
            <DCard>
              <DSectionHead title="Rainfall this week" right={<span className="text-[12.5px] font-semibold font-jk" style={{ color: 'var(--ac-g)' }}>Total 24 mm</span>} />
              <div className="flex items-end gap-3 h-[130px] mt-1.5">
                {[['Mon', 4], ['Tue', 0], ['Wed', 9], ['Thu', 2], ['Fri', 0], ['Sat', 7], ['Sun', 2]].map(r => (
                  <div key={r[0]} className="flex-1 text-center text-[11px] font-jk" style={{ color: 'var(--ac-mu)' }}>
                    <i className="block rounded-t-lg mb-1.5" style={{ height: Math.max(6, r[1] * 11), background: 'linear-gradient(180deg,#5aa9e6,#1a63a8)' }} />
                    {r[0]}
                  </div>
                ))}
              </div>
            </DCard>
          </div>

          <div className="flex flex-col gap-5 min-w-0">
            {/* Alerts */}
            <DCard>
              <DSectionHead title="Alerts for your area" right={<DLink onClick={() => navigate('/app/inbox')}>See all</DLink>} />
              {[
                { i: TriangleAlert, t: 'Foot-and-mouth vigilance', s: 'Control zone near Vereeniging · 2h ago', c: 'High', v: 'c-r', from: '#f0a79f', to: '#c0392b' },
                { i: FileText, t: 'Emerging Farmer Support Grant', s: 'Window opens 3 Nov · You are eligible', c: 'Grant', v: 'c-g', from: '#6ee0a8', to: '#1f7a57' },
                { i: Leaf, t: 'Fall armyworm warning', s: 'Maize fields in your ward · Yesterday', c: 'Pest', v: 'c-y', from: '#f0cf6a', to: '#b98d2c' },
              ].map((a, i) => (
                <div key={i} className="flex gap-3 items-center py-3 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
                  <DIconTile from={a.from} to={a.to} size={40} r={13}><a.i className="w-[18px] h-[18px]" /></DIconTile>
                  <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>{a.t}</b><span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{a.s}</span></div>
                  <DChip text={a.c} variant={a.v} />
                </div>
              ))}
            </DCard>

            {/* Extension officer */}
            <DCard>
              <DSectionHead title="Your extension officer" />
              <div className="flex items-center gap-3">
                <span className="w-12 h-12 rounded-full grid place-items-center font-bold text-white flex-none font-jk" style={{ background: 'linear-gradient(135deg,#c9a24b,#8a6a1d)' }}>ND</span>
                <div className="flex-1 min-w-0"><b className="block text-[13.5px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>Nomvula Dlamini</b><span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>Ward 12 · Next visit Tue 20 Oct, 10:00</span></div>
                <button aria-label="Call officer" className="w-10 h-10 rounded-full grid place-items-center" style={{ background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)' }}><Phone className="w-[18px] h-[18px]" style={{ color: 'var(--ac-ink)' }} /></button>
              </div>
            </DCard>

            {/* Certificate */}
            <DCard className="relative overflow-hidden" style={{ border: 0, background: 'radial-gradient(100% 120% at 100% 0, #c9a24b55, transparent 55%), linear-gradient(135deg,#0b3326,#14507c)' }}>
              <span className="text-[11px] tracking-[1.4px] opacity-80 font-jk">DIGITAL CERTIFICATE</span>
              <div className="flex gap-4 items-center mt-3">
                <div className="w-[84px] h-[84px] bg-white rounded-xl p-1.5 flex-none" dangerouslySetInnerHTML={{ __html: qrSvgFromToken(FARMER_ID) }} />
                <div className="text-white">
                  <b className="font-fraunces block" style={{ fontSize: 20, fontWeight: 500 }}>Registered Farmer</b>
                  <div className="text-[12px] opacity-85 font-jk mt-0.5">{FARMER_NAME}<br />{FARMER_ID} · Valid to Oct 2027</div>
                </div>
              </div>
            </DCard>

            {/* Forecast */}
            <DCard>
              <DSectionHead title="5-day forecast" />
              <div className="flex justify-between text-center text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>
                {[['Sun', '27°', '☀️'], ['Mon', '25°', '⛅'], ['Tue', '22°', '🌧️'], ['Wed', '24°', '⛅'], ['Thu', '28°', '☀️']].map(f => (
                  <div key={f[0]}>{f[0]}<b className="block text-[18px] my-1">{f[2]}</b><b className="block font-bold text-[13px]" style={{ color: 'var(--ac-ink)' }}>{f[1]}</b></div>
                ))}
              </div>
            </DCard>
          </div>
        </div>
      </div>
    </>
  );
}

function chipVar(status) {
  const s = String(status || '').toLowerCase();
  if (/review|progress|open|needs|more/.test(s)) return 'c-y';
  if (/approved|verified|complete|valid|active|issued/.test(s)) return 'c-g';
  if (/reject|changes|breach|critical|high/.test(s)) return 'c-r';
  return 'c-b';
}

async function requestSupport() {
  try {
    await base44.entities.SupportRequest.create({
      topic: 'Call-back request',
      urgency: 'medium',
      preferred_time: 'As soon as possible',
      farmer_id: FARMER_ID,
      farmer_name: FARMER_NAME,
      area: 'De Deur',
      status: 'requested',
    });
  } catch { /* show toast anyway */ }
  const { showToast } = await import('./_shared');
  showToast('Support request sent to your extension officer');
}