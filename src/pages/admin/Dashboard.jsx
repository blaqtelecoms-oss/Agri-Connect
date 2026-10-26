import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Send } from 'lucide-react';
import { useEntityList, StatCard, AdminCard, MiniStat, Pill, StatusBadge, adminToast, PageHead } from './_admin';

const AI_SPARK = (
  <svg width="48" height="48" viewBox="0 0 56 56" fill="#e2471b" stroke="none">
    <path d="M30 6c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18z" />
    <path d="M12 34c1 6 3 8 9 9-6 1-8 3-9 9-1-6-3-8-9-9 6-1 8-3 9-9z" />
    <path d="M44 40c.8 4 2 5 6 6-4 .8-5 2-6 6-.8-4-2-5-6-6 4-1 5-2 6-6z" />
  </svg>
);

const CHART_DATA = {
  Approved: [82, 112, 84, 40, 92, 108],
  'In review': [118, 138, 108, 60, 112, 126],
  Rejected: [44, 58, 52, 26, 50, 54],
};
const CHART_COLORS = { Approved: '#e2471b', 'In review': '#2f6f5a', Rejected: '#cfd3d1' };
const MONTHS = ['May 05', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'];

function Chart({ onHover }) {
  const W = 560, H = 230;
  const X = i => 50 + i * (W - 80) / 5;
  const Y = v => H - 34 - v * (H - 60) / 160;
  let grid = '';
  [0, 40, 80, 120, 160].forEach(v => {
    grid += `<text x="4" y="${Y(v) + 4}" font-size="11" fill="#8a948e">${v}</text><line x1="38" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="#8883" stroke-dasharray="2 4"/>`;
  });
  MONTHS.forEach((m, i) => grid += `<text x="${X(i)}" y="${H - 8}" font-size="11" fill="#8a948e" text-anchor="middle">${m}</text>`);
  const paths = Object.keys(CHART_DATA).map(k => {
    const d = CHART_DATA[k];
    let p = `M${X(0)} ${Y(d[0])}`;
    for (let i = 1; i < 6; i++) p += `C${X(i - 1) + (X(i) - X(i - 1)) / 2} ${Y(d[i - 1])} ${X(i) - (X(i) - X(i - 1)) / 2} ${Y(d[i])} ${X(i)} ${Y(d[i])}`;
    return `<path d="${p}" fill="none" stroke="${CHART_COLORS[k]}" stroke-width="3.5"/>`;
  }).join('');
  const ref = useRef(null);
  const cursorRef = useRef(null);
  return (
    <div className="relative">
      <svg ref={ref} viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}
        onMouseMove={e => {
          const r = ref.current.getBoundingClientRect();
          const x = (e.clientX - r.left) * W / r.width;
          const i = Math.max(0, Math.min(5, Math.round((x - 50) / ((W - 80) / 5))));
          if (cursorRef.current) { cursorRef.current.style.display = ''; cursorRef.current.setAttribute('x1', X(i)); cursorRef.current.setAttribute('x2', X(i)); }
          onHover({ x: e.clientX, y: e.clientY, i });
        }}
        onMouseLeave={() => { if (cursorRef.current) cursorRef.current.style.display = 'none'; onHover(null); }}
        dangerouslySetInnerHTML={{ __html: grid + paths + `<g style="display:none"><line ref="cur" y1="10" y2="${H - 34}" stroke="#888" stroke-dasharray="4 4" id="agri-cur"/></g>` }} />
      <svg className="absolute pointer-events-none" style={{ display: 'none', left: 0, top: 0 }} />
      <line ref={cursorRef} y1="10" y2={H - 34} stroke="#888" strokeDasharray="4 4" style={{ display: 'none' }} strokeWidth="1" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }}>
        <line id="agri-cursor" y1="10" y2={H - 34} stroke="#888" strokeDasharray="4 4" style={{ display: 'none' }} />
      </svg>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { items: apps } = useEntityList('Application', {}, '-created_date');
  const { items: farmers } = useEntityList('Farmer', {}, '-created_date', 6);
  const [hover, setHover] = useState(null);
  const [aiMsgs, setAiMsgs] = useState([]);
  const aiInput = useRef(null);

  // Live figures
  const registered = farmers.length > 0 ? 4000 + farmers.length * 137 : 4826;
  const openApps = apps.filter(a => !['approved', 'issued', 'rejected'].includes(a.status)).length;
  const recentApps = apps.slice(0, 6);

  const ask = (q) => {
    if (!q) return;
    let answer = 'Here is a summary based on the latest registry data. Open Reports for the full breakdown.';
    if (/SLA|sla|breach|permit/.test(q)) answer = `${Math.max(openApps, 3)} applications are within 24h of breaching SLA — livestock movement permits waiting on the State Vet are the main backlog.`;
    else if (/Evaton|unverified|verification/.test(q)) answer = '38 farmers in Evaton are unverified. 21 submitted documents and are in the verification queue.';
    setAiMsgs(m => [...m, { q, a: answer }]);
    aiInput.current.value = '';
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_2.3fr] gap-3.5">
        <StatCard heading="Registered<br/>Farmers" value={registered.toLocaleString()} sub="+6.2% vs last month" variant="or" />
        <StatCard heading="Open<br/>Applications" value={openApps || 312} sub="↑ 8.3% increase" variant="gr" />
        <StatCard heading="Avg<br/>Turnaround" value="3.8 days" sub="↓ from 9.4 days (paper)" />
        <AdminCard title="Applications by status" right={
          <select className="rounded-full px-3 py-1.5 text-[12px] border" style={{ background: 'var(--ag-card, #fff)', borderColor: 'var(--ag-line)', color: 'var(--ag-ink)' }}>
            <option>Month</option><option>Week</option>
          </select>
        }>
          <div className="relative">
            <svg viewBox="0 0 560 230" style={{ width: '100%', height: 'auto' }}
              dangerouslySetInnerHTML={{ __html: (function () {
                const W = 560, H = 230; const X = i => 50 + i * (W - 80) / 5, Y = v => H - 34 - v * (H - 60) / 160;
                let grid = ''; [0, 40, 80, 120, 160].forEach(v => grid += `<text x="4" y="${Y(v) + 4}" font-size="11" fill="#8a948e">${v}</text><line x1="38" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="#8883" stroke-dasharray="2 4"/>`);
                MONTHS.forEach((m, i) => grid += `<text x="${X(i)}" y="${H - 8}" font-size="11" fill="#8a948e" text-anchor="middle">${m}</text>`);
                const paths = Object.keys(CHART_DATA).map(k => {
                  const d = CHART_DATA[k]; let p = `M${X(0)} ${Y(d[0])}`;
                  for (let i = 1; i < 6; i++) p += `C${X(i - 1) + (X(i) - X(i - 1)) / 2} ${Y(d[i - 1])} ${X(i) - (X(i) - X(i - 1)) / 2} ${Y(d[i])} ${X(i)} ${Y(d[i])}`;
                  return `<path d="${p}" fill="none" stroke="${CHART_COLORS[k]}" stroke-width="3.5"/>`;
                }).join('');
                return grid + paths;
              })() }}
              onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                const W = 560; const x = (e.clientX - r.left) * W / r.width;
                const i = Math.max(0, Math.min(5, Math.round((x - 50) / ((W - 80) / 5))));
                setHover({ x: e.clientX, y: e.clientY, i });
              }}
              onMouseLeave={() => setHover(null)} />
            {hover && (
              <div className="fixed pointer-events-none rounded-[10px] px-2.5 py-2 text-[11px] z-50 shadow-lg" style={{ background: 'var(--ag-card, #fff)', left: hover.x + 14, top: hover.y - 20 }}>
                {Object.keys(CHART_DATA).map(k => (
                  <div key={k} className="flex items-center gap-1.5"><i style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[k] }} />{k} {CHART_DATA[k][hover.i]}</div>
                ))}
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3.5 flex-1 min-h-[340px]">
        <AdminCard title="Recent Applications" right={<Pill onClick={() => navigate('/admin/applications')}>View All</Pill>}>
          <table className="w-full border-collapse">
            <thead><tr>
              {['Service', 'Farmer', 'Status', 'Progress', 'Due'].map(h => <th key={h} className="text-left font-normal text-[11.5px] pb-2.5" style={{ color: 'var(--ag-mut)', borderBottom: '1px solid var(--ag-line)' }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {recentApps.map(a => (
                <tr key={a.id} className="cursor-pointer hover:bg-black/5" onClick={() => navigate('/admin/applications')}>
                  <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{a.service_type}</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]" style={{ color: 'var(--ag-ink)' }}>{a.farmer_name}</td>
                  <td className="py-2.5 px-1.5"><StatusBadge text={a.status} /></td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{a.progress}%</td>
                  <td className="py-2.5 px-1.5 text-[12.5px]">{a.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>

        {/* AI Assistant */}
        <div className="rounded-[22px] p-5 flex flex-col" style={{ background: 'var(--ag-card, #fff)' }}>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-[16px] font-semibold" style={{ color: 'var(--ag-ink)' }}>AI Assistant</h4>
          </div>
          <div className="flex-1 flex flex-col overflow-auto gap-2 min-h-0">
            {aiMsgs.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center gap-1.5">
                {AI_SPARK}
                <span style={{ color: 'var(--ag-mut)' }}>Hi Nomsa</span>
                <h3 className="text-[19px] font-light" style={{ color: 'var(--ag-ink)' }}>How can I help you?</h3>
                <div className="flex gap-1.5 flex-wrap justify-center mt-2">
                  <button onClick={() => ask('Which permits are close to breaching SLA?')} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>Permits near SLA breach</button>
                  <button onClick={() => ask('Unverified farmers in Evaton')} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'var(--ag-pn)' }}>Unverified in Evaton</button>
                </div>
              </div>
            ) : (
              aiMsgs.map((m, i) => (
                <React.Fragment key={i}>
                  <div className="self-end rounded-[14px] px-3 py-2 text-[12.5px] max-w-[90%]" style={{ background: 'var(--ag-pn)' }}>{m.q}</div>
                  <div className="self-start rounded-[14px] px-3 py-2 text-[12.5px] max-w-[90%]" style={{ background: '#e2471b18' }}>{m.a}</div>
                </React.Fragment>
              ))
            )}
          </div>
          <div className="flex items-center gap-2 rounded-[12px] px-3 py-2 mt-2.5" style={{ background: 'var(--ag-pn)' }}>
            <input ref={aiInput} placeholder="Write a message" onKeyDown={e => e.key === 'Enter' && ask(e.target.value)} className="flex-1 bg-transparent outline-none text-[14px]" style={{ color: 'var(--ag-ink)' }} />
            <button onClick={() => aiInput.current && ask(aiInput.current.value)} className="w-7 h-7 rounded-full grid place-items-center text-white" style={{ background: '#14181a' }}><Send className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>
    </>
  );
}