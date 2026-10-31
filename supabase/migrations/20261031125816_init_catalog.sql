-- ตารางร้าน Song Soul Deals: หมวด สินค้า และคลิก
-- ผู้เยี่ยมชมอ่านได้เฉพาะสินค้าที่เผยแพร่
-- การเขียนสินค้าทำได้เมื่ออีเมลอยู่ใน admin_allowlist
-- การบันทึกคลิกทำผ่าน service role บนเซิร์ฟเวอร์ ไม่เปิดให้ anon แทรกเอง

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated, service_role;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '',
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete restrict,
  name text not null check (char_length(name) between 1 and 120),
  price_note text not null default '' check (char_length(price_note) <= 80),
  review text not null default '' check (char_length(review) <= 400),
  image_url text not null default '' check (
    image_url = ''
    or image_url ~ '^https://'
    or image_url ~ '^/[^/]'
  ),
  affiliate_url text not null check (
    char_length(affiliate_url) between 8 and 2000
    and affiliate_url ~ '^https://'
  ),
  published boolean not null default false,
  is_sample boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clicks (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  clicked_at timestamptz not null default now()
);

create table public.admin_allowlist (
  email text primary key check (email = lower(email) and email ~ '^[^@[:space:]]+@[^@[:space:]]+$'),
  created_at timestamptz not null default now()
);

create index products_category_id_idx on public.products (category_id);
create index products_published_sort_idx on public.products (published, sort_order);
create index clicks_product_clicked_idx on public.clicks (product_id, clicked_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_set_updated_at
before update on public.products
for each row
execute function private.set_updated_at();

-- security definer อยู่ในสคีมา private ที่ไม่ได้เปิดผ่าน Data API
-- อ่านอีเมลจาก JWT ของระบบยืนยันตัวตน ไม่ได้อ่าน user_metadata
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_allowlist as allowlist
    where allowlist.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function private.is_admin() from public;
revoke all on function private.set_updated_at() from public;
grant execute on function private.is_admin() to anon, authenticated, service_role;
grant execute on function private.set_updated_at() to authenticated, service_role;

-- สรุปยอดคลิกแบบ security invoker เพื่อให้ RLS ของคลิกยังมีผล
create or replace function public.admin_click_summary(month_start timestamptz)
returns table (
  product_id uuid,
  total_clicks bigint,
  month_clicks bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    product.id,
    (
      select count(*)
      from public.clicks as click
      where click.product_id = product.id
    ) as total_clicks,
    (
      select count(*)
      from public.clicks as click
      where click.product_id = product.id
        and click.clicked_at >= month_start
    ) as month_clicks
  from public.products as product
  where private.is_admin();
$$;

revoke all on function public.admin_click_summary(timestamptz) from public, anon;
grant execute on function public.admin_click_summary(timestamptz) to authenticated;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.clicks enable row level security;
alter table public.admin_allowlist enable row level security;

alter table public.categories force row level security;
alter table public.products force row level security;
alter table public.clicks force row level security;
alter table public.admin_allowlist force row level security;

revoke all on public.categories from anon, authenticated;
revoke all on public.products from anon, authenticated;
revoke all on public.clicks from anon, authenticated;
revoke all on public.admin_allowlist from anon, authenticated;

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

grant select on public.clicks to authenticated;

create policy "อ่านหมวดสินค้า"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "ผู้ดูแลจัดการหมวด"
  on public.categories
  for all
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "อ่านสินค้าที่เผยแพร่หรือผู้ดูแลอ่านทั้งหมด"
  on public.products
  for select
  to anon, authenticated
  using (published = true or private.is_admin());

create policy "ผู้ดูแลเพิ่มสินค้า"
  on public.products
  for insert
  to authenticated
  with check (private.is_admin());

create policy "ผู้ดูแลแก้ไขสินค้า"
  on public.products
  for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());

create policy "ผู้ดูแลลบสินค้า"
  on public.products
  for delete
  to authenticated
  using (private.is_admin());

create policy "ผู้ดูแลอ่านคลิก"
  on public.clicks
  for select
  to authenticated
  using (private.is_admin());

insert into public.categories (id, slug, name, description, sort_order)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'sleeves-boxes',
    'ซอง/กล่องใส่การ์ด',
    'ซองใส่การ์ด กล่องเดค และกล่องเก็บการ์ด',
    1
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'play-accessories',
    'อุปกรณ์เล่นการ์ด',
    'เพลย์แมต ลูกเต๋า และอุปกรณ์บนโต๊ะเล่น',
    2
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'gaming-gear',
    'จอย/หูฟัง/ไมค์เกมมิ่ง',
    'จอย หูฟัง และไมโครโฟนสำหรับเล่นเกม',
    3
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'other',
    'อื่นๆ',
    'สินค้าที่ยังไม่เข้าสามหมวดด้านบน',
    4
  );

-- สินค้าตัวอย่าง: ไม่ใส่ราคา และรีวิวเป็นข้อความว่ายังไม่มีข้อมูลจริง
insert into public.products (
  id,
  category_id,
  name,
  price_note,
  review,
  image_url,
  affiliate_url,
  published,
  is_sample,
  sort_order
)
values
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'สินค้าตัวอย่าง: ซองใส่การ์ด',
    '',
    'ตัวอย่าง รอใส่ข้อมูลจริง',
    '/samples/sleeves.svg',
    'https://shopee.co.th',
    true,
    true,
    1
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    '11111111-1111-4111-8111-111111111111',
    'สินค้าตัวอย่าง: กล่องเก็บการ์ดสำหรับเดค',
    '',
    'ตัวอย่าง รอใส่ข้อมูลจริง',
    '/samples/box.svg',
    'https://shopee.co.th',
    true,
    true,
    2
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    '22222222-2222-4222-8222-222222222222',
    'สินค้าตัวอย่าง: แผ่นรองเล่นการ์ด',
    '',
    'ตัวอย่าง รอใส่ข้อมูลจริง',
    '/samples/mat.svg',
    'https://shopee.co.th',
    true,
    true,
    1
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    '33333333-3333-4333-8333-333333333333',
    'สินค้าตัวอย่าง: จอยเกม',
    '',
    'ตัวอย่าง รอใส่ข้อมูลจริง',
    '/samples/controller.svg',
    'https://shopee.co.th',
    true,
    true,
    1
  );
