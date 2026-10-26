import React, { useState } from 'react';
import { X, ChevronLeft, Send, CircleCheckBig, ShieldCheck, BadgeCheck, Award, GraduationCap, ScrollText, Landmark, Phone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { addSampleApplication, addSampleNotification } from './_farmerSampleData';
import { FARMER_ID, FARMER_NAME, useFarmerFarms, showToast } from './_shared';

// Premium per-category presentation + the application form fields each
// service type asks for. Shared by the Services cards and the apply flow.
export const CATEGORY_META = {
  permit: {
    label: 'Permit', Icon: ShieldCheck, from: '#4fb98a', to: '#0f4a37',
    fields: [
      { id: 'purpose', label: 'What will this permit be used for?', type: 'textarea', placeholder: 'Describe the activity, destination or market…', required: true },
      { id: 'scope', label: 'Quantity / scope', type: 'text', placeholder: 'e.g. 18 cattle · 2 trips' },
      { id: 'start_date', label: 'Proposed start date', type: 'date' },
    ],
  },
  registration: {
    label: 'Registration', Icon: BadgeCheck, from: '#5aa9f2', to: '#1a63a8',
    fields: [
      { id: 'details', label: 'Entity / trading name', type: 'text', placeholder: 'Name as it should appear on the register', required: true },
      { id: 'commodities', label: 'Commodities produced', type: 'text', placeholder: 'e.g. Maize, spinach, poultry' },
    ],
  },
  grant: {
    label: 'Grant', Icon: Award, from: '#f2c94c', to: '#a37b00',
    fields: [
      { id: 'purpose', label: 'What will the funding be used for?', type: 'textarea', placeholder: 'Infrastructure, inputs, equipment, water…', required: true },
      { id: 'amount', label: 'Amount requested', type: 'text', placeholder: 'e.g. R45 000' },
      { id: 'prior', label: 'Previous government support', type: 'select', options: ['None', 'CASP', 'Ilima / Letsema', 'Other'] },
    ],
  },
  certificate: {
    label: 'Certificate', Icon: ScrollText, from: '#9d8cff', to: '#5b47c7',
    fields: [
      { id: 'scope', label: 'What needs to be certified?', type: 'text', placeholder: 'e.g. 18 Nguni cattle', required: true },
      { id: 'reason', label: 'Purpose of certificate', type: 'text', placeholder: 'e.g. Auction at Vereeniging' },
    ],
  },
  training: {
    label: 'Training', Icon: GraduationCap, from: '#64d2c7', to: '#0d7d75',
    fields: [
      { id: 'attendees', label: 'Number of attendees', type: 'text', placeholder: 'e.g. 2 people', required: true },
      { id: 'preferred_date', label: 'Preferred date', type: 'date' },
    ],
  },
};

const inputStyle = { borderColor: 'var(--ag-line)', background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)' };
const labelStyle = { color: 'var(--ag-ink)' };

function Field({ f, value, onChange }) {
  const common = 'w-full border rounded-2xl py-2.5 px-3.5 text-[13.5px] outline-none focus:border-[var(--ag-g)]';
  return (
    <div>
      <label className="block text-[12px] font-semibold mb-1.5" style={labelStyle}>{f.label}{f.required && <span style={{ color: 'var(--ag-or)' }}> *</span>}</label>
      {f.type === 'textarea' ? (
        <textarea rows={3} value={value || ''} onChange={(e) => onChange(f.id, e.target.value)} placeholder={f.placeholder} className={common} style={inputStyle} />
      ) : f.type === 'select' ? (
        <select value={value || ''} onChange={(e) => onChange(f.id, e.target.value)} className={common} style={inputStyle}>
          <option value="">Select…</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={f.type || 'text'} value={value || ''} onChange={(e) => onChange(f.id, e.target.value)} placeholder={f.placeholder} className={common} style={inputStyle} />
      )}
    </div>
  );
}

// Professional 3-step application flow: details → review & declaration →
// submitted. The application is written to the backend when one is reachable,
// otherwise recorded in the local sample fallback so the flow still completes.
export default function ServiceApplyForm({ service, onClose, onSubmitted }) {
  const meta = CATEGORY_META[service.category] || CATEGORY_META.permit;
  const { farms } = useFarmerFarms();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({});
  const [farm, setFarm] = useState('');
  const [contact, setContact] = useState('+27 82 555 0142');
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ref, setRef] = useState(null);
  const I = meta.Icon;

  const farmName = farm || (farms[0] && farms[0].name) || '';
  const setValue = (id, v) => setValues((x) => ({ ...x, [id]: v }));

  const continueToReview = () => {
    if (!farmName || !contact) { showToast('Please complete your farm and contact details'); return; }
    const missing = meta.fields.filter((f) => f.required && !(values[f.id] || '').trim());
    if (missing.length) { showToast('Please complete: ' + missing[0].label); return; }
    setStep(2);
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const newRef = 'APP-2026-' + String(Math.floor(4000 + Math.random() * 999)).padStart(4, '0');
      const area = ((farms || []).find((f) => f.name === farmName) || {}).suburb || 'De Deur';
      const app = {
        reference: newRef, service_type: service.name, category: service.category, farmer_id: FARMER_ID, farmer_name: FARMER_NAME,
        area, status: 'submitted', assigned_officer: service.approver_role || 'Officer', due_date: '5 days',
        submitted_date: new Date().toLocaleDateString('en-ZA', { day: '2-digit', month: 'short' }), progress: 5,
        submitted_data: [
          ['Farm', farmName], ['Contact', contact],
          ...meta.fields.map((f) => [f.label, values[f.id] || '—']),
        ].map(([k, v]) => `${k}: ${v}`).join(' · '),
      };
      try {
        await base44.entities.Application.create(app);
        await base44.entities.NotificationItem.create({
          farmer_id: FARMER_ID, title: 'Application submitted', body: `${service.name} (${newRef}) is now in review. We will notify you of updates.`, type: 'action', channel: 'push',
        });
      } catch (e) {
        // Backend unreachable (not configured): record the submission in the
        // local sample fallback so the apply flow still works end to end.
        addSampleApplication(app);
        addSampleNotification({
          farmer_id: FARMER_ID, title: 'Application submitted', body: `${service.name} (${newRef}) is now in review. We will notify you of updates.`, type: 'action', channel: 'push',
        });
      }
      setRef(newRef);
      setStep(3);
      onSubmitted && onSubmitted();
    } finally {
      setSubmitting(false);
    }
  };

  const stepTitles = ['Application details', 'Review & submit', 'Submitted'];
  const summaryRows = [
    ['Service', service.name], ['Category', meta.label], ['Farm', farmName || '—'], ['Contact', contact],
    ...meta.fields.map((f) => [f.label, values[f.id] || '—']),
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-end lg:items-center justify-center" style={{ background: 'rgba(8,18,14,0.55)', backdropFilter: 'blur(3px)' }}>
      <div className="w-full lg:w-[540px] max-h-[92vh] overflow-y-auto rounded-t-[30px] lg:rounded-[28px]"
        style={{ background: 'var(--ag-card, #fff)', boxShadow: '0 -12px 60px rgba(10,25,18,0.35)' }}>

        {/* Premium gradient header with the category icon */}
        <div className="relative p-5 pb-4 text-white overflow-hidden rounded-t-[30px] lg:rounded-t-[28px]"
          style={{ background: `linear-gradient(135deg, ${meta.from}, ${meta.to})` }}>
          <span className="absolute -right-7 -top-9 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.14)' }} />
          <span className="absolute right-8 -bottom-10 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.10)' }} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full grid place-items-center bg-white/15 text-white"><X className="w-4 h-4" /></button>
          <div className="flex items-center gap-3.5">
            <span className="w-[52px] h-[52px] rounded-[16px] grid place-items-center flex-none"
              style={{ background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), 0 6px 14px rgba(0,0,0,0.25)' }}>
              <I className="w-[26px] h-[26px]" strokeWidth={2.1} />
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold tracking-[1.2px] uppercase opacity-85">{meta.label} application</div>
              <b className="block text-[17px] font-semibold leading-tight">{service.name}</b>
              <div className="text-[11.5px] opacity-85 mt-0.5">{service.approver_role} · {service.sla_days}-day SLA</div>
            </div>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-3 px-5 pt-4">
          <div className="flex gap-1.5 flex-none">
            {[1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: i === step ? 20 : 6, background: i <= step ? 'var(--ag-g)' : 'var(--ag-line)' }} />
            ))}
          </div>
          <span className="text-[11.5px] font-semibold" style={{ color: 'var(--ag-mut)' }}>Step {step} of 3 · {stepTitles[step - 1]}</span>
        </div>

        {/* STEP 1 — details */}
        {step === 1 && (
          <div className="px-5 pt-4 pb-6 space-y-4">
            <div>
              <label className="block text-[12px] font-semibold mb-1.5" style={labelStyle}>Applicant<span style={{ color: 'var(--ag-or)' }}> *</span></label>
              <div className="flex items-center gap-2.5 border rounded-2xl py-2.5 px-3.5" style={inputStyle}>
                <span className="w-7 h-7 rounded-full grid place-items-center text-[11px] font-bold text-white flex-none" style={{ background: 'var(--ag-g)' }}>TM</span>
                <div className="min-w-0"><b className="block text-[13px]">{FARMER_NAME}</b><span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>{FARMER_ID} · Verified farmer</span></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={labelStyle}>Farm<span style={{ color: 'var(--ag-or)' }}> *</span></label>
                <div className="flex items-center gap-2 border rounded-2xl py-2.5 px-3" style={inputStyle}>
                  <Landmark className="w-4 h-4 flex-none" style={{ color: 'var(--ag-mut)' }} />
                  <select value={farmName} onChange={(e) => setFarm(e.target.value)} className="flex-1 bg-transparent text-[13.5px] outline-none" style={{ color: 'var(--ag-ink)' }}>
                    {(farms.length ? farms : [{ name: 'De Deur Smallholding' }]).map((f) => <option key={f.id || f.name} value={f.name}>{f.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-semibold mb-1.5" style={labelStyle}>Contact number<span style={{ color: 'var(--ag-or)' }}> *</span></label>
                <div className="flex items-center gap-2 border rounded-2xl py-2.5 px-3" style={inputStyle}>
                  <Phone className="w-4 h-4 flex-none" style={{ color: 'var(--ag-mut)' }} />
                  <input value={contact} onChange={(e) => setContact(e.target.value)} className="flex-1 bg-transparent text-[13.5px] outline-none" style={{ color: 'var(--ag-ink)' }} />
                </div>
              </div>
            </div>
            <div className="h-px" style={{ background: 'var(--ag-line)' }} />
            {meta.fields.map((f) => <Field key={f.id} f={f} value={values[f.id]} onChange={setValue} />)}
            <button onClick={continueToReview} className="w-full rounded-full py-3.5 font-semibold text-white flex items-center justify-center gap-2 text-[14px]"
              style={{ background: 'linear-gradient(135deg, #2f8a66, #1d5c45)', boxShadow: '0 4px 14px rgba(29,92,69,0.35)' }}>
              Continue to review
            </button>
          </div>
        )}

        {/* STEP 2 — review & declaration */}
        {step === 2 && (
          <div className="px-5 pt-4 pb-6">
            <div className="rounded-[18px] border overflow-hidden" style={{ borderColor: 'var(--ag-line)' }}>
              {summaryRows.map(([k, v], i) => (
                <div key={k} className="flex items-start gap-3 px-4 py-2.5 text-[12.5px]" style={{ borderTop: i ? '1px solid var(--ag-line)' : 0, background: i % 2 ? 'var(--ag-pn, #e8ebe9)' : 'transparent' }}>
                  <span className="w-[132px] flex-none" style={{ color: 'var(--ag-mut)' }}>{k}</span>
                  <b className="flex-1 font-semibold" style={{ color: 'var(--ag-ink)' }}>{v}</b>
                </div>
              ))}
            </div>
            <button onClick={() => setAgreed(!agreed)} className="flex gap-2.5 items-start text-left mt-4">
              <span className="w-[22px] h-[22px] rounded-[7px] grid place-items-center flex-none border-2 mt-0.5"
                style={{ borderColor: agreed ? 'var(--ag-g)' : 'var(--ag-line)', background: agreed ? 'var(--ag-g)' : 'transparent' }}>
                {agreed && <CircleCheckBig className="w-3.5 h-3.5 text-white" />}
              </span>
              <span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>
                I confirm that the information provided is true and complete, and I consent to the assigned officer contacting me about this application.
              </span>
            </button>
            <div className="flex gap-2.5 mt-4">
              <button onClick={() => setStep(1)} className="rounded-full px-4 py-3 font-semibold text-[13px] flex items-center gap-1.5 border" style={{ color: 'var(--ag-ink)', borderColor: 'var(--ag-line)' }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button disabled={!agreed || submitting} onClick={submit}
                className="flex-1 rounded-full py-3 font-semibold text-white flex items-center justify-center gap-2 text-[14px] disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2f8a66, #1d5c45)', boxShadow: '0 4px 14px rgba(29,92,69,0.35)' }}>
                <Send className="w-4 h-4" />{submitting ? 'Submitting…' : 'Submit application'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — success */}
        {step === 3 && (
          <div className="px-5 pt-6 pb-7 text-center">
            <div className="w-16 h-16 rounded-full grid place-items-center mx-auto" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}>
              <CircleCheckBig className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mt-3" style={{ color: 'var(--ag-ink)' }}>Application submitted</h3>
            <p className="text-[13px] mt-1" style={{ color: 'var(--ag-mut)' }}>Reference <b style={{ color: 'var(--ag-ink)' }}>{ref}</b> · track it any time under Services</p>
            <div className="rounded-[18px] p-4 my-4 text-left" style={{ background: 'var(--ag-gl)' }}>
              {[
                ['Received & queued', 'Your application is with ' + (service.approver_role || 'the officer')],
                ['Officer review', `${service.sla_days}-day SLA · we will contact you on ${contact}`],
                ['Outcome', 'Approved applications are issued with a QR-verifiable document'],
              ].map(([t, s], i, arr) => (
                <div key={i} className="relative pl-6 pb-3 last:pb-0 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>
                  <span className="absolute left-0 top-[3px] w-3.5 h-3.5 rounded-full border-[3px]" style={{ background: i === 0 ? 'var(--ag-g)' : 'var(--ag-line)', borderColor: i === 0 ? 'var(--ag-g)' : 'var(--ag-line)' }} />
                  <b>{t}</b><br /><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{s}</span>
                  {i < arr.length - 1 && <span className="absolute left-[7px] top-4 bottom-0 w-0.5" style={{ background: i === 0 ? 'var(--ag-g)' : 'var(--ag-line)' }} />}
                </div>
              ))}
            </div>
            <button onClick={onClose} className="w-full rounded-full py-3.5 font-semibold text-white text-[14px]"
              style={{ background: 'linear-gradient(135deg, #2f8a66, #1d5c45)' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}
