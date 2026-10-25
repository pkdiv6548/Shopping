-- Apply ONLY to a dedicated Shopping Mart Supabase project.
create extension if not exists pgcrypto;
create table if not exists public.sm_categories (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 name_en text not null, name_hi text not null, sort_order integer not null default 0,
 created_at timestamptz not null default now()
);
create table if not exists public.sm_products (
 id uuid primary key default gen_random_uuid(), slug text not null unique,
 name_en text not null, name_hi text not null, description_en text not null default '',
 description_hi text not null default '', category_id uuid references public.sm_categories(id) on delete set null,
 price_inr integer not null check (price_inr >= 0),
 compare_at_price_inr integer check (compare_at_price_inr is null or compare_at_price_inr >= price_inr),
 colour_en text not null default '', colour_hi text not null default '',
 status text not null default 'draft' check (status in ('draft','active','archived')),
 featured boolean not null default false, created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.sm_product_images (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.sm_products(id) on delete cascade,
 image_path text not null, alt_en text not null default '', alt_hi text not null default '',
 sort_order integer not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.sm_variants (
 id uuid primary key default gen_random_uuid(), product_id uuid not null references public.sm_products(id) on delete cascade,
 sku text unique, size_label text not null, stock_quantity integer not null default 0 check (stock_quantity >= 0),
 created_at timestamptz not null default now(), unique(product_id,size_label)
);
create table if not exists public.sm_wishlists (
 user_id uuid not null references auth.users(id) on delete cascade,
 product_id uuid not null references public.sm_products(id) on delete cascade,
 created_at timestamptz not null default now(), primary key(user_id,product_id)
);
create table if not exists public.sm_orders (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 order_number text not null unique default ('SM-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
 status text not null default 'demo_pending' check(status in ('demo_pending','demo_confirmed','cancelled')),
 currency text not null default 'INR' check(currency='INR'),
 subtotal_inr integer not null check(subtotal_inr >= 0), is_demo boolean not null default true check(is_demo=true),
 created_at timestamptz not null default now()
);
create table if not exists public.sm_order_items (
 id uuid primary key default gen_random_uuid(), order_id uuid not null references public.sm_orders(id) on delete cascade,
 product_id uuid references public.sm_products(id) on delete set null, product_name_en text not null,
 product_name_hi text not null, size_label text not null default '', quantity integer not null check(quantity > 0),
 unit_price_inr integer not null check(unit_price_inr >= 0)
);
create index if not exists sm_products_category_status_idx on public.sm_products(category_id,status);
create index if not exists sm_product_images_product_idx on public.sm_product_images(product_id,sort_order);
create index if not exists sm_variants_product_idx on public.sm_variants(product_id);
create index if not exists sm_orders_user_created_idx on public.sm_orders(user_id,created_at desc);
create index if not exists sm_order_items_order_idx on public.sm_order_items(order_id);
alter table public.sm_categories enable row level security;
alter table public.sm_products enable row level security;
alter table public.sm_product_images enable row level security;
alter table public.sm_variants enable row level security;
alter table public.sm_wishlists enable row level security;
alter table public.sm_orders enable row level security;
alter table public.sm_order_items enable row level security;
create policy "Anyone can read Shopping Mart categories" on public.sm_categories for select to anon, authenticated using (true);
create policy "Anyone can read active Shopping Mart products" on public.sm_products for select to anon, authenticated using (status='active');
create policy "Anyone can read images of active products" on public.sm_product_images for select to anon, authenticated using (exists(select 1 from public.sm_products p where p.id=product_id and p.status='active'));
create policy "Anyone can read variants of active products" on public.sm_variants for select to anon, authenticated using (exists(select 1 from public.sm_products p where p.id=product_id and p.status='active'));
create policy "Users manage own Shopping Mart wishlist" on public.sm_wishlists for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy "Users read own Shopping Mart demo orders" on public.sm_orders for select to authenticated using ((select auth.uid())=user_id);
create policy "Users read own Shopping Mart order items" on public.sm_order_items for select to authenticated using (exists(select 1 from public.sm_orders o where o.id=order_id and o.user_id=(select auth.uid())));
-- Public order writes intentionally disabled. Add a validated server-side checkout after auth and admin rules are reviewed.
