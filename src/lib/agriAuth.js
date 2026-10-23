// Demo auth helper for Agri Connect.
// Stores the active session (role + farmer identity) in localStorage so the
// OTP / MFA sign-in flows work in this prototype without a real credential backend.

const KEY = 'agri_session';

export const LANGUAGES = ['English', 'isiZulu', 'Sesotho', 'Afrikaans', 'isiXhosa', 'Setswana'];

// The demo farmer available immediately on the farmer OTP flow.
export const DEMO_FARMER = {
  farmer_id: 'FRM-EMF-00231',
  name: 'Thabo Mokoena',
  phone: '+27 82 555 0142',
  area: 'De Deur',
  type: 'smallholder',
  language: 'English',
};

// Demo municipal official for the staff MFA flow.
export const DEMO_OFFICIAL = {
  name: 'Nomsa Mahlangu',
  email: 'nomsa@emfuleni.gov.za',
  role: 'Municipal manager',
  initials: 'NM',
};

export function getSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

export function isFarmer() {
  const s = getSession();
  return s && s.portal === 'farmer';
}

export function isOfficial() {
  const s = getSession();
  return s && s.portal === 'admin';
}