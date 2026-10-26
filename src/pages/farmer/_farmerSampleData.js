// Sample data for the farmer portal, mirroring the admin-side fallback
// (_adminSampleData). Rows are served only when the Base44 backend is
// unreachable (not configured); live entity data always wins once it responds.
// The demo farmer identity is fixed to Thabo Mokoena (FRM-EMF-00231).

const ago = (days) => new Date(Date.now() - days * 86400000).toISOString();

export const FARMER_SAMPLE_ID = 'FRM-EMF-00231';

const FARMER_SAMPLE = {
  ServiceType: [
    { id: 'st-01', name: 'Livestock movement permit', category: 'permit', approver_role: 'State Vet Officer', sla_days: 5, sort_order: 1 },
    { id: 'st-02', name: 'Water use licence', category: 'permit', approver_role: 'Water Affairs Officer', sla_days: 21, sort_order: 2 },
    { id: 'st-03', name: 'Market stall allocation', category: 'permit', approver_role: 'Markets Officer', sla_days: 7, sort_order: 3 },
    { id: 'st-04', name: 'Tractor hire booking', category: 'permit', approver_role: 'Mechanisation Officer', sla_days: 3, sort_order: 4 },
    { id: 'st-05', name: 'Land use confirmation', category: 'registration', approver_role: 'Land Use Officer', sla_days: 10, sort_order: 5 },
    { id: 'st-06', name: 'Producer registration renewal', category: 'registration', approver_role: 'Registry Officer', sla_days: 14, sort_order: 6 },
    { id: 'st-07', name: 'CASP infrastructure grant', category: 'grant', approver_role: 'Grants Committee', sla_days: 45, sort_order: 7 },
    { id: 'st-08', name: 'Youth in agriculture starter grant', category: 'grant', approver_role: 'Grants Committee', sla_days: 60, sort_order: 8 },
    { id: 'st-09', name: 'Vaccination certificate', category: 'certificate', approver_role: 'State Vet Officer', sla_days: 7, sort_order: 9 },
    { id: 'st-10', name: 'Organic production certificate', category: 'certificate', approver_role: 'Certification Auditor', sla_days: 30, sort_order: 10 },
    { id: 'st-11', name: 'Climate-smart vegetable production', category: 'training', approver_role: 'Extension Officer', sla_days: 30, sort_order: 11 },
    { id: 'st-12', name: 'Poultry health & biosecurity basics', category: 'training', approver_role: 'Extension Officer', sla_days: 14, sort_order: 12 },
  ],
  Farm: [
    { id: 'sfm-01', farmer_id: 'FRM-EMF-00231', name: 'De Deur Smallholding', size_ha: 12.4, tenure: 'Leased', water_source: 'Borehole', suburb: 'De Deur', primary_commodities: 'Maize, spinach, cattle, goats', created_date: ago(119) },
    { id: 'sfm-02', farmer_id: 'FRM-EMF-00231', name: 'Walkerville Plot 14', size_ha: 4.8, tenure: 'Owned', water_source: 'Municipal', suburb: 'Walkerville', primary_commodities: 'Cabbage, tomatoes, layer hens', created_date: ago(95) },
    { id: 'sfm-03', farmer_id: 'FRM-EMF-00231', name: 'Sebokeng Co-op Garden', size_ha: 1.2, tenure: 'Communal', water_source: 'Irrigation scheme', suburb: 'Sebokeng', primary_commodities: 'Spinach, maize', created_date: ago(40) },
  ],
  Application: [
    { id: 'sfa-01', reference: 'APP-2026-1158', service_type: 'Tractor hire booking', category: 'permit', farmer_id: 'FRM-EMF-00231', farmer_name: 'Thabo Mokoena', area: 'De Deur', status: 'submitted', assigned_officer: 'Mechanisation Officer', due_date: '05 Nov', submitted_date: '18 Oct', progress: 20, submitted_data: 'Pre-filled from farm profile', created_date: ago(9) },
    { id: 'sfa-02', reference: 'APP-2026-1147', service_type: 'Vaccination certificate', category: 'certificate', farmer_id: 'FRM-EMF-00231', farmer_name: 'Thabo Mokoena', area: 'De Deur', status: 'in_review', assigned_officer: 'Dr. P. Naidoo', due_date: '28 Oct', submitted_date: '06 Oct', progress: 88, submitted_data: 'Pre-filled from farm profile', created_date: ago(20) },
    { id: 'sfa-03', reference: 'APP-2026-1126', service_type: 'Market stall allocation', category: 'permit', farmer_id: 'FRM-EMF-00231', farmer_name: 'Thabo Mokoena', area: 'De Deur', status: 'more_info_required', assigned_officer: 'Markets Officer', due_date: '01 Nov', submitted_date: '12 Oct', progress: 45, submitted_data: 'Stall plan attached', created_date: ago(14) },
    { id: 'sfa-04', reference: 'APP-2026-1150', service_type: 'Land use confirmation', category: 'registration', farmer_id: 'FRM-EMF-00231', farmer_name: 'Thabo Mokoena', area: 'Walkerville', status: 'approved', assigned_officer: 'Land Use Officer', due_date: '22 Oct', submitted_date: '26 Sep', progress: 100, submitted_data: 'Pre-filled from farm profile', created_date: ago(30) },
  ],
  NotificationItem: [
    { id: 'sfn-01', farmer_id: 'FRM-EMF-00231', title: 'FMD control zone near De Deur', body: 'Movement permits are on hold within 25 km of the zone. Vaccination teams are in your area this week.', type: 'alert', channel: 'push', read: false, created_date: ago(1) },
    { id: 'sfn-02', farmer_id: 'FRM-EMF-00231', title: 'Extension visit confirmed', body: 'Officer N. Dlamini will inspect your maize lands on Tuesday at 09:00.', type: 'visit', channel: 'push', read: false, created_date: ago(2) },
    { id: 'sfn-03', farmer_id: 'FRM-EMF-00231', title: 'Vaccination certificate in final review', body: 'APP-2026-1147 passed the zone check. QR verification activates once the permit is issued.', type: 'action', channel: 'push', read: true, created_date: ago(3) },
    { id: 'sfn-04', farmer_id: 'FRM-EMF-00231', title: 'Grant window opens 1 Nov', body: 'CASP infrastructure grants open for smallholders. Apply under Services → Grants.', type: 'message', channel: 'push', read: true, created_date: ago(5) },
    { id: 'sfn-05', farmer_id: 'FRM-EMF-00231', title: 'Load shedding schedule', body: 'Planned outages may affect irrigation this weekend. Plan pumping accordingly.', type: 'notice', channel: 'push', read: true, created_date: ago(6) },
    { id: 'sfn-06', farmer_id: 'FRM-EMF-00231', title: 'Fall armyworm alert', body: 'Fall armyworm confirmed in Walkerville. Scout your maize early morning.', type: 'alert', channel: 'push', read: true, created_date: ago(8) },
    { id: 'sfn-07', farmer_id: 'FRM-EMF-00231', title: 'Market stall documents needed', body: 'APP-2026-1126: upload your ID copy and latest rates statement to continue.', type: 'action', channel: 'push', read: true, created_date: ago(10) },
  ],
};

// Rows created locally while no backend is reachable (e.g. an application
// submitted from the Services page), so the demo flow still tracks them.
const localApplications = [];
const localNotifications = [];

export function addSampleApplication(row) {
  localApplications.unshift({ id: 'local-a-' + Date.now(), created_date: new Date().toISOString(), ...row });
}

export function addSampleNotification(row) {
  localNotifications.unshift({ id: 'local-n-' + Date.now(), created_date: new Date().toISOString(), read: false, ...row });
}

// Filter/sort/limit a sample entity list the same way the backend query would.
export function sampleList(entity, query = {}, sort = '-created_date', limit = 50) {
  const base = FARMER_SAMPLE[entity] || [];
  const rows = entity === 'Application'
    ? [...localApplications, ...base]
    : entity === 'NotificationItem'
      ? [...localNotifications, ...base]
      : base;
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
