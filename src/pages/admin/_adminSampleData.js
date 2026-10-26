// Sample data for the officer (municipal) portal.
//
// Used ONLY as a fallback: `useEntityList` serves these rows when the Base44
// backend request fails (no backend connected). Live entity data always wins,
// so nothing here changes behaviour once VITE_BASE44_APP_ID/URL are set.

const ago = (days) => new Date(Date.now() - days * 86400000).toISOString();

export const ADMIN_SAMPLE = {
  Farmer: [
    { id: 's-f01', farmer_code: 'FRM-EMF-00231', name: 'Thabo Mokoena', type: 'Smallholder', area: 'De Deur', verification_status: 'verified', created_date: ago(120) },
    { id: 's-f02', farmer_code: 'FRM-EMF-00188', name: 'Naledi Dlamini', type: 'Smallholder', area: 'Vereeniging', verification_status: 'verified', created_date: ago(118) },
    { id: 's-f03', farmer_code: 'FRM-EMF-00094', name: 'Elizabeth van Wyk', type: 'Smallholder', area: 'Three Rivers', verification_status: 'verified', created_date: ago(115) },
    { id: 's-f04', farmer_code: 'FRM-EMF-00342', name: 'Sipho Ndlovu', type: 'Smallholder', area: 'Vanderbijlpark', verification_status: 'pending', created_date: ago(112) },
    { id: 's-f05', farmer_code: 'FRM-EMF-00123', name: 'David Khumalo', type: 'Commercial', area: 'Sharpeville', verification_status: 'verified', created_date: ago(110) },
    { id: 's-f06', farmer_code: 'FRM-EMF-00401', name: 'Portia Sithole', type: 'Subsistence', area: 'Boipatong', verification_status: 'changes_requested', created_date: ago(96) },
    { id: 's-f07', farmer_code: 'FRM-EMF-00365', name: 'Grace Mahlangu', type: 'Subsistence', area: 'Bophelong', verification_status: 'verified', created_date: ago(94) },
    { id: 's-f08', farmer_code: 'FRM-EMF-00275', name: 'Johannes Mabena', type: 'Smallholder', area: 'Sebokeng', verification_status: 'pending', created_date: ago(90) },
    { id: 's-f09', farmer_code: 'FRM-EMF-00318', name: 'Samuel Nkosi', type: 'Smallholder', area: 'Evaton', verification_status: 'pending', created_date: ago(87) },
    { id: 's-f10', farmer_code: 'FRM-EMF-00057', name: 'Maria Botha', type: 'Commercial', area: 'Walkerville', verification_status: 'verified', created_date: ago(80) },
    { id: 's-f11', farmer_code: 'FRM-EMF-00021', name: 'Pieter Steyn', type: 'Commercial', area: 'Vaal Marina', verification_status: 'verified', created_date: ago(76) },
    { id: 's-f12', farmer_code: 'FRM-EMF-00417', name: 'Lerato Molefe', type: 'Subsistence', area: 'Evaton', verification_status: 'changes_requested', created_date: ago(41) },
    { id: 's-f13', farmer_code: 'FRM-EMF-00452', name: 'Kgomotso Ncube', type: 'Smallholder', area: 'Sebokeng', verification_status: 'pending', created_date: ago(23) },
    { id: 's-f14', farmer_code: 'FRM-EMF-00409', name: 'Andries Pretorius', type: 'Commercial', area: 'Vanderbijlpark', verification_status: 'rejected', created_date: ago(12) },
  ],
  Farm: [
    { id: 's-fm01', farmer_id: 'FRM-EMF-00231', name: 'Mokoena Smallholding', size_ha: 4.2, primary_commodities: 'Vegetables, poultry', suburb: 'De Deur', lat: -26.6741, lng: 27.9318, created_date: ago(119) },
    { id: 's-fm02', farmer_id: 'FRM-EMF-00188', name: 'Dlamini Vegetable Plot', size_ha: 2.5, primary_commodities: 'Vegetables', suburb: 'Vereeniging', lat: -26.6731, lng: 27.9261, created_date: ago(117) },
    { id: 's-fm03', farmer_id: 'FRM-EMF-00094', name: 'Van Wyk Nursery', size_ha: 5.5, primary_commodities: 'Seedlings, herbs', suburb: 'Three Rivers', lat: -26.6467, lng: 27.8739, created_date: ago(114) },
    { id: 's-fm04', farmer_id: 'FRM-EMF-00342', name: 'Ndlovu Poultry Farm', size_ha: 6.0, primary_commodities: 'Poultry, eggs', suburb: 'Vanderbijlpark', lat: -26.7106, lng: 27.8338, created_date: ago(111) },
    { id: 's-fm05', farmer_id: 'FRM-EMF-00123', name: 'Khumalo Livestock', size_ha: 22, primary_commodities: 'Cattle, sheep', suburb: 'Sharpeville', lat: -26.6872, lng: 27.8747, created_date: ago(109) },
    { id: 's-fm06', farmer_id: 'FRM-EMF-00401', name: 'Sithole Market Garden', size_ha: 1.8, primary_commodities: 'Spinach, maize', suburb: 'Boipatong', lat: -26.6147, lng: 27.8706, created_date: ago(95) },
    { id: 's-fm07', farmer_id: 'FRM-EMF-00365', name: 'Mahlangu Community Farm', size_ha: 2.2, primary_commodities: 'Vegetables', suburb: 'Bophelong', lat: -26.6499, lng: 27.8536, created_date: ago(93) },
    { id: 's-fm08', farmer_id: 'FRM-EMF-00275', name: 'Mabena Co-op Garden', size_ha: 3.1, primary_commodities: 'Vegetables', suburb: 'Sebokeng', lat: -26.5751, lng: 27.8404, created_date: ago(89) },
    { id: 's-fm09', farmer_id: 'FRM-EMF-00318', name: 'Nkosi Goat Project', size_ha: 7.3, primary_commodities: 'Goats', suburb: 'Evaton', lat: -26.5228, lng: 27.8494, created_date: ago(86) },
    { id: 's-fm10', farmer_id: 'FRM-EMF-00057', name: 'Botha Boerdery', size_ha: 84, primary_commodities: 'Maize, cattle', suburb: 'Walkerville', lat: -26.7986, lng: 27.9658, created_date: ago(79) },
    { id: 's-fm11', farmer_id: 'FRM-EMF-00021', name: 'Steyn Cattle Ranch', size_ha: 120, primary_commodities: 'Cattle, lucerne', suburb: 'Vaal Marina', lat: -26.889, lng: 28.127, created_date: ago(75) },
    { id: 's-fm12', farmer_id: 'FRM-EMF-00452', name: 'Ncube Piggery', size_ha: 3.8, primary_commodities: 'Pigs, pork', suburb: 'Sebokeng', lat: -26.5903, lng: 27.8377, created_date: ago(22) },
  ],
  Application: [
    { id: 's-a01', reference: 'APP-2026-1183', service_type: 'Livestock movement permit', farmer_name: 'David Khumalo', farmer_id: 'FRM-EMF-00123', status: 'in_review', progress: 72, due_date: '29 Oct', created_date: ago(9) },
    { id: 's-a02', reference: 'APP-2026-1179', service_type: 'Water use licence', farmer_name: 'Maria Botha', farmer_id: 'FRM-EMF-00057', status: 'escalated', progress: 85, due_date: '27 Oct', created_date: ago(10) },
    { id: 's-a03', reference: 'APP-2026-1171', service_type: 'Market stall allocation', farmer_name: 'Naledi Dlamini', farmer_id: 'FRM-EMF-00188', status: 'more_info_required', progress: 45, due_date: '01 Nov', created_date: ago(12) },
    { id: 's-a04', reference: 'APP-2026-1166', service_type: 'Livestock movement permit', farmer_name: 'Samuel Nkosi', farmer_id: 'FRM-EMF-00318', status: 'in_review', progress: 60, due_date: '30 Oct', created_date: ago(14) },
    { id: 's-a05', reference: 'APP-2026-1158', service_type: 'Tractor hire booking', farmer_name: 'Grace Mahlangu', farmer_id: 'FRM-EMF-00365', status: 'submitted', progress: 20, due_date: '05 Nov', created_date: ago(16) },
    { id: 's-a06', reference: 'APP-2026-1150', service_type: 'Land use confirmation', farmer_name: 'Pieter Steyn', farmer_id: 'FRM-EMF-00021', status: 'approved', progress: 100, due_date: '22 Oct', created_date: ago(19) },
    { id: 's-a07', reference: 'APP-2026-1147', service_type: 'Vaccination certificate', farmer_name: 'Thabo Mokoena', farmer_id: 'FRM-EMF-00231', status: 'in_review', progress: 88, due_date: '28 Oct', created_date: ago(20) },
    { id: 's-a08', reference: 'APP-2026-1139', service_type: 'Soil analysis request', farmer_name: 'Kgomotso Ncube', farmer_id: 'FRM-EMF-00452', status: 'pending', progress: 10, due_date: '08 Nov', created_date: ago(23) },
    { id: 's-a09', reference: 'APP-2026-1131', service_type: 'Water use licence', farmer_name: 'Sipho Ndlovu', farmer_id: 'FRM-EMF-00342', status: 'escalated', progress: 91, due_date: '25 Oct', created_date: ago(26) },
    { id: 's-a10', reference: 'APP-2026-1126', service_type: 'Market stall allocation', farmer_name: 'Portia Sithole', farmer_id: 'FRM-EMF-00401', status: 'changes_requested', progress: 35, due_date: '02 Nov', created_date: ago(28) },
    { id: 's-a11', reference: 'APP-2026-1119', service_type: 'Livestock movement permit', farmer_name: 'Johannes Mabena', farmer_id: 'FRM-EMF-00275', status: 'approved', progress: 100, due_date: '18 Oct', created_date: ago(31) },
    { id: 's-a12', reference: 'APP-2026-1114', service_type: 'Tractor hire booking', farmer_name: 'Lerato Molefe', farmer_id: 'FRM-EMF-00417', status: 'rejected', progress: 55, due_date: '16 Oct', created_date: ago(33) },
    { id: 's-a13', reference: 'APP-2026-1108', service_type: 'Land use confirmation', farmer_name: 'Elizabeth van Wyk', farmer_id: 'FRM-EMF-00094', status: 'in_review', progress: 50, due_date: '31 Oct', created_date: ago(36) },
    { id: 's-a14', reference: 'APP-2026-1101', service_type: 'Soil analysis request', farmer_name: 'Andries Pretorius', farmer_id: 'FRM-EMF-00409', status: 'more_info_required', progress: 30, due_date: '03 Nov', created_date: ago(39) },
  ],
  Incident: [
    { id: 's-i01', title: 'Suspected FMD — cattle herd', area: 'Sebokeng', quantity_affected: '14 cattle', assigned_officer: 'Dr. P. Naidoo', status: 'investigating', severity: 'critical', created_date: ago(3) },
    { id: 's-i02', title: 'Fall armyworm in maize lands', area: 'Walkerville', quantity_affected: '26 ha maize', assigned_officer: 'N. Dlamini', status: 'confirmed', severity: 'high', created_date: ago(5) },
    { id: 's-i03', title: 'Newcastle disease suspicion', area: 'Vanderbijlpark', quantity_affected: '80 poultry', assigned_officer: 'Dr. P. Naidoo', status: 'investigating', severity: 'high', created_date: ago(8) },
    { id: 's-i04', title: 'African swine fever alert', area: 'Evaton', quantity_affected: '12 pigs', assigned_officer: 'State Vet Unit', status: 'confirmed', severity: 'critical', created_date: ago(11) },
    { id: 's-i05', title: 'Tomato leaf miner outbreak', area: 'Boipatong', quantity_affected: '1.4 ha tomatoes', assigned_officer: 'S. Mokoena', status: 'monitoring', severity: 'warning', created_date: ago(15) },
    { id: 's-i06', title: 'Rift Valley fever vaccination follow-up', area: 'Vaal Marina', quantity_affected: '300 cattle', assigned_officer: 'B. Khumalo', status: 'resolved', severity: 'pending', created_date: ago(21) },
    { id: 's-i07', title: 'Locust swarm sighting', area: 'De Deur', quantity_affected: 'reported, unconfirmed', assigned_officer: 'T. Pretorius', status: 'investigating', severity: 'low', created_date: ago(27) },
    { id: 's-i08', title: 'Brucellosis screening backlog', area: 'Sharpeville', quantity_affected: '45 cattle', assigned_officer: 'Dr. P. Naidoo', status: 'monitoring', severity: 'warning', created_date: ago(32) },
  ],
  ControlZone: [
    { id: 's-cz1', name: 'Sebokeng FMD zone', area: 'Sebokeng', radius_km: 25, status: 'active', created_date: ago(3) },
    { id: 's-cz2', name: 'Evaton ASF zone', area: 'Evaton', radius_km: 10, status: 'active', created_date: ago(11) },
    { id: 's-cz3', name: 'Walkerville armyworm zone', area: 'Walkerville', radius_km: 15, status: 'active', created_date: ago(5) },
  ],
  VaccinationCampaign: [
    { id: 's-vc1', disease: 'FMD (foot-and-mouth)', doses_administered: 41200, doses_target: 58000, status: 'active', created_date: ago(40) },
    { id: 's-vc2', disease: 'Rift Valley fever', doses_administered: 18600, doses_target: 31000, status: 'active', created_date: ago(75) },
  ],
  TrainingEvent: [
    { id: 's-t01', topic: 'Climate-smart vegetable production', date: '12 Nov 2026', attendees: 64, status: 'scheduled', created_date: ago(7) },
    { id: 's-t02', topic: 'Poultry health & biosecurity basics', date: '29 Oct 2026', attendees: 41, status: 'scheduled', created_date: ago(12) },
    { id: 's-t03', topic: 'Record keeping for grant compliance', date: '15 Oct 2026', attendees: 58, status: 'completed', created_date: ago(18) },
    { id: 's-t04', topic: 'Livestock movement permits explained', date: '07 Oct 2026', attendees: 73, status: 'completed', created_date: ago(26) },
    { id: 's-t05', topic: 'Soil sampling demonstration', date: '28 Sep 2026', attendees: 36, status: 'completed', created_date: ago(33) },
    { id: 's-t06', topic: 'Agri Connect app registration drive', date: '21 Sep 2026', attendees: 112, status: 'completed', created_date: ago(40) },
  ],
  Programme: [
    { id: 's-p01', name: 'Comprehensive Agricultural Support (CASP)', budget: 'R12.4m', committed_percent: 82, window: 'Apr – Sep 2026', created_date: ago(150) },
    { id: 's-p02', name: 'Ilima/Land Bank relief fund', budget: 'R6.8m', committed_percent: 67, window: 'Jul – Dec 2026', created_date: ago(140) },
    { id: 's-p03', name: 'Youth in agriculture starter grants', budget: 'R3.2m', committed_percent: 41, window: 'Sep 2026 – Mar 2027', created_date: ago(90) },
  ],
  GrantApplication: [
    { id: 's-g01', applicant: 'Naledi Dlamini', programme: 'Youth in agriculture starter grants', score: 88, status: 'approved', milestone: '50% disbursed', created_date: ago(6) },
    { id: 's-g02', applicant: 'Sipho Ndlovu', programme: 'Comprehensive Agricultural Support (CASP)', score: 74, status: 'in_review', milestone: 'Site inspection booked', created_date: ago(8) },
    { id: 's-g03', applicant: 'Kgomotso Ncube', programme: 'Ilima/Land Bank relief fund', score: 81, status: 'approved', milestone: 'Awaiting banking details', created_date: ago(10) },
    { id: 's-g04', applicant: 'Lerato Molefe', programme: 'Youth in agriculture starter grants', score: 62, status: 'changes_requested', milestone: '—', created_date: ago(13) },
    { id: 's-g05', applicant: 'Samuel Nkosi', programme: 'Comprehensive Agricultural Support (CASP)', score: 79, status: 'in_review', milestone: 'Panel review 30 Oct', created_date: ago(16) },
    { id: 's-g06', applicant: 'Pieter Steyn', programme: 'Ilima/Land Bank relief fund', score: 93, status: 'approved', milestone: 'Milestones met — final tranche', created_date: ago(19) },
    { id: 's-g07', applicant: 'Portia Sithole', programme: 'Youth in agriculture starter grants', score: 57, status: 'rejected', milestone: '—', created_date: ago(24) },
    { id: 's-g08', applicant: 'Johannes Mabena', programme: 'Comprehensive Agricultural Support (CASP)', score: 85, status: 'approved', milestone: '75% disbursed', created_date: ago(29) },
  ],
  AuditLog: [
    { id: 's-al01', action: 'Approved APP-2026-1150 (Land use confirmation)', actor: 'N. Mahlangu', timestamp: '26 Oct 2026, 09:14', created_date: ago(0.2) },
    { id: 's-al02', action: 'Verified farmer FRM-EMF-00231', actor: 'N. Mahlangu', timestamp: '26 Oct 2026, 08:41', created_date: ago(0.3) },
    { id: 's-al03', action: 'Declared control zone: Sebokeng FMD zone', actor: 'Dr. P. Naidoo', timestamp: '25 Oct 2026, 16:05', created_date: ago(1) },
    { id: 's-al04', action: 'Requested changes for FRM-EMF-00401', actor: 'N. Mahlangu', timestamp: '25 Oct 2026, 11:22', created_date: ago(1.1) },
    { id: 's-al05', action: 'Emergency broadcast: FMD vaccination reminder', actor: 'K. Sithole', timestamp: '24 Oct 2026, 14:58', created_date: ago(2) },
    { id: 's-al06', action: 'Approved grant application — S. Steyn', actor: 'A. Jacobs', timestamp: '23 Oct 2026, 10:36', created_date: ago(3) },
    { id: 's-al07', action: 'Bulk imported 42 farmers from CSV', actor: 'N. Mahlangu', timestamp: '21 Oct 2026, 15:09', created_date: ago(5) },
  ],
  Message: [
    { id: 's-m01', title: 'Compulsory FMD vaccination ends 31 Oct', delivered_percent: 98, read_percent: 74, created_date: ago(2) },
    { id: 's-m02', title: 'African swine fever — movement restrictions in Evaton', delivered_percent: 96, read_percent: 81, created_date: ago(9) },
    { id: 's-m03', title: 'Grant window closes 15 Nov — apply via Agri Connect', delivered_percent: 92, read_percent: 63, created_date: ago(14) },
    { id: 's-m04', title: 'Tractor hire schedule for November published', delivered_percent: 89, read_percent: 52, created_date: ago(18) },
    { id: 's-m05', title: 'Load-shedding backup plan for poultry farmers', delivered_percent: 94, read_percent: 77, created_date: ago(25) },
  ],
};

// Filter/sort/limit a sample entity list the same way the backend query would.
export function sampleList(entity, query = {}, sort = '-created_date', limit = 50) {
  const rows = ADMIN_SAMPLE[entity] || [];
  const filtered = rows.filter((r) =>
    Object.entries(query).every(([k, v]) => (Array.isArray(v) ? v.includes(r[k]) : r[k] === v))
  );
  const key = String(sort || '').replace(/^-/, '');
  const dir = String(sort || '').startsWith('-') ? -1 : 1;
  if (key && filtered[0] && key in filtered[0]) {
    filtered.sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * dir);
  }
  return filtered.slice(0, limit);
}
