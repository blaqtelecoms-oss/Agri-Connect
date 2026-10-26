import React, { useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { addSampleApplication, addSampleNotification } from './_farmerSampleData';
import { qrSvgFromToken } from '@/lib/agriAssets';
import { FARMER_NAME, FARMER_ID, useServiceTypes, useFarmerApplications, Chip, FarmerCard, PageWrap, PageHeader, showToast, DCard, DSectionHead, DChip } from './_shared';

const CATS = ['All', 'Permits', 'Registrations', 'Grants', 'Certificates', 'Training'];
const catKey = { Permits: 'permit', Registrations: 'registration', Grants: 'grant', Certificates: 'certificate', Training: 'training' };

function dChipVar(status) {
  const s = String(status || '').toLowerCase();
  if (/review|progress|open|needs|more/.test(s)) return 'c-y';
  if (/approved|verified|complete|valid|issued/.test(s)) return 'c-g';
  if (/reject|changes|breach|critical/.test(s)) return 'c-r';
  return 'c-b';
}

export default function Services() {
  const { items: services } = useServiceTypes();
  const { items: apps, reload } = useFarmerApplications();
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [submitting, setSubmitting] = useState(null);

  const filtered = services.filter(s => {
    const catOk = cat === 'All' || s.category === catKey[cat];
    const qOk = !query || s.name.toLowerCase().includes(query.toLowerCase());
    return catOk && qOk;
  });

  const inReviewApp = apps.find(a => a.status !== 'approved' && a.status !== 'issued' && a.status !== 'rejected') || apps[0];

  const apply = async (s) => {
    setSubmitting(s.id);
    try {
      const ref = 'APP-2026-' + String(Math.floor(4000 + Math.random() * 999)).padStart(4, '0');
      const app = {
        reference: ref, service_type: s.name, category: s.category, farmer_id: FARMER_ID, farmer_name: FARMER_NAME,
        area: 'De Deur', status: 'submitted', assigned_officer: s.approver_role || 'Officer', due_date: '5 days',
        submitted_date: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }), progress: 5, submitted_data: 'Pre-filled from farm profile',
      };
      try {
        await base44.entities.Application.create(app);
        await base44.entities.NotificationItem.create({
          farmer_id: FARMER_ID, title: 'Application submitted', body: `${s.name} (${ref}) is now in review. We will notify you of updates.`, type: 'action', channel: 'push',
        });
      } catch (e) {
        // Backend unreachable (not configured): record the submission in the
        // local sample fallback so the apply flow still works end to end.
        addSampleApplication(app);
        addSampleNotification({
          farmer_id: FARMER_ID, title: 'Application submitted', body: `${s.name} (${ref}) is now in review. We will notify you of updates.`, type: 'action', channel: 'push',
        });
      }
      showToast('Application submitted – ' + ref);
      reload();
    } finally {
      setSubmitting(null);
    }
  };

  const qrToken = FARMER_ID + '-CERT';

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <PageWrap>
          <PageHeader title="Services" subtitle="Apply for permits, grants, certificates and training." />
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search permits, grants, certificates…"
              className="w-full border rounded-2xl py-3 pl-10 pr-3 text-[14px]" style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)' }} />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 mt-3 pb-1">
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`flex-none px-4 py-2 rounded-full text-[12.5px] font-medium border ${cat === c ? 'text-white' : ''}`}
                style={cat === c ? { background: 'var(--ag-g)', borderColor: 'var(--ag-g)' } : { background: 'var(--ag-card, #fff)', borderColor: 'var(--ag-line)' }}>{c}</button>
            ))}
          </div>
          <FarmerCard className="mt-2">
            {filtered.length === 0 && <div className="py-6 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>No services found.</div>}
            {filtered.map((s) => (
              <div key={s.id} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><FileText className="w-5 h-5" /></span>
                <div className="flex-1 min-w-0"><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{s.name}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{s.category} · {s.approver_role} · {s.sla_days} days</span></div>
                <button disabled={submitting === s.id} onClick={() => apply(s)} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#d9f0e3] text-[#15693f] disabled:opacity-60">{submitting === s.id ? '…' : 'Apply'}</button>
              </div>
            ))}
          </FarmerCard>
          <div className="grid grid-cols-1 gap-0">
            {inReviewApp && (
              <div>
                <h2 className="text-[17px] font-semibold mt-5">Track application</h2>
                <FarmerCard className="mt-2">
                  <div className="flex items-center justify-between">
                    <div><b className="text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{inReviewApp.service_type}</b><div className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{inReviewApp.reference} · Submitted {inReviewApp.submitted_date}</div></div>
                    <Chip text={inReviewApp.status.replace(/_/g, ' ')} />
                  </div>
                  <div className="relative pl-6 mt-3">
                    {[
                      { t: 'Submitted', s: `${inReviewApp.submitted_date}`, done: true },
                      { t: 'Vaccination & zone check passed', s: 'Auto-checked', done: true, cur: inReviewApp.status === 'in_review' },
                      { t: 'Reviewed by ' + (inReviewApp.assigned_officer || 'Officer'), s: `Due by ${inReviewApp.due_date} (SLA)`, cur: inReviewApp.status === 'in_review' },
                      { t: 'Permit issued with QR code', s: '', done: ['approved', 'issued'].includes(inReviewApp.status) },
                    ].map((step, i, arr) => (
                      <div key={i} className="relative pb-3.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>
                        <span className="absolute -left-6 top-[3px] w-3.5 h-3.5 rounded-full border-[3px]" style={{ background: step.done ? 'var(--ag-g)' : step.cur ? 'var(--ag-y)' : 'var(--ag-line)', borderColor: step.done ? 'var(--ag-g)' : step.cur ? '#f2b70533' : 'var(--ag-line)', boxShadow: step.cur ? '0 0 0 4px #f2b70533' : 'none' }} />
                        {step.t}<br /><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{step.s}</span>
                        {i < arr.length - 1 && <span className="absolute -left-[19px] top-4 bottom-0 w-0.5" style={{ background: step.done ? 'var(--ag-g)' : 'var(--ag-line)' }} />}
                      </div>
                    ))}
                  </div>
                </FarmerCard>
              </div>
            )}
            <div>
              <h2 className="text-[17px] font-semibold mt-5">Digital certificate</h2>
              <div className="rounded-[20px] p-4 flex gap-3.5 items-center text-white mt-2" style={{ background: 'linear-gradient(135deg,#0f4a37,#1a63a8)' }}>
                <div className="w-[74px] h-[74px] bg-white rounded-[10px] p-1.5 flex-none" dangerouslySetInnerHTML={{ __html: qrSvgFromToken(qrToken) }} />
                <div>
                  <div className="text-[11px] opacity-80">Registered Farmer Certificate</div>
                  <b className="text-[15px]">{FARMER_NAME}</b>
                  <div className="text-[11px] opacity-85">{FARMER_ID} · Valid to Oct 2027<br />Scan to verify authenticity</div>
                </div>
              </div>
            </div>
          </div>
        </PageWrap>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="flex flex-wrap gap-2 mb-4">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold font-jk"
              style={cat === c ? { background: 'var(--ac-gd)', color: '#fff', borderColor: 'var(--ac-gd)', border: '1px solid var(--ac-gd)' } : { background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-ink)' }}>{c}</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filtered.length === 0 && <div className="col-span-3 py-10 text-center text-[14px] font-jk" style={{ color: 'var(--ac-mu)' }}>No services found.</div>}
          {filtered.map(s => (
            <DCard key={s.id}>
              <span className="w-10 h-10 rounded-[13px] grid place-items-center mb-3" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><FileText className="w-5 h-5" /></span>
              <b className="block text-[14.5px] font-jk" style={{ color: 'var(--ac-ink)' }}>{s.name}</b>
              <div className="text-[12px] font-jk my-1" style={{ color: 'var(--ac-mu)' }}>{s.category} · {s.approver_role} · {s.sla_days} days</div>
              <button disabled={submitting === s.id} onClick={() => apply(s)} className="rounded-full px-4 py-2 text-[12px] font-semibold font-jk mt-2"
                style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}>{submitting === s.id ? 'Submitting…' : 'Apply'}</button>
            </DCard>
          ))}
        </div>

        <div className="grid mt-6" style={{ gridTemplateColumns: '1.65fr 1fr', gap: 20 }}>
          <DCard>
            <DSectionHead title="Track application" right={inReviewApp ? <DChip text={inReviewApp.status.replace(/_/g, ' ')} variant={dChipVar(inReviewApp.status)} /> : null} />
            {inReviewApp ? (
              <>
                <b className="font-jk text-[14px]" style={{ color: 'var(--ac-ink)' }}>{inReviewApp.service_type}</b>
                <div className="text-[12px] font-jk" style={{ color: 'var(--ac-mu)' }}>{inReviewApp.reference} · Submitted {inReviewApp.submitted_date}</div>
                <div className="relative pl-7 mt-4">
                  {[
                    { t: 'Submitted', s: 'Auto-confirmed', st: 'done' },
                    { t: 'Vaccination & zone check passed', s: 'Auto-checked', st: 'done' },
                    { t: 'Reviewed by ' + (inReviewApp.assigned_officer || 'Officer'), s: `Due by ${inReviewApp.due_date} (5-day SLA)`, st: 'cur' },
                    { t: 'Permit issued with QR code', s: '', st: '' },
                  ].map((step, i, arr) => (
                    <div key={i} className="relative pb-4 text-[12.5px] font-jk" style={{ color: 'var(--ac-ink)' }}>
                      <span className="absolute -left-7 top-[3px] w-3.5 h-3.5 rounded-full border-[3px]"
                        style={{ background: step.st === 'done' ? 'var(--ac-g)' : step.st === 'cur' ? 'var(--ac-au)' : 'var(--ac-ln)', borderColor: step.st === 'done' ? 'var(--ac-g)' : step.st === 'cur' ? '#c9a24b33' : 'var(--ac-ln)', boxShadow: step.st === 'cur' ? '0 0 0 4px #c9a24b33' : 'none' }} />
                      {step.t}<br /><span style={{ color: 'var(--ac-mu)' }}>{step.s}</span>
                      {i < arr.length - 1 && <span className="absolute -left-[22px] top-4 bottom-0 w-0.5" style={{ background: step.st === 'done' ? 'var(--ac-g)' : 'var(--ac-ln)' }} />}
                    </div>
                  ))}
                </div>
              </>
            ) : <div className="py-6 text-center text-[13px] font-jk" style={{ color: 'var(--ac-mu)' }}>No applications to track yet.</div>}
          </DCard>

          <DCard className="relative overflow-hidden" style={{ border: 0, background: 'radial-gradient(100% 120% at 100% 0, #c9a24b55, transparent 55%), linear-gradient(135deg,#0b3326,#14507c)' }}>
            <span className="text-[11px] tracking-[1.4px] opacity-80 font-jk">DIGITAL CERTIFICATE</span>
            <div className="flex gap-4 items-center mt-3">
              <div className="w-[84px] h-[84px] bg-white rounded-xl p-1.5 flex-none" dangerouslySetInnerHTML={{ __html: qrSvgFromToken(qrToken) }} />
              <div className="text-white">
                <b className="font-fraunces block" style={{ fontSize: 20, fontWeight: 500 }}>Registered Farmer</b>
                <div className="text-[12px] opacity-85 font-jk mt-0.5">Scan to verify authenticity</div>
              </div>
            </div>
          </DCard>
        </div>
      </div>
    </>
  );
}