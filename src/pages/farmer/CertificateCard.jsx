import React from 'react';
import { qrSvgFromToken } from '@/lib/agriAssets';
import { FARMER_ID, FARMER_NAME, DCard } from './_shared';

// Digital farmer certificate with QR verification, shared by the dashboard
// and profile pages (the Services page no longer shows it).
export default function CertificateCard({ desktop = false }) {
  const qr = qrSvgFromToken(FARMER_ID);
  if (desktop) {
    return (
      <DCard className="relative overflow-hidden" style={{ border: 0, background: 'radial-gradient(100% 120% at 100% 0, #c9a24b55, transparent 55%), linear-gradient(135deg,#0b3326,#14507c)' }}>
        <span className="text-[11px] tracking-[1.4px] opacity-80 font-jk">DIGITAL CERTIFICATE</span>
        <div className="flex gap-4 items-center mt-3">
          <div className="w-[84px] h-[84px] bg-white rounded-xl p-1.5 flex-none" dangerouslySetInnerHTML={{ __html: qr }} />
          <div className="text-white">
            <b className="font-fraunces block" style={{ fontSize: 20, fontWeight: 500 }}>Registered Farmer Certificate</b>
            <div className="text-[12px] opacity-85 font-jk mt-0.5">{FARMER_NAME}<br />{FARMER_ID} · Valid to Oct 2027</div>
          </div>
        </div>
      </DCard>
    );
  }
  return (
    <div className="rounded-[20px] p-4 flex gap-3.5 items-center text-white" style={{ background: 'linear-gradient(135deg,#0f4a37,#1a63a8)' }}>
      <div className="w-[74px] h-[74px] bg-white rounded-[10px] p-1.5 flex-none" dangerouslySetInnerHTML={{ __html: qr }} />
      <div>
        <div className="text-[11px] text-white">Registered Farmer Certificate</div>
        <b className="text-[15px]">{FARMER_NAME}</b>
        <div className="text-[11px] opacity-85">{FARMER_ID} · Valid to Oct 2027<br />Scan to verify authenticity</div>
      </div>
    </div>
  );
}
