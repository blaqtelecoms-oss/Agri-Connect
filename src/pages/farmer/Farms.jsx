import React, { useState } from 'react';
import { Plus, Leaf, PawPrint, FileText } from 'lucide-react';
import { FARM_THUMBS } from '@/lib/agriAssets';
import { useFarmerFarms, FarmerCard, PageWrap, PageHeader, showToast, DCard, DSectionHead, DChip } from './_shared';

const comodityMap = {
  'De Deur Smallholding': {
    ha: '12.4 ha', tenure: 'Leased', water: 'Borehole', sub: 'Crops & Livestock',
    items: [['Maize (summer)', '6 ha · Planted Oct', 'crop'], ['Spinach', '2 ha · Harvest Nov', 'crop'], ['Nguni cattle', '18 head · Tagged', 'stock'], ['Goats', '24 head · Vaccinated', 'stock']],
  },
  'Walkerville Plot 14': {
    ha: '4.8 ha', tenure: 'Owned', water: 'Municipal', sub: 'Vegetables',
    items: [['Cabbage', '2 ha · Harvest Dec', 'crop'], ['Tomatoes', '1.5 ha · Tunnel', 'crop'], ['Layer hens', '350 birds', 'stock']],
  },
};

function DesktopFarmMap() {
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

export default function Farms() {
  const { farms, loading } = useFarmerFarms();
  const [selected, setSelected] = useState(0);
  const farm = farms[selected];
  const m = farm ? (comodityMap[farm.name] || {}) : {};

  return (
    <>
      {/* MOBILE */}
      <div className="lg:hidden">
        <PageWrap>
          <PageHeader title="My Farms" subtitle="Manage your registered properties, commodities and documents."
            actions={<button onClick={() => showToast('Add farm: pin location or draw boundary')} className="w-10 h-10 rounded-full grid place-items-center shadow-sm border" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-g)', borderColor: 'var(--ag-line)' }}><Plus className="w-5 h-5" /></button>}
          />

          <div className="rounded-[22px] p-4 mt-4 text-white" style={{ background: 'linear-gradient(135deg,#1d5c45,#2f8a66)' }}>
            <div className="flex items-center justify-between">
              <b>Verified Farmer</b>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20">Profile 85%</span>
            </div>
            <div className="text-[12px] opacity-90 mt-1">Upload your ID copy to reach 100% and unlock grants.</div>
            <div className="flex gap-1 mt-2">
              {[1,1,1,1,1,1,1,1,1,0].map((f,i) => <i key={i} className="flex-1 h-1.5 rounded-full" style={{ background: f ? '#fff' : 'rgba(255,255,255,0.25)' }} />)}
            </div>
          </div>

          <h2 className="text-[17px] font-semibold mt-5">Choose your farm</h2>
          {loading && <div className="py-8 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>Loading farms…</div>}
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 mt-2 pb-1">
            {farms.map((f, i) => (
              <button key={f.id} onClick={() => setSelected(i)} className="flex-none w-[150px] rounded-[18px] overflow-hidden text-left shadow-sm border-2 transition"
                style={{ background: 'var(--ag-card, #fff)', borderColor: i === selected ? 'var(--ag-g)' : 'transparent' }}>
                <div className="h-20 bg-cover bg-center" style={{ backgroundImage: `url(${FARM_THUMBS[i % FARM_THUMBS.length]})` }} />
                <div className="p-2"><b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>{f.name}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{(comodityMap[f.name] || {}).sub || f.suburb || ''}</span></div>
              </button>
            ))}
          </div>

          <div className="h-[170px] rounded-[18px] overflow-hidden mt-4" style={{ background: '#cfe3d4' }}>
            <svg viewBox="0 0 300 170" className="w-full h-full" style={{ stroke: 'none' }}>
              <rect width="300" height="170" fill="#c9dfcf" />
              <path d="M0 120C60 100 120 140 300 90V170H0z" fill="#a9d0e3" />
              <path d="M60 30L170 18 235 60 205 125 90 135 45 85z" fill="#2d7a5c55" stroke="#1d5c45" strokeWidth="2.5" strokeDasharray="6 4" />
              <circle cx="140" cy="76" r="7" fill="#c0392b" />
              <circle cx="140" cy="76" r="14" fill="#c0392b33" />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            {farm && [
              { l: 'Size', v: m.ha || (farm.size_ha + ' ha') },
              { l: 'Tenure', v: m.tenure || farm.tenure },
              { l: 'Water', v: m.water || farm.water_source },
            ].map((x) => (
              <div key={x.l} className="rounded-[14px] p-2 text-[11px]" style={{ background: 'var(--ag-gl)', color: 'var(--ag-mut)' }}>{x.l}<b className="block text-[13px]" style={{ color: 'var(--ag-ink)' }}>{x.v}</b></div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-0">
            <div>
              <h2 className="text-[17px] font-semibold mt-5">Commodities</h2>
              <FarmerCard className="mt-2">
                {farm && (m.items || []).map((c, i) => {
                  const I = c[2] === 'crop' ? Leaf : PawPrint;
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                      <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><I className="w-5 h-5" /></span>
                      <div><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{c[0]}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{c[1]}</span></div>
                    </div>
                  );
                })}
              </FarmerCard>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold mt-5">Document vault</h2>
              <FarmerCard className="mt-2">
                {[
                  { t: 'South African ID copy', s: 'Verified', chip: 'Valid', v: 'c-g' },
                  { t: 'Lease agreement', s: 'Expires 14 Mar 2028', chip: 'Valid', v: 'c-g' },
                  { t: 'Livestock movement permit', s: 'Expires in 12 days', chip: 'Renew', v: 'c-y' },
                ].map((d) => (
                  <div key={d.t} className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
                    <span className="w-[42px] h-[42px] rounded-[14px] grid place-items-center flex-none" style={{ background: 'var(--ag-gl)', color: 'var(--ag-g)' }}><FileText className="w-5 h-5" /></span>
                    <div><b className="block text-[13px] font-semibold" style={{ color: 'var(--ag-ink)' }}>{d.t}</b><span className="text-[12px]" style={{ color: 'var(--ag-mut)' }}>{d.s}</span></div>
                    <span className={`ml-auto text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${d.v==='c-g'?'bg-[#d9f0e3] text-[#15693f]':'bg-[#fdf0c4] text-[#8a6500]'}`}>{d.chip}</span>
                  </div>
                ))}
              </FarmerCard>
            </div>
          </div>
        </PageWrap>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        {/* profile banner */}
        <DCard className="flex justify-between items-center" style={{ border: 0, background: 'linear-gradient(135deg,#0e3b2c,#1f7a57)', color: '#fff' }}>
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold font-jk" style={{ background: '#ffffff1f', border: '1px solid #ffffff2e' }}>✓ Verified Farmer</span>
            <h3 className="font-fraunces mt-2" style={{ fontSize: 26, fontWeight: 500 }}>Profile 85% complete</h3>
            <p className="text-[13px] opacity-85 font-jk mt-0.5">Upload your ID copy to reach 100% and unlock grant applications.</p>
          </div>
          <button onClick={() => showToast('Upload dialog opened')} className="rounded-full px-5 py-2.5 font-bold text-[13px] font-jk flex items-center gap-2 flex-none" style={{ background: 'linear-gradient(135deg,#dcb85e,#b98d2c)', color: '#2b2108' }}><Plus className="w-4 h-4" /> Upload ID copy</button>
        </DCard>

        <div className="grid mt-5" style={{ gridTemplateColumns: '1.65fr 1fr', gap: 20 }}>
          <div className="min-w-0">
            <DCard>
              <DSectionHead title="Farm map" right={
                <button onClick={() => showToast('Add farm: pin location or draw boundary')} className="rounded-full px-4 py-2 text-[12px] font-semibold font-jk flex items-center gap-1.5" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><Plus className="w-4 h-4" /> Add farm</button>
              } />
              {loading && <div className="py-10 text-center text-[13px] font-jk" style={{ color: 'var(--ac-mu)' }}>Loading farms…</div>}
              {farm && (
                <>
                  <div className="flex flex-wrap gap-2 mb-3.5">
                    {farms.map((f, i) => (
                      <button key={f.id} onClick={() => setSelected(i)} className="rounded-full px-3.5 py-1.5 text-[12px] font-semibold font-jk"
                        style={i === selected ? { background: 'var(--ac-gd)', color: '#fff' } : { background: 'var(--ac-cd)', border: '1px solid var(--ac-ln)', color: 'var(--ac-ink)' }}>{f.name}</button>
                    ))}
                  </div>
                  <DesktopFarmMap />
                  <div className="grid grid-cols-4 gap-2.5 mt-3.5">
                    {[['Size', m.ha || (farm.size_ha + ' ha')], ['Tenure', m.tenure || farm.tenure], ['Water', m.water || farm.water_source], ['Status', 'Verified']].map(x => (
                      <div key={x[0]} className="rounded-[14px] px-3 py-2.5 text-[11.5px] font-jk" style={{ background: 'var(--ac-gl)', color: 'var(--ac-mu)' }}>{x[0]}<b className="block text-[14px]" style={{ color: x[0] === 'Status' ? 'var(--ac-g)' : 'var(--ac-ink)' }}>{x[1]}</b></div>
                    ))}
                  </div>
                </>
              )}
            </DCard>
          </div>

          <div className="flex flex-col gap-5 min-w-0">
            <DCard>
              <DSectionHead title="Commodities" />
              {farm && (m.items || []).map((c, i) => {
                const I = c[2] === 'crop' ? Leaf : PawPrint;
                return (
                  <div key={i} className="flex gap-3 items-center py-3 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
                    <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><I className="w-[18px] h-[18px]" /></span>
                    <div><b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>{c[0]}</b><span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{c[1]}</span></div>
                  </div>
                );
              })}
            </DCard>

            <DCard>
              <DSectionHead title="Document vault" />
              {[
                { t: 'South African ID copy', s: 'Verified', chip: 'Valid', v: 'c-g' },
                { t: 'Lease agreement', s: 'Expires 14 Mar 2028', chip: 'Valid', v: 'c-g' },
                { t: 'Movement permit', s: 'Expires in 12 days', chip: 'Renew', v: 'c-y' },
              ].map(d => (
                <div key={d.t} className="flex gap-3 items-center py-3 border-b last:border-0" style={{ borderColor: 'var(--ac-ln)' }}>
                  <span className="w-10 h-10 rounded-[13px] grid place-items-center flex-none" style={{ background: 'var(--ac-gl)', color: 'var(--ac-g)' }}><FileText className="w-[18px] h-[18px]" /></span>
                  <div><b className="block text-[13px] font-semibold font-jk" style={{ color: 'var(--ac-ink)' }}>{d.t}</b><span className="text-[11.5px] font-jk" style={{ color: 'var(--ac-mu)' }}>{d.s}</span></div>
                  <DChip text={d.chip} variant={d.v} />
                </div>
              ))}
            </DCard>
          </div>
        </div>
      </div>
    </>
  );
}