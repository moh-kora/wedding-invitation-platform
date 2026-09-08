create table if not exists public.template_catalog (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  preview_url text,
  category text not null default 'luxury',
  is_premium boolean not null default false,
  price_aed numeric(10,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  price_aed numeric(10,2) not null default 0,
  billing_period text not null default 'one_time' check (billing_period in ('one_time','monthly','yearly')),
  invitation_limit integer,
  gallery_limit integer not null default 20,
  custom_domain boolean not null default false,
  analytics boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.customer_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.plans(id),
  status text not null default 'active' check (status in ('trialing','active','past_due','cancelled','expired')),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.invitations add column if not exists plan_id uuid references public.plans(id);
alter table public.invitations add column if not exists custom_domain text;
alter table public.invitations add column if not exists seo_title text;
alter table public.invitations add column if not exists seo_description text;

create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
create index if not exists invitations_owner_id_idx on public.invitations(owner_id);
create index if not exists invitations_custom_domain_idx on public.invitations(custom_domain) where custom_domain is not null;

alter table public.template_catalog enable row level security;
alter table public.plans enable row level security;
alter table public.customer_profiles enable row level security;
alter table public.subscriptions enable row level security;

create policy "public can read active templates" on public.template_catalog for select to anon, authenticated using (active = true);
create policy "public can read active plans" on public.plans for select to anon, authenticated using (active = true);
create policy "owners can manage customer profile" on public.customer_profiles for all to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "owners can read subscriptions" on public.subscriptions for select to authenticated using (user_id = auth.uid());

insert into public.template_catalog (slug,name,description,category,is_premium,price_aed) values
('editorial','Editorial','Clean luxury editorial invitation with refined typography.','luxury',false,0),
('romantic','Romantic','Soft romantic invitation with elegant floral-inspired styling.','romantic',false,0),
('minimal','Minimal','Modern minimalist invitation focused on names and details.','modern',false,0),
('royal','Royal','Premium formal invitation with a rich ceremonial aesthetic.','luxury',true,49),
('garden','Garden','Premium botanical-inspired invitation for an intimate celebration.','romantic',true,49),
('noir','Noir','Premium dark editorial invitation with cinematic luxury styling.','modern',true,69)
on conflict (slug) do nothing;

insert into public.plans (slug,name,description,price_aed,billing_period,invitation_limit,gallery_limit,custom_domain,analytics) values
('free','Free','Create and publish one invitation.',0,'one_time',1,10,false,false),
('premium','Premium','Unlock premium templates, larger galleries and RSVP analytics.',99,'one_time',5,100,false,true),
('pro','Pro','For professional creators and wedding planners.',249,'yearly',25,500,true,true)
on conflict (slug) do nothing;

revoke execute on function public.rls_auto_enable() from anon, authenticated;
