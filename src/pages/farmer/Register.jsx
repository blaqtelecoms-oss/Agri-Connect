import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL } from '@/lib/agriAssets';
import { LANGUAGES, DEMO_FARMER, setSession } from '@/lib/agriAuth';
import { ArrowLeft, ArrowRight, BadgeCheck, FileText } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    idType: 'sa_id',
    id_number: '',
    reg_number: '',
    name: '',
    phone: '+27 ',
    language: 'English',
    consent: false,
  });

  const upd = (k, v) => setForm({ ...form, [k]: v });

  const submit = (e) => {
    e.preventDefault();
    setSession({ portal: 'farmer', ...DEMO_FARMER });
    navigate('/app/home');
  };

  return (
    <div className="min-h-screen font-farmer" style={{ background: 'var(--ag-bg)' }}>
      <div className="max-w-[440px] mx-auto px-5 py-8">
        <div className="flex items-center gap-3 bg-white rounded-2xl py-2 px-4 w-fit shadow-sm">
          <img src={LOGO_URL} alt="Emfuleni" className="h-10" />
          <div>
            <b className="block text-[12px] leading-tight" style={{ color: 'var(--ag-ink)' }}>Emfuleni Local Municipality</b>
            <span className="text-[10px]" style={{ color: 'var(--ag-mut)' }}>Agriculture &amp; Rural Development</span>
          </div>
        </div>

        <button onClick={() => navigate('/signin')} className="flex items-center gap-2 mt-6 text-[13px] font-medium" style={{ color: 'var(--ag-g)' }}>
          <ArrowLeft className="w-4 h-4" /> Back to sign in
        </button>

        <h1 className="text-2xl font-semibold mt-5" style={{ color: 'var(--ag-ink)' }}>Register as a farmer</h1>
        <p className="text-[13px] mt-1" style={{ color: 'var(--ag-mut)' }}>Create your farmer profile to access permits, grants and support.</p>

        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-1.5 rounded-full transition-colors" style={{ background: step >= 1 ? 'var(--ag-g)' : 'var(--ag-line)' }} />
          <div className="flex-1 h-1.5 rounded-full transition-colors" style={{ background: step >= 2 ? 'var(--ag-g)' : 'var(--ag-line)' }} />
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-5 shadow-sm ag-in" style={{ color: 'var(--ag-ink)' }}>
          {step === 1 && (
            <div>
              <label className="block text-[12px] font-semibold mb-2 mt-1">Identity type</label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button type="button" onClick={() => upd('idType', 'sa_id')}
                  className={`rounded-2xl p-3.5 text-left border-2 transition ${form.idType === 'sa_id' ? 'border-[var(--ag-g)]' : 'border-transparent'}`}
                  style={{ background: form.idType === 'sa_id' ? 'var(--ag-gl)' : '#fff' }}>
                  <BadgeCheck className="w-5 h-5 mb-1.5" style={{ color: 'var(--ag-g)' }} />
                  <b className="block text-[13px]">SA ID number</b>
                  <span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>Individual farmer</span>
                </button>
                <button type="button" onClick={() => upd('idType', 'company')}
                  className={`rounded-2xl p-3.5 text-left border-2 transition ${form.idType === 'company' ? 'border-[var(--ag-g)]' : 'border-transparent'}`}
                  style={{ background: form.idType === 'company' ? 'var(--ag-gl)' : '#fff' }}>
                  <FileText className="w-5 h-5 mb-1.5" style={{ color: 'var(--ag-g)' }} />
                  <b className="block text-[13px]">Company reg</b>
                  <span className="text-[11px]" style={{ color: 'var(--ag-mut)' }}>Business / co-op</span>
                </button>
              </div>
              {form.idType === 'sa_id' ? (
                <>
                  <label className="block text-[12px] font-semibold mb-1.5">SA ID number</label>
                  <input required value={form.id_number} onChange={(e) => upd('id_number', e.target.value)}
                    className="w-full border rounded-xl py-3 px-4 text-[14px] mb-3"
                    style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }} placeholder="8201015800087" />
                </>
              ) : (
                <>
                  <label className="block text-[12px] font-semibold mb-1.5">Company registration number</label>
                  <input required value={form.reg_number} onChange={(e) => upd('reg_number', e.target.value)}
                    className="w-full border rounded-xl py-3 px-4 text-[14px] mb-3"
                    style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }} placeholder="2018/123456/07" />
                </>
              )}
              <label className="block text-[12px] font-semibold mb-1.5">Full name / business name</label>
              <input required value={form.name} onChange={(e) => upd('name', e.target.value)}
                className="w-full border rounded-xl py-3 px-4 text-[14px] mb-3"
                style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }} placeholder="e.g. Thabo Mokoena" />
              <label className="block text-[12px] font-semibold mb-1.5">Mobile number</label>
              <input value={form.phone} onChange={(e) => upd('phone', e.target.value)} inputMode="tel"
                className="w-full border rounded-xl py-3 px-4 text-[14px]"
                style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }} />
              <button type="button" onClick={() => setStep(2)} className="w-full mt-4 rounded-full py-3.5 font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: 'var(--ag-g)' }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-[12px] font-semibold mb-1.5 mt-1">Preferred language</label>
              <select value={form.language} onChange={(e) => upd('language', e.target.value)}
                className="w-full border rounded-xl py-3 px-4 text-[14px] mb-4 appearance-none"
                style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
              <label className={`flex items-start gap-3 rounded-2xl p-3.5 border-2 cursor-pointer mb-4 ${form.consent ? 'border-[var(--ag-g)]' : 'border-[var(--ag-line)]'}`}
                style={{ background: form.consent ? 'var(--ag-gl)' : 'var(--ag-bg)' }}>
                <input type="checkbox" checked={form.consent} onChange={(e) => upd('consent', e.target.checked)} className="mt-1 w-4 h-4 accent-[var(--ag-g)]" />
                <span className="text-[12px]" style={{ color: 'var(--ag-ink)' }}>
                  I consent to the processing of my personal information under POPIA for the purposes of farmer registration and service delivery.
                </span>
              </label>
              <button type="submit" disabled={!form.consent}
                className="w-full rounded-full py-3.5 font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: 'var(--ag-g)' }}>
                Submit registration
              </button>
              <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ag-mut)' }}>Your application enters the verification queue.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}