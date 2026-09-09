-- Everly production schema for Supabase
create extension if not exists pgcrypto;

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(), owner_id uuid references auth.users(id) on delete cascade, slug text not null unique,
  bride text not null, groom text not null, wedding_date date, wedding_time time, venue text, address text, map_url text, cover_url text, music_url text,
  rsvp_contact text, message text, story text, dress_code text, dress_code_note text, primary_color text, accent_color text,
  template text not null default 'editorial' check (template in ('editorial','romantic','minimal')), published boolean not null default false,
  published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.invitation_gallery (id uuid primary key default gen_random_uuid(), invitation_id uuid not null references public.invitations(id) on delete cascade,url text not null,sort_order integer not null default 0,created_at timestamptz not null default now());
create table if not exists public.invitation_events (id uuid primary key default gen_random_uuid(), invitation_id uuid not null references public.invitations(id) on delete cascade,event_time text not null,title text not null,description text,sort_order integer not null default 0,created_at timestamptz not null default now());
create table if not exists public.rsvps (id uuid primary key default gen_random_uuid(),invitation_id uuid not null references public.invitations(id) on delete cascade,guest_name text not null,phone text,attending boolean not null,guests_count integer not null default 1 check (guests_count between 1 and 20),meal_preference text check (meal_preference is null or meal_preference in ('Standard','Vegetarian','Vegan')),note text,created_at timestamptz not null default now());
create table if not exists public.guestbook_messages (id uuid primary key default gen_random_uuid(),invitation_id uuid not null references public.invitations(id) on delete cascade,guest_name text not null check (char_length(trim(guest_name)) between 1 and 80),message text not null check (char_length(trim(message)) between 1 and 500),approved boolean not null default true,created_at timestamptz not null default now());

create index if not exists invitations_owner_id_idx on public.invitations(owner_id);
create index if not exists invitation_gallery_invitation_id_idx on public.invitation_gallery(invitation_id);
create index if not exists invitation_events_invitation_id_idx on public.invitation_events(invitation_id);
create index if not exists rsvps_invitation_id_idx on public.rsvps(invitation_id);
create index if not exists rsvps_invitation_created_idx on public.rsvps(invitation_id,created_at desc);
create index if not exists guestbook_messages_invitation_id_idx on public.guestbook_messages(invitation_id);

alter table public.invitations enable row level security;
alter table public.invitation_gallery enable row level security;
alter table public.invitation_events enable row level security;
alter table public.rsvps enable row level security;
alter table public.guestbook_messages enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='owners can read invitations') then create policy "owners can read invitations" on public.invitations for select using (auth.uid() = owner_id or published = true); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='owners can insert invitations') then create policy "owners can insert invitations" on public.invitations for insert with check (auth.uid() = owner_id); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='owners can update invitations') then create policy "owners can update invitations" on public.invitations for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitations' and policyname='owners can delete invitations') then create policy "owners can delete invitations" on public.invitations for delete using (auth.uid() = owner_id); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitation_gallery' and policyname='public can read published gallery') then create policy "public can read published gallery" on public.invitation_gallery for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true)); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitation_gallery' and policyname='owners can manage gallery') then create policy "owners can manage gallery" on public.invitation_gallery for all using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitation_events' and policyname='public can read events for published invitations') then create policy "public can read events for published invitations" on public.invitation_events for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true)); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='invitation_events' and policyname='owners can manage invitation events') then create policy "owners can manage invitation events" on public.invitation_events for all using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rsvps' and policyname='public can submit RSVP') then create policy "public can submit RSVP" on public.rsvps for insert with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true)); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rsvps' and policyname='owners can read RSVPs') then create policy "owners can read RSVPs" on public.rsvps for select using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='rsvps' and policyname='owners can delete RSVPs') then create policy "owners can delete RSVPs" on public.rsvps for delete using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='guestbook_messages' and policyname='public can read approved guestbook messages') then create policy "public can read approved guestbook messages" on public.guestbook_messages for select using (approved = true and exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true)); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='guestbook_messages' and policyname='public can submit guestbook messages') then create policy "public can submit guestbook messages" on public.guestbook_messages for insert with check (approved = true and exists (select 1 from public.invitations i where i.id = invitation_id and i.published = true)); end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='guestbook_messages' and policyname='owners can manage guestbook') then create policy "owners can manage guestbook" on public.guestbook_messages for all using (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())) with check (exists (select 1 from public.invitations i where i.id = invitation_id and i.owner_id = auth.uid())); end if;
end $$;

insert into storage.buckets (id,name,public) values ('invitation-media','invitation-media',true) on conflict (id) do update set public=excluded.public;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='public can view invitation media') then create policy "public can view invitation media" on storage.objects for select using (bucket_id='invitation-media'); end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='authenticated users can upload invitation media') then create policy "authenticated users can upload invitation media" on storage.objects for insert to authenticated with check (bucket_id='invitation-media' and (storage.foldername(name))[1]=(select auth.uid()::text)); end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='users can update invitation media') then create policy "users can update invitation media" on storage.objects for update to authenticated using (bucket_id='invitation-media' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='invitation-media' and (storage.foldername(name))[1]=(select auth.uid()::text)); end if;
  if not exists (select 1 from pg_policies where schemaname='storage' and tablename='objects' and policyname='users can delete invitation media') then create policy "users can delete invitation media" on storage.objects for delete to authenticated using (bucket_id='invitation-media' and (storage.foldername(name))[1]=(select auth.uid()::text)); end if;
end $$;