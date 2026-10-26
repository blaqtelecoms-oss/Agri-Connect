import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import ServiceApplyForm, { CATEGORY_META } from './ServiceApplyForm';
import ApplicationTracker from './ApplicationTracker';
import { useServiceTypes, useFarmerApplications, PageWrap, PageHeader, DCard, DSectionHead } from './_shared';

const CATS = ['All', 'Permits', 'Registrations', 'Grants', 'Certificates', 'Training'];
const catKey = { Permits: 'permit', Registrations: 'registration', Grants: 'grant', Certificates: 'certificate', Training: 'training' };

export default function Services() {
  const { items: services } = useServiceTypes();
  const { items: apps, reload } = useFarmerApplications();
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const [formService, setFormService] = useState(null);

  const filtered = services.filter(s => {
    const catOk = cat === 'All' || s.category === catKey[cat];
    const qOk = !query || s.name.toLowerCase().includes(query.toLowerCase());
    return catOk && qOk;
  });

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
          {filtered.length === 0 && <div className="py-8 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>No services found.</div>}
          <div className="mt-2 space-y-2.5">
            {filtered.map((s) => {
              const meta = CATEGORY_META[s.category] || CATEGORY_META.permit;
              const I = meta.Icon;
              return (
                <div key={s.id} className="relative overflow-hidden rounded-[20px] border p-3.5 pl-4"
                  style={{ background: 'var(--ag-card, #fff)', borderColor: 'var(--ag-line)', boxShadow: '0 3px 14px rgba(15,40,30,0.06)' }}>
                  <span className="absolute left-0 top-0 bottom-0 w-[4px]" style={{ background: `linear-gradient(180deg, ${meta.from}, ${meta.to})` }} />
                  <div className="flex items-start gap-3">
                    <span className="w-[46px] h-[46px] rounded-[15px] grid place-items-center flex-none"
                      style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, boxShadow: `0 5px 12px ${meta.to}40, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
                      <I className="w-[22px] h-[22px] text-white" strokeWidth={2.1} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <b className="text-[13.5px] font-semibold leading-tight" style={{ color: 'var(--ag-ink)' }}>{s.name}</b>
                        <span className="text-[10px] font-bold px-2 py-[3px] rounded-full uppercase tracking-wide" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}>{meta.label}</span>
                      </div>
                      <div className="text-[11.5px] mt-1" style={{ color: 'var(--ag-mut)' }}>{s.approver_role} · {s.sla_days}-day SLA</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>Official municipal process</span>
                    <button onClick={() => setFormService(s)} className="text-[12px] font-semibold px-4 py-2 rounded-full text-white flex items-center gap-1.5"
                      style={{ background: 'linear-gradient(135deg, #2f8a66, #1d5c45)', boxShadow: '0 3px 10px rgba(29,92,69,0.3)' }}>
                      Apply now<ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div>
            <h2 className="text-[17px] font-semibold mt-5">My applications</h2>
            <div className="mt-2">
              <ApplicationTracker apps={apps} />
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
          {filtered.map(s => {
            const meta = CATEGORY_META[s.category] || CATEGORY_META.permit;
            const I = meta.Icon;
            return (
              <DCard key={s.id} className="relative overflow-hidden">
                <span className="absolute -right-9 -top-9 w-[110px] h-[110px] rounded-full opacity-[0.10]" style={{ background: meta.from }} />
                <div className="flex items-start justify-between">
                  <span className="w-[46px] h-[46px] rounded-[15px] grid place-items-center"
                    style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})`, boxShadow: `0 6px 14px ${meta.to}40, inset 0 1px 0 rgba(255,255,255,0.35)` }}>
                    <I className="w-[22px] h-[22px] text-white" strokeWidth={2.1} />
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}>{meta.label}</span>
                </div>
                <b className="block text-[14.5px] font-jk mt-3 leading-tight" style={{ color: 'var(--ac-ink)' }}>{s.name}</b>
                <div className="text-[12px] font-jk my-1.5" style={{ color: 'var(--ac-mu)' }}>{s.approver_role} · {s.sla_days}-day SLA</div>
                <button onClick={() => setFormService(s)} className="rounded-full px-4 py-2 text-[12px] font-semibold font-jk mt-2 w-full text-white flex items-center justify-center gap-1.5"
                  style={{ background: 'linear-gradient(135deg, #2f8a66, #1d5c45)', boxShadow: '0 3px 10px rgba(29,92,69,0.25)' }}>
                  Apply now<ArrowRight className="w-3.5 h-3.5" />
                </button>
              </DCard>
            );
          })}
        </div>

        <DCard className="mt-6">
          <DSectionHead title="My applications" />
          <ApplicationTracker apps={apps} desktop />
        </DCard>
      </div>

      {/* Professional application flow for the selected service */}
      {formService && (
        <ServiceApplyForm service={formService} onClose={() => setFormService(null)} onSubmitted={reload} />
      )}
    </>
  );
}