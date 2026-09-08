create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  product_type text not null default 'template' check (product_type in ('invitation','template')),
  template_id uuid references public.template_catalog(id) on delete set null,
  price_aed numeric(10,2) not null default 0,
  preview_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','paid','cancelled','refunded')),
  total_aed numeric(10,2) not null default 0,
  provider text,
  provider_order_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check (quantity > 0),
  unit_price_aed numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.user_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id),
  order_id uuid references public.orders(id) on delete set null,
  invitation_id uuid references public.invitations(id) on delete set null,
  purchased_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.user_products enable row level security;

create policy "public can read active products" on public.products for select to anon, authenticated using (active = true);
create policy "owners can read orders" on public.orders for select to authenticated using (user_id = auth.uid());
create policy "owners can create orders" on public.orders for insert to authenticated with check (user_id = auth.uid());
create policy "owners can read order items" on public.order_items for select to authenticated using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "owners can create order items" on public.order_items for insert to authenticated with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "owners can read purchased products" on public.user_products for select to authenticated using (user_id = auth.uid());

insert into public.products (slug,name,description,product_type,template_id,price_aed,preview_url)
select 'template-'||t.slug,t.name,t.description,'template',t.id,t.price_aed,t.preview_url
from public.template_catalog t
where t.active = true
on conflict (slug) do update set name=excluded.name,description=excluded.description,template_id=excluded.template_id,price_aed=excluded.price_aed,preview_url=excluded.preview_url,active=true;

insert into public.products (slug,name,description,product_type,price_aed)
values ('custom-invitation','Custom Wedding Invitation','A fully personalized Everly wedding invitation created from your chosen design.','invitation',99)
on conflict (slug) do update set name=excluded.name,description=excluded.description,product_type=excluded.product_type,price_aed=excluded.price_aed,active=true;

-- Remove the recurring subscription model.
drop function if exists public.get_my_entitlements();
alter table public.invitations drop column if exists plan_id;
drop table if exists public.subscriptions;
drop table if exists public.plans;
