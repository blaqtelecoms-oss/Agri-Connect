// Shared asset URLs for the Agri Connect app.
// Logo is the uploaded Emfuleni municipality asset; heroes are tasteful agricultural stock.

export const LOGO_URL = 'https://media.base44.com/images/public/user_6abd2ddc9f051251af3ac144/3f739ed82_Emfuleni-Water-And-Sanitation-removebg-preview.png';

export const HERO_SIGNIN = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80';
export const HERO_FARMER = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80';

export const FARM_THUMB_A = 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=400&q=80';
export const FARM_THUMB_B = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80';
export const FARM_THUMB_C = 'https://images.unsplash.com/photo-1592982634390-9ab1d4b6b6b7?w=400&q=80';

export const ADMIN_BG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80';

export const FARM_THUMBS = [FARM_THUMB_A, FARM_THUMB_B, FARM_THUMB_C];

// Simple decorative QR-style square generator (visual only, deterministic from a string).
export function qrSvgFromToken(token) {
  let h = 0;
  for (let i = 0; i < token.length; i++) h = (h * 31 + token.charCodeAt(i)) % 97;
  let cells = '';
  for (let y = 0; y < 11; y++) {
    for (let x = 0; x < 11; x++) {
      h = (h * 31 + x * 7 + y * 13 + 5) % 97;
      const edge = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      const on = edge ? ((x % 2 === 0 || y % 2 === 0) && !(x === 1 && y === 1) && !(x === 9 && y === 1) && !(x === 1 && y === 9)) : (h % 2 === 0);
      if (on) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }
  return `<svg viewBox="0 0 11 11" style="width:100%;height:100%;fill:#0f2a20;stroke:none">${cells}</svg>`;
}