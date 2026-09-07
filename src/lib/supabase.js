const config = () => ({
  url: (import.meta.env.VITE_SUPABASE_URL || 'https://zjyreqzmbmpmlnfobimh.supabase.co').replace(/\/$/, ''),
  key: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZpYREdtQFDNK4jvs-qo6FA_r_ggiDET'
});

export const backendReady = () => { const { url, key } = config(); return Boolean(url && key); };

async function request(path, options = {}) {
  const { url, key } = config();
  if (!url || !key) throw new Error('Supabase is not configured.');
  const session = getSession();
  const token = session?.access_token;
  const response = await fetch(`${url}${path}`, {
    ...options,
    headers: { apikey: key, Authorization: `Bearer ${token || key}`, 'Content-Type': 'application/json', ...(options.headers || {}) }
  });
  const text = await response.text();
  let body = null; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(body?.msg || body?.message || body?.error_description || body?.hint || 'Request failed.');
  return body;
}

export function getSession() { try { return JSON.parse(localStorage.getItem('everly-supabase-session') || 'null'); } catch { return null; } }
export function setSession(session) { localStorage.setItem('everly-supabase-session', JSON.stringify(session)); }
export function clearSession() { localStorage.removeItem('everly-supabase-session'); }

export async function signIn(email, password) { const data = await request('/auth/v1/token?grant_type=password', { method: 'POST', body: JSON.stringify({ email, password }) }); setSession(data); return data; }
export async function signUp(email, password, fullName) { const data = await request('/auth/v1/signup', { method: 'POST', body: JSON.stringify({ email, password, data: { full_name: fullName } }) }); if (data?.access_token) setSession(data); return data; }
export async function signOut() { clearSession(); }

export async function listInvitations() {
  const user = getSession()?.user?.id; if (!user) return [];
  return request(`/rest/v1/invitations?owner_id=eq.${encodeURIComponent(user)}&select=*,invitation_gallery(*),rsvps(*)&order=created_at.desc`);
}
export async function getInvitationBySlug(slug) {
  const rows = await request(`/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=*,invitation_gallery(*),rsvps(*)`);
  return rows?.[0] || null;
}
export async function createInvitation(payload) { const data = await request('/rest/v1/invitations', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(payload) }); return data?.[0] || data; }
export async function updateInvitation(id, payload) { const data = await request(`/rest/v1/invitations?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ ...payload, updated_at: new Date().toISOString() }) }); return data?.[0] || data; }
export async function deleteInvitation(id) { await request(`/rest/v1/invitations?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }); }
export async function submitRsvp(invitationId, rsvp) {
  const data = await request('/rest/v1/rsvps', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ invitation_id: invitationId, guest_name: rsvp.name, attending: rsvp.attending === 'yes', guests_count: Number(rsvp.guests || 1), note: rsvp.note || null }) });
  return data?.[0] || data;
}
export async function upsertGallery(invitationId, urls = []) {
  if (!urls.length) return [];
  const rows = urls.map((url, index) => ({ invitation_id: invitationId, url, sort_order: index }));
  return request('/rest/v1/invitation_gallery', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify(rows) });
}
