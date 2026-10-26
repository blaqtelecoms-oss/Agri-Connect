import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LOGO_URL, HERO_SIGNIN } from '@/lib/agriAssets';
import { LANGUAGES, DEMO_FARMER, DEMO_OFFICIAL, setSession } from '@/lib/agriAuth';
import { Phone, Lock, Mail, ShieldCheck, ArrowRight, Globe, Eye, EyeOff } from 'lucide-react';

export default function SignIn() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('farmer');
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState('+27 82 555 0142');
  const [language, setLanguage] = useState('English');
  const [otp, setOtp] = useState(['4', '8', '2', '1', '9', '6']);
  const [loading, setLoading] = useState(false);

  // official fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfa, setMfa] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  const finishFarmer = () => {
    setSession({ portal: 'farmer', ...DEMO_FARMER });
    navigate('/app/home');
  };

  const sendOtp = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 700);
  };

  const verifyOtp = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); finishFarmer(); }, 700);
  };

  const officialSubmit = (e) => {
    e.preventDefault();
    if (attempts >= 5) { setError('Account locked after 5 failed attempts. Contact your administrator.'); return; }
    if (!email || !password || !mfa) { setError('All fields are required.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSession({ portal: 'admin', ...DEMO_OFFICIAL });
      navigate('/admin/dashboard');
    }, 800);
  };

  const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  return (
    <div className={`min-h-screen font-admin grid lg:grid-cols-[1.1fr_1fr]`} style={{ background: 'var(--ag-bg)' }}>
      {/* Left brand panel */}
      <section
        className="relative text-white p-8 lg:p-12 flex flex-col justify-between min-h-[260px] overflow-hidden"
        style={{ background: `linear-gradient(155deg, rgba(14,51,40,0.94), rgba(28,75,64,0.82) 55%, rgba(26,99,168,0.55)), url(${HERO_SIGNIN}) center/cover, #0e3328` }}
      >
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)', backgroundSize: '18px 18px', maskImage: 'linear-gradient(#000, transparent 75%)', WebkitMaskImage: 'linear-gradient(#000, transparent 75%)' }} />
        <div className="relative z-10 flex items-center gap-3 bg-white text-[#13221b] rounded-2xl py-2 px-4 w-fit shadow-lg">
          <img src={LOGO_URL} alt="Emfuleni Local Municipality" className="h-11" />
          <div>
            <b className="block text-[13px] leading-tight">Emfuleni Local Municipality</b>
            <span className="text-[11px]" style={{ color: '#52665a' }}>Agriculture &amp; Rural Development</span>
          </div>
        </div>
        <div className="relative z-10 max-w-md mt-8">
          <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold mb-4" style={{ background: '#ffffff1f', border: '1px solid #ffffff2e' }}>🌾 Farmer Portal · Agri Connect</span>
          <h1 className="text-3xl lg:text-[38px] font-light leading-[1.12] tracking-tight">
            One platform for every farmer, officer and service.
          </h1>
          <p className="opacity-85 mt-4 text-[13px] leading-relaxed">
            Register once, apply for permits, report problems and track every request in one place.
          </p>
          <ul className="mt-6 space-y-2.5 text-[13px]">
            {['Secure, role-based access', 'Available in English, isiZulu, Sesotho and more', 'POPIA-compliant, hosted in South Africa'].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="grid place-items-center w-5 h-5 rounded-full bg-white/20 text-[11px] font-bold">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <span className="relative z-10 text-[12px] opacity-70 mt-8">© 2026 Emfuleni Local Municipality</span>
      </section>

      {/* Right sign-in card */}
      <section className="grid place-items-center p-6">
        <div className="w-full max-w-[410px] rounded-[26px] p-8 shadow-2xl"
          style={{ background: 'var(--ag-card, #fff)' }}>
          <h2 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--ag-ink)' }}>Welcome to Agri Connect</h2>
          <p className="text-[13px] mt-1" style={{ color: 'var(--ag-mut)' }}>Sign in to continue</p>

          <div className="flex rounded-full p-1 my-5" style={{ background: 'var(--ag-bg)' }}>
            <button
              onClick={() => { setTab('farmer'); setStep(1); }}
              className="flex-1 py-2 rounded-full text-[13px] font-medium transition"
              style={tab === 'farmer' ? { background: 'var(--ag-g)', color: '#fff' } : { color: 'var(--ag-mut)' }}
            >Farmer / Agri-business</button>
            <button
              onClick={() => setTab('official')}
              className="flex-1 py-2 rounded-full text-[13px] font-medium transition"
              style={tab === 'official' ? { background: 'var(--ag-g)', color: '#fff' } : { color: 'var(--ag-mut)' }}
            >Municipal Official</button>
          </div>

          {tab === 'farmer' && (
            <div>
              {step === 1 && (
                <div>
                  <label className="block text-[12px] font-medium mt-1 mb-1.5" style={{ color: 'var(--ag-ink)' }}>Mobile number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
                    <input
                      className="w-full border rounded-xl py-3 pl-10 pr-3 text-[14px]"
                      style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                      value={mobile}
                      inputMode="tel"
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                  <label className="block text-[12px] font-medium mt-3.5 mb-1.5" style={{ color: 'var(--ag-ink)' }}>Language</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
                    <select
                      className="w-full border rounded-xl py-3 pl-10 pr-3 text-[14px] appearance-none"
                      style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={sendOtp}
                    disabled={loading}
                    className="w-full mt-5 rounded-full py-3.5 font-semibold text-white disabled:opacity-60 transition flex items-center justify-center gap-2"
                    style={{ background: 'var(--ag-g)' }}
                  >
                    {loading ? 'Sending…' : <>Send one-time PIN <ArrowRight className="w-4 h-4" /></>}
                  </button>
                  <div className="flex justify-between text-[12px] mt-3">
                    <span style={{ color: 'var(--ag-mut)' }}>New here?</span>
                    <button onClick={() => navigate('/register')} className="font-medium" style={{ color: 'var(--ag-or)' }}>Register as a farmer</button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <label className="block text-[12px] font-medium mt-1" style={{ color: 'var(--ag-ink)' }}>
                    Enter the 6-digit PIN sent to your phone
                  </label>
                  <div className="flex gap-2 mt-3">
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        maxLength={1}
                        value={d}
                        inputMode="numeric"
                        onChange={(e) => {
                          const next = [...otp];
                          next[i] = e.target.value.replace(/\D/g, '');
                          setOtp(next);
                        }}
                        className="w-full min-w-0 text-center text-xl font-semibold border rounded-xl py-3"
                        style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={verifyOtp}
                    disabled={loading}
                    className="w-full mt-5 rounded-full py-3.5 font-semibold text-white disabled:opacity-60 transition"
                    style={{ background: 'var(--ag-g)' }}
                  >
                    {loading ? 'Verifying…' : 'Verify & continue'}
                  </button>
                  <div className="flex justify-between text-[12px] mt-3">
                    <button onClick={() => setStep(1)} className="font-medium" style={{ color: 'var(--ag-or)' }}>Change number</button>
                    <button onClick={sendOtp} className="font-medium" style={{ color: 'var(--ag-or)' }}>Resend PIN</button>
                  </div>
                  <p className="text-[11px] text-center mt-3" style={{ color: 'var(--ag-mut)' }}>Demo prototype – any PIN works.</p>
                </div>
              )}
            </div>
          )}

          {tab === 'official' && (
            <form onSubmit={officialSubmit}>
              {attempts >= 5 && (
                <div className="rounded-xl px-3 py-2.5 text-[12px] mb-3" style={{ background: '#fadcd8', color: '#a3281b' }}>
                  Account locked after 5 failed attempts. Contact your administrator.
                </div>
              )}
              {error && attempts < 5 && (
                <div className="rounded-xl px-3 py-2.5 text-[12px] mb-3" style={{ background: '#fadcd8', color: '#a3281b' }}>{error}</div>
              )}
              <label className="block text-[12px] font-medium mt-1 mb-1.5" style={{ color: 'var(--ag-ink)' }}>Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
                <input
                  type="email"
                  placeholder="name@emfuleni.gov.za"
                  className="w-full border rounded-xl py-3 pl-10 pr-3 text-[14px]"
                  style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <label className="block text-[12px] font-medium mt-3.5 mb-1.5" style={{ color: 'var(--ag-ink)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••••"
                  className="w-full border rounded-xl py-3 pl-10 pr-10 text-[14px]"
                  style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--ag-mut)' }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <label className="block text-[12px] font-medium mt-3.5 mb-1.5" style={{ color: 'var(--ag-ink)' }}>Authenticator code (MFA)</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--ag-mut)' }} />
                <input
                  inputMode="numeric"
                  placeholder="6-digit code"
                  className="w-full border rounded-xl py-3 pl-10 pr-3 text-[14px]"
                  style={{ borderColor: 'var(--ag-line)', background: 'var(--ag-bg)', color: 'var(--ag-ink)' }}
                  value={mfa}
                  onChange={(e) => setAttempts(0) || setMfa(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 rounded-full py-3.5 font-semibold text-white disabled:opacity-60 transition"
                style={{ background: 'var(--ag-g)' }}
              >
                {loading ? 'Signing in…' : 'Sign in securely'}
              </button>
              <div className="flex justify-between text-[12px] mt-3">
                <button type="button" className="font-medium" style={{ color: 'var(--ag-or)' }}>Forgot password?</button>
                <span style={{ color: 'var(--ag-mut)' }}>Access is role-based</span>
              </div>
            </form>
          )}

          <p className="text-[11px] text-center mt-5" style={{ color: 'var(--ag-mut)' }}>🔒 Protected under POPIA · Data hosted in South Africa</p>
        </div>
      </section>
    </div>
  );
}