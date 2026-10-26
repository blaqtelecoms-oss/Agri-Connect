import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { useEntityList, AdminCard, MiniStat, PageHead } from './_admin';

const EMFULENI_CENTER = [-26.67, 27.93];

const STATUS_COLORS = {
  verified: '#1f7a57',
  pending: '#1a63a8',
  changes_requested: '#b96a00',
  rejected: '#b3261e',
};

// Sample locations stand in only while the registry returns no records (the
// data backend is not connected). Live Farmer/Farm entities always win.
const SAMPLE_POINTS = [
  { lat: -26.6741, lng: 27.9318, farmer: 'Thabo Mokoena', code: 'FRM-EMF-00231', area: 'De Deur', farm: 'Mokoena Smallholding', size: 4.2, commodities: 'Vegetables, poultry', status: 'verified' },
  { lat: -26.6731, lng: 27.9261, farmer: 'Naledi Dlamini', code: 'FRM-EMF-00188', area: 'Vereeniging', farm: 'Dlamini Vegetable Plot', size: 2.5, commodities: 'Vegetables', status: 'verified' },
  { lat: -26.6467, lng: 27.8739, farmer: 'Elizabeth van Wyk', code: 'FRM-EMF-00094', area: 'Three Rivers', farm: 'Van Wyk Nursery', size: 5.5, commodities: 'Seedlings, herbs', status: 'verified' },
  { lat: -26.7106, lng: 27.8338, farmer: 'Sipho Ndlovu', code: 'FRM-EMF-00342', area: 'Vanderbijlpark', farm: 'Ndlovu Poultry Farm', size: 6.0, commodities: 'Poultry, eggs', status: 'pending' },
  { lat: -26.6872, lng: 27.8747, farmer: 'David Khumalo', code: 'FRM-EMF-00123', area: 'Sharpeville', farm: 'Khumalo Livestock', size: 22, commodities: 'Cattle, sheep', status: 'verified' },
  { lat: -26.6147, lng: 27.8706, farmer: 'Portia Sithole', code: 'FRM-EMF-00401', area: 'Boipatong', farm: 'Sithole Market Garden', size: 1.8, commodities: 'Spinach, maize', status: 'changes_requested' },
  { lat: -26.6499, lng: 27.8536, farmer: 'Grace Mahlangu', code: 'FRM-EMF-00365', area: 'Bophelong', farm: 'Mahlangu Community Farm', size: 2.2, commodities: 'Vegetables', status: 'verified' },
  { lat: -26.5751, lng: 27.8404, farmer: 'Johannes Mabena', code: 'FRM-EMF-00275', area: 'Sebokeng', farm: 'Mabena Co-op Garden', size: 3.1, commodities: 'Vegetables', status: 'pending' },
  { lat: -26.5228, lng: 27.8494, farmer: 'Samuel Nkosi', code: 'FRM-EMF-00318', area: 'Evaton', farm: 'Nkosi Goat Project', size: 7.3, commodities: 'Goats', status: 'pending' },
  { lat: -26.7986, lng: 27.9658, farmer: 'Maria Botha', code: 'FRM-EMF-00057', area: 'Walkerville', farm: 'Botha Boerdery', size: 84, commodities: 'Maize, cattle', status: 'verified' },
  { lat: -26.8890, lng: 28.1270, farmer: 'Pieter Steyn', code: 'FRM-EMF-00021', area: 'Vaal Marina', farm: 'Steyn Cattle Ranch', size: 120, commodities: 'Cattle, lucerne', status: 'verified' },
];

// Zoom the map to fit every mapped location whenever the point set changes.
function FitBounds({ points }) {
  const map = useMap();
  React.useEffect(() => {
    if (points.length > 1) {
      map.fitBounds(points.map(p => [p.lat, p.lng]), { padding: [48, 48], maxZoom: 12 });
    }
  }, [points.length]);
  return null;
}

// Fly to a farmer whenever one is selected from the list or a marker.
function MapFocus({ selected, points }) {
  const map = useMap();
  React.useEffect(() => {
    if (selected != null && points[selected]) {
      map.flyTo([points[selected].lat, points[selected].lng], 13);
    }
  }, [selected]);
  return null;
}

export default function FarmersMap() {
  const { items: farmers, sample: farmersSample } = useEntityList('Farmer', {}, '-created_date', 500);
  const { items: farms, sample: farmsSample } = useEntityList('Farm', {}, '-created_date', 500);
  const [selected, setSelected] = useState(null);

  const live = (farmers.length > 0 && !farmersSample) || (farms.length > 0 && !farmsSample);
  const points = React.useMemo(() => {
    if (!live) return SAMPLE_POINTS;
    return farms
      .filter(f => f.lat != null && f.lng != null)
      .map(f => {
        const farmer = farmers.find(x => x.farmer_code === f.farmer_id);
        return {
          lat: f.lat,
          lng: f.lng,
          farmer: farmer?.name || f.farmer_name || 'Unlinked farm',
          code: farmer?.farmer_code || f.farmer_id || '—',
          area: farmer?.area || f.suburb || 'Emfuleni',
          farm: f.name,
          size: f.size_ha,
          commodities: f.primary_commodities,
          status: farmer?.verification_status || 'pending',
        };
      });
  }, [live, farmers, farms]);

  const areas = [...new Set(points.map(p => p.area))].length;
  const verified = points.filter(p => p.status === 'verified').length;
  const registered = live ? farmers.length : points.length;

  const focus = (i) => setSelected(i);

  return (
    <>
      <PageHead title="Farmer Map" sub={live ? 'Live registry locations' : 'Sample locations'} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <MiniStat label="Registered farmers" value={registered} />
        <MiniStat label="Farms mapped" value={points.length} />
        <MiniStat label="Areas covered" value={areas} />
        <MiniStat label="Verified on map" value={verified} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3.5 flex-1 min-h-[540px]">
        <div className="relative rounded-[22px] overflow-hidden border" style={{ borderColor: 'var(--ag-line)', background: '#e8efe9' }}>
          <MapContainer center={EMFULENI_CENTER} zoom={10} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds points={points} />
            <MapFocus selected={selected} points={points} />
            {points.map((p, i) => (
              <CircleMarker key={`${p.code}-${i}`} center={[p.lat, p.lng]} radius={selected === i ? 10 : 7}
                pathOptions={{ color: '#fff', weight: 2, fillColor: STATUS_COLORS[p.status] || STATUS_COLORS.pending, fillOpacity: 0.95 }}
                eventHandlers={{ click: () => focus(i) }}>
                <Tooltip direction="top" offset={[0, -6]}>{p.farmer}</Tooltip>
                <Popup>
                  <div className="text-[13px]">
                    <b>{p.farmer}</b>
                    <div style={{ color: '#667' }}>{p.code} · {p.area}</div>
                    <div style={{ color: '#667' }}>{p.farm}{p.size ? ` · ${p.size} ha` : ''}</div>
                    {p.commodities && <div style={{ color: '#667' }}>{p.commodities}</div>}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
          {!live && (
            <div className="absolute top-3 left-3 px-3.5 py-2 rounded-full text-[12px] font-medium" style={{ background: '#14181a', color: '#fff', zIndex: 1000 }}>
              Sample locations — live registry data appears once the data backend is connected
            </div>
          )}
          {points.length === 0 && (
            <div className="absolute inset-0 grid place-items-center" style={{ zIndex: 600 }}>
              <div className="px-4 py-3 rounded-2xl text-[13px]" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)', boxShadow: '0 12px 30px rgba(10,40,30,0.15)' }}>
                No geolocated farms in the registry yet.
              </div>
            </div>
          )}
          <div className="absolute bottom-3 left-3 px-3.5 py-2.5 rounded-[14px] text-[11.5px] flex items-center gap-3 flex-wrap" style={{ background: 'var(--ag-card, #fff)', color: 'var(--ag-ink)', boxShadow: '0 8px 20px rgba(10,40,30,0.15)', zIndex: 600 }}>
            {Object.entries(STATUS_COLORS).map(([k, c]) => (
              <span key={k} className="flex items-center gap-1.5 capitalize">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                {k.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
        <AdminCard title="Mapped farmers">
          <div className="overflow-y-auto max-h-[460px] -mr-2 pr-1.5 flex flex-col gap-0.5">
            {points.map((p, i) => (
              <button key={`${p.code}-${i}`} onClick={() => focus(i)}
                className="w-full flex items-center gap-2.5 rounded-[12px] px-2.5 py-2 text-left hover:bg-black/5 transition"
                style={{ background: selected === i ? 'var(--ag-pn)' : 'transparent' }}>
                <span className="w-7 h-7 rounded-full grid place-items-center flex-none" style={{ background: STATUS_COLORS[p.status] || STATUS_COLORS.pending, color: '#fff' }}>
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <span className="flex-1 min-w-0">
                  <b className="block text-[13px] truncate" style={{ color: 'var(--ag-ink)' }}>{p.farmer}</b>
                  <span className="text-[11.5px]" style={{ color: 'var(--ag-mut)' }}>{p.farm} · {p.area}</span>
                </span>
              </button>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  );
}
