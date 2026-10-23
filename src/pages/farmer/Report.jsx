import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, Leaf, Lock, Cloud, Camera, MapPin, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { FARMER_NAME, FARMER_ID, PageWrap, PageHeader, showToast, DCard, DSectionHead } from './_shared';

const TYPES = [
  { id: 'animal_disease', icon: Bug, title: 'Animal disease', sub: 'Livestock symptoms' },
  { id: 'plant_pest', icon: Leaf, title: 'Plant pest', sub: 'Crop damage' },
  { id: 'stock_theft', icon: Lock, title: 'Stock theft', sub: 'Referred to SAPS' },
  { id: 'disaster', icon: Cloud, title: 'Disaster damage', sub: 'Drought, flood, hail' },
];

const ADVICE = {
  animal_disease: 'Isolate affected animals and avoid moving livestock. Your nearest state vet has been notified.',
  plant_pest: 'Scout fields early morning. Your nearest plant health inspector has been notified.',
  stock_theft: 'Report to SAPS immediately and secure remaining stock. Helpdesk will follow up.',
  disaster: 'Document damage with photos. An extension officer will contact you for assessment.',
};

const NEXT_STEPS = [
  { t: 'You get a reference number instantly', st: 'done' },
  { t: 'Advice on what to do while you wait', st: 'done' },
  { t: 'Nearest state vet or inspector is assigned', st: 'cur' },
  { t: 'Visit scheduled and outcome shared with you', st: '' },
];

export default function Report() {
  const navigate = useNavigate();
  const [type, setType] = useState('animal_disease');
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('');
  const [gps, setGps] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);

  const useLocation = () => {
    const lat = -26.6741, lng = 27.9318;
    setGps(`${lat}, ${lng}`);
    showToast('GPS pinned: ' + lat + ', ' + lng);
  };

  const submit = async () => {
    if (!desc) { showToast('Please describe what you are seeing'); return; }
    setSubmitting(true);
    try {
      const ref = 'RPT-2026-' + String(Math.floor(1000 + Math.random() * 8999)).padStart(6, '0');
      const officer = type === 'animal_disease' ? 'Dr. P. Naidoo' : type === 'plant_pest' ? 'Insp. S. Zulu' : 'SAPS referral';
      await base44.entities.Incident.create({
        reference: ref, type, title: TYPES.find(t => t.id === type).title, description: desc, farmer_id: FARMER_ID, farmer_name: FARMER_NAME,
        area: 'De Deur', lat: -26.6741, lng: 27.9318, quantity_affected: qty || 'Not specified',
        severity: type === 'animal_disease' ? 'critical' : 'warning', status: 'submitted', assigned_officer: officer, advice: ADVICE[type],
      });
      await base44.entities.NotificationItem.create({
        farmer_id: FARMER_ID, title: 'Report received', body: `${TYPES.find(t => t.id === type).title} reported (${ref}). ${officer} has been notified.`, type: 'alert', channel: 'push',
      });
      setSuccess({ ref, advice: ADVICE[type] });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <>
        {/* mobile modal */}
        <div className="lg:hidden absolute inset-0 bg-black/60 z-50 flex items-end">
          <div className="w-full rounded-t-[30px] p-6 text-center" style={{ background: 'var(--ag-card, #fff)' }}>
            <CheckCircle2 className="w-14 h-14 mx-auto mb-2.5 rounded-full p-2" style={{ background: '#d9f0e3', color: 'var(--ag-g)' }} />
            <h3 className="text-lg font-semibold">Report received</h3>
            <p className="text-[13px] mt-1" style={{ color: 'var(--ag-mut)' }}>Reference <b style={{ color: 'var(--ag-ink)' }}>{success.ref}</b></p>
            <div className="rounded-[20px] p-3.5 my-3.5 text-left text-[12.5px]" style={{ background: 'var(--ag-gl)' }}><b>While you wait:</b> {success.advice}</div>
            <button onClick={() => { setSuccess(null); navigate('/app/home'); }} className="w-full rounded-full py-3.5 font-semibold text-white" style={{ background: 'var(--ag-g)' }}>Done</button>
          </div>
        </div>
        {/* desktop modal */}
        <div className="hidden lg:fixed lg:inset-0 lg:z-50 lg:grid lg:place-items-center" style={{ background: '#0008', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-[28px] p-[34px] w-[420px] text-center" style={{ background: 'var(--ac-cd)' }}>
            <div className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-3" style={{ background: '#d9f0e3', color: '#15693f' }}><CheckCircle2 className="w-8 h-8" /></div>
            <h3 className="font-fraunces" style={{ fontSize: 24, fontWeight: 500, color: 'var(--ac-ink)' }}>Report received</h3>
            <p className="text-[13px] mt-1.5 font-jk" style={{ color: 'var(--ac-mu)' }}>Reference <b style={{ color: 'var(--ac-ink)' }}>{success.ref}</b></p>
            <div className="rounded-[22px] p-3.5 my-4 text-left text-[12.5px] font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-ink)' }}><b>While you wait:</b> {success.advice}</div>
            <button onClick={() => { setSuccess(null); navigate('/app/home'); }} className="rounded-full px-[22px] py-3 font-semibold font-jk text-white" style={{ background: 'var(--ac-gd)' }}>Done</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <PageWrap>
          <PageHeader title="Report a problem" subtitle="Get an instant reference number and advice while an officer responds." />
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {TYPES.map((t) => {
              const I = t.icon; const on = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)} className="rounded-[18px] p-3.5 text-left border-2 transition"
                  style={{ borderColor: on ? 'var(--ag-g)' : 'transparent', background: on ? 'var(--ag-gl)' : 'var(--ag-card, #fff)', boxShadow: '0 2px 10px rgba(20,60,40,0.06)' }}>
                  <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center mb-2" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><I className="w-5 h-5" /></span>
                  <b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>{t.title}</b>
                  <span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>{t.sub}</span>
                </button>
              );
            })}
          </div>
          <div className="lg:max-w-[640px]">
            <label className="block text-[12px] font-semibold mt-3.5 mb-1.5">What are you seeing?</label>
            <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe symptoms, when it started and how many are affected…"
              className="w-full border rounded-2xl py-3 px-4 text-[14px]" style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)' }} />
            <div className="flex gap-2.5 my-3">
              <button onClick={() => showToast('Camera opened')} className="flex-1 rounded-full py-3 font-semibold flex items-center justify-center gap-2 text-[13px]" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><Camera className="w-4 h-4" />Add photo</button>
              <button onClick={useLocation} className="flex-1 rounded-full py-3 font-semibold flex items-center justify-center gap-2 text-[13px]" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><MapPin className="w-4 h-4" />Use location</button>
            </div>
            {gps && <div className="text-[12px] mb-3" style={{ color: 'var(--ag-mut)' }}>📍 Pinned: {gps}</div>}
            <label className="block text-[12px] font-semibold mb-1.5">Affected quantity</label>
            <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 4 animals"
              className="w-full border rounded-2xl py-3 px-4 text-[14px]" style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)' }} />
            <button onClick={submit} disabled={submitting} className="w-full mt-4 rounded-full py-3.5 font-semibold text-white disabled:opacity-60" style={{ background: 'var(--ag-g)' }}>{submitting ? 'Submitting…' : 'Submit report'}</button>
          </div>
        </PageWrap>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="grid" style={{ gridTemplateColumns: '1.65fr 1fr', gap: 20 }}>
          <DCard>
            <DSectionHead title="What are you reporting?" />
            <div className="grid grid-cols-2 gap-3">
              {TYPES.map(t => {
                const I = t.icon; const on = type === t.id;
                return (
                  <button key={t.id} onClick={() => setType(t.id)} className="rounded-[16px] p-3.5 text-left transition"
                    style={{ border: `2px solid ${on ? 'var(--ac-g)' : 'transparent'}`, background: on ? 'var(--ac-gl)' : 'var(--ac-bg)' }}>
                    <span className="w-10 h-10 rounded-[13px] grid place-items-center mb-2" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><I className="w-5 h-5" /></span>
                    <b className="block text-[13px] font-jk" style={{ color: 'var(--ac-ink)' }}>{t.title}</b>
                    <span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{t.sub}</span>
                  </button>
                );
              })}
            </div>
            <label className="block text-[12px] font-semibold font-jk mt-4 mb-1.5" style={{ color: 'var(--ac-ink)' }}>What are you seeing?</label>
            <textarea rows={4} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Describe symptoms, when it started and how many are affected…"
              className="w-full rounded-[14px] py-3 px-3.5 text-[14px] font-jk outline-none" style={{ border: '1.5px solid var(--ac-ln)', background: 'var(--ac-bg)', color: 'var(--ac-ink)' }} />
            <label className="block text-[12px] font-semibold font-jk mt-3.5 mb-1.5" style={{ color: 'var(--ac-ink)' }}>Affected quantity</label>
            <input value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 4 animals"
              className="w-full rounded-[14px] py-3 px-3.5 text-[14px] font-jk outline-none" style={{ border: '1.5px solid var(--ac-ln)', background: 'var(--ac-bg)', color: 'var(--ac-ink)' }} />
            <div className="flex gap-2.5 my-4">
              <button onClick={() => showToast('Camera opened')} className="rounded-full px-[22px] py-3 font-semibold font-jk flex items-center gap-2 text-[13px]" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><Camera className="w-4 h-4" />Add photo</button>
              <button onClick={useLocation} className="rounded-full px-[22px] py-3 font-semibold font-jk flex items-center gap-2 text-[13px]" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><MapPin className="w-4 h-4" />Use my location</button>
            </div>
            {gps && <div className="text-[12px] font-jk mb-1" style={{ color: 'var(--ac-mu)' }}>📍 Pinned: {gps}</div>}
            <button onClick={submit} disabled={submitting} className="rounded-full px-[22px] py-3 font-semibold font-jk text-white disabled:opacity-60 inline-flex items-center gap-2" style={{ background: 'var(--ac-gd)' }}>
              {submitting ? 'Submitting…' : 'Submit report'}
            </button>
          </DCard>

          <DCard>
            <DSectionHead title="What happens next" />
            <div className="relative pl-7 mt-2.5">
              {NEXT_STEPS.map((s, i, arr) => (
                <div key={i} className="relative pb-4 text-[12.5px] font-jk" style={{ color: 'var(--ac-ink)' }}>
                  <span className="absolute left-[-28px] top-[3px] w-3.5 h-3.5 rounded-full"
                    style={{ background: s.st === 'done' ? 'var(--ac-g)' : s.st === 'cur' ? 'var(--ac-au)' : 'var(--ac-ln)', border: '3px solid var(--ac-cd)', boxShadow: s.st === 'done' ? '0 0 0 1.5px var(--ac-g)' : s.st === 'cur' ? '0 0 0 4px #c9a24b33' : '0 0 0 1.5px var(--ac-ln)' }} />
                  {s.t}
                  {i < arr.length - 1 && <span className="absolute left-[-22px] top-[18px] bottom-0 w-0.5" style={{ background: s.st === 'done' ? 'var(--ac-g)' : 'var(--ac-ln)' }} />}
                </div>
              ))}
            </div>
          </DCard>
        </div>
      </div>
    </>
  );
}