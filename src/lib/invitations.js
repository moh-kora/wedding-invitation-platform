const DRAFT_KEY = 'everly-draft';
const RSVP_KEY = 'everly-rsvps';

export function getBackendConfig() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  };
}

export function isBackendConfigured() {
  const { url, key } = getBackendConfig();
  return Boolean(url && key);
}

export function readDraft(fallback) {
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') };
  } catch {
    return fallback;
  }
}

export function writeDraft(data) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
}

export function readLocalRsvps() {
  try {
    return JSON.parse(localStorage.getItem(RSVP_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveLocalRsvp(rsvp) {
  const current = readLocalRsvps();
  const next = [{ ...rsvp, id: crypto.randomUUID?.() || String(Date.now()), created_at: new Date().toISOString() }, ...current];
  localStorage.setItem(RSVP_KEY, JSON.stringify(next));
  return next;
}

export function toInvitationPayload(data, template, slug, ownerId = null) {
  return {
    owner_id: ownerId,
    slug,
    bride: data.bride,
    groom: data.groom,
    wedding_date: data.date || null,
    wedding_time: data.time || null,
    venue: data.venue || null,
    address: data.address || null,
    map_url: data.map || null,
    cover_url: data.cover || null,
    music_url: data.music || null,
    rsvp_contact: data.rsvp || null,
    message: data.message || null,
    template,
    published: true
  };
}
