import React from 'react';
import { useEntityList, AdminCard, Pill, MiniStat, StatusBadge, PageHead, adminToast, Bar } from './_admin';

export default function DiseaseControl() {
  const inc = useEntityList('Incident', {}, '-created_date');
  const cz = useEntityList('ControlZone', {}, '-created_date');
  const vc = useEntityList('VaccinationCampaign', {}, '-created_date');
  const loading = inc.loading && cz.loading && vc.loading;
  const incidents = inc.items;
  const zones = cz.items;
  const vax = vc.items;

  const openCases = loading ? '—' : incidents.length;
  const confirmed = loading ? '—' : incidents.filter(i => ['investigating', 'confirmed'].includes(i.status)).length;
  const campaign = vax[0];

  const sevColor = { critical: '#e2471b', high: '#e2471b', warning: '#f2b705', pending: '#9aa', low: '#9aa' };

  return (
    <>
      <PageHead title="Disease & Pest Control Centre" sub="State vets · outbreak management" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MiniStat label="Open cases" value={openCases} />
        <MiniStat label="Confirmed" value={confirmed} note="FMD suspected: 1" />
        <MiniStat label="Control zones" value={loading ? '—' : zones.length} note="25 km radius" />
        <MiniStat label="Vaccination coverage" value={loading ? '—' : (campaign ? Math.round(campaign.doses_administered / campaign.doses_target * 100) + '%' : '78%')} note="Target 90%" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1">
        <AdminCard title="Outbreak map" right={<Pill onClick={() => adminToast('Control zone defined – alerts queued for 214 farmers')}>Declare control zone</Pill>}>
          <svg viewBox="0 0 600 330" style={{ width: '100%', height: 'auto', borderRadius: 16, background: '#dbe8df' }}>
            <path d="M40 60L260 30 420 70 560 160 500 290 280 310 90 270z" fill="#bcd5c3" stroke="#2f6f5a" strokeWidth="2" />
            <circle cx="330" cy="150" r="96" fill="#e2471b22" stroke="#e2471b" strokeWidth="2" strokeDasharray="7 5" />
            <g fontSize="11" fill="#2a3a32">
              <text x="200" y="75">Vereeniging</text><text x="110" y="220">Vanderbijlpark</text>
              <text x="400" y="240">Sebokeng</text><text x="440" y="105">Evaton</text>
            </g>
            <g stroke="#fff" strokeWidth="2">
              <circle cx="320" cy="140" r="8" fill="#e2471b" /><circle cx="355" cy="170" r="7" fill="#e2471b" />
              <circle cx="300" cy="175" r="6" fill="#f2b705" /><circle cx="450" cy="130" r="6" fill="#2f6f5a" />
              <circle cx="240" cy="230" r="6" fill="#2f6f5a" />
            </g>
          </svg>
          <div className="flex gap-4 mt-2.5 text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>
            <span className="flex items-center gap-1.5"><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#e2471b' }} />Confirmed/suspected</span>
            <span className="flex items-center gap-1.5"><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#f2b705' }} />Under investigation</span>
            <span className="flex items-center gap-1.5"><i style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#2f6f5a' }} />Cleared</span>
          </div>
        </AdminCard>
        <AdminCard title="Incident inbox">
          {loading && <div className="py-6 text-center text-[13px]" style={{ color: 'var(--ag-mut)' }}>Loading incidents…</div>}
          {incidents.map(i => (
            <div key={i.id} className="flex items-center gap-3 py-2.5 border-b last:border-0" style={{ borderColor: 'var(--ag-line)' }}>
              <i className="w-2.5 h-2.5 rounded-full flex-none" style={{ background: sevColor[i.severity] || '#9aa' }} />
              <div className="flex-1 min-w-0">
                <b className="block text-[13px] font-medium" style={{ color: 'var(--ag-ink)' }}>{i.title}</b>
                <span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{i.area} · {i.quantity_affected} · {i.assigned_officer}</span>
              </div>
              <StatusBadge text={i.severity} />
            </div>
          ))}
          {campaign && (
            <div className="mt-3.5">
              <b className="text-[12px]">Vaccination campaign: {campaign.disease}</b>
              <div className="my-1.5"><Bar percent={Math.round(campaign.doses_administered / campaign.doses_target * 100)} /></div>
              <span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{campaign.doses_administered.toLocaleString()} of {campaign.doses_target.toLocaleString()} animals vaccinated</span>
            </div>
          )}
        </AdminCard>
      </div>
    </>
  );
}