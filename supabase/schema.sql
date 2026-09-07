-- Everly production schema for Supabase
create extension if not exists pgcrypto;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  slug text not null unique,
  bride text not null,
  groom text not null,
  wedding_date date,
  wedding_time time,
  venue text,
  address text,
  map_url text,
  cover_url text,
  music_url text,
  rsvp_contact text,
  message text,
  template text not null default 'editorial' check (template in ('editorial','romantic','minimal')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invitation_gallery (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text not null,
  attending boolean not null,
  guests_count integer not null default 1 check (guests_count between 1 and 20),
  note text,
  created_at timestamptz not null default now()
);

create index if not exists invitations_owner_id_idx on public.invitations(owner_id);
create index if not exists invitation_gallery_invitation_id_idx on public.invitation_gallery(invitation_id);
create index if not exists rsvps_invitation_id_idx on public.rsvps(invitation_id);

alter table public.invitations enable row level security;
alter table public.invitation_gallery enable row level security;
alter table public.rsvps enable row level security;

-- Owners can manage their invitations.
create policy "owners can read invitations" on public.invitations for select using (auth.uid() = owner_id or published = true);
create policy "owners can insert invitations" on public.invitations for insert with check (auth.uid() = owner_id);
create policy "owners can update invitations" on public.invitations for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
create policy "owners can delete invitations" on public.invitations for delete using (auth.uid() = owner_id);

-- Published invitation galleries are public; owners have full management access.
create policy "public can read published gallery" on public.invitation_gallery for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true));
create policy "owners can manage gallery" on public.invitation_gallery for all using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid()));

-- Guests may submit RSVP for a published invitation. Owners can read/manage their RSVPs.
create policy "public can submit RSVP" on public.rsvps for insert with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true));
create policy "owners can read RSVPs" on public.rsvps for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid()));
create policy "owners can delete RSVPs" on public.rsvps for delete using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid()));

-- Storage bucket for invitation media. Create the bucket in Supabase Storage as `invitation-media`.
-- Storage policies can then restrict uploads to authenticated users while allowing public reads for published assets.
