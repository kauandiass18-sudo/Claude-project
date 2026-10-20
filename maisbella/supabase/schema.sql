-- =========================================================================
-- Mais Bella Semijoias · banco de dados (Supabase / PostgreSQL)
-- Execute no SQL Editor do Supabase, uma única vez, em um projeto novo.
-- Depois, cadastre a administradora (ver README, passo "Criar acesso ao painel").
-- =========================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------ admins
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ------------------------------------------------------------------ catálogo
create table if not exists public.categories (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  description text not null default '',
  image text not null default '',
  position int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null,
  category_slug text references public.categories (slug) on update cascade on delete set null,
  tags text[] not null default '{}',
  material text not null default '',
  finish text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price is null or compare_at_price > price),
  stock int check (stock is null or stock >= 0),
  position int not null default 0,
  active boolean not null default true,
  images text[] not null default '{}',
  description text not null default '',
  details jsonb not null default '{}',
  options jsonb not null default '[]',
  personalization jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_slug);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  code text primary key check (code = upper(code)),
  kind text not null check (kind in ('percent', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  min_subtotal numeric(10, 2) not null default 0,
  expires_at timestamptz,
  usage_limit int,
  used_count int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ pedidos
create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  number int not null unique default nextval('public.order_number_seq'),
  access_token uuid not null default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'aguardando'
    check (status in ('aguardando', 'pago', 'em_producao', 'separacao', 'enviado', 'entregue', 'cancelado')),
  customer jsonb not null,
  address jsonb not null,
  shipping jsonb,
  items jsonb not null,
  totals jsonb not null,
  total numeric(10, 2) not null,
  coupon text,
  gift_wrap boolean not null default false,
  gift_message text not null default '',
  payment_method text not null check (payment_method in ('pix', 'card', 'whatsapp')),
  payment_id text,
  payment_status text,
  payment_data jsonb not null default '{}',
  tracking_code text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id);
create index if not exists orders_created_idx on public.orders (created_at desc);

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------------ estoque
-- Reserva o estoque de todos os itens ou falha por inteiro. Só o servidor (service role) chama.
create or replace function public.reserve_stock(p_items jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare it jsonb; left_stock int;
begin
  for it in select * from jsonb_array_elements(p_items) loop
    update public.products
       set stock = stock - (it->>'qty')::int
     where id = (it->>'id')::uuid and stock is not null
       and stock >= (it->>'qty')::int
    returning stock into left_stock;
    if not found and exists (select 1 from public.products where id = (it->>'id')::uuid and stock is not null) then
      raise exception 'estoque_insuficiente:%', it->>'name';
    end if;
  end loop;
end;
$$;

-- Devolve o estoque quando um pedido é cancelado.
create or replace function public.restore_stock_on_cancel()
returns trigger language plpgsql security definer set search_path = public as $$
declare it jsonb;
begin
  if new.status = 'cancelado' and old.status <> 'cancelado' then
    for it in select * from jsonb_array_elements(new.items) loop
      update public.products set stock = stock + (it->>'qty')::int
       where id = (it->>'id')::uuid and stock is not null;
    end loop;
  end if;
  return new;
end;
$$;
drop trigger if exists orders_restore_stock on public.orders;
create trigger orders_restore_stock after update of status on public.orders for each row execute function public.restore_stock_on_cancel();

-- ------------------------------------------------------------------ RPCs públicas
-- Consulta de pedido pelo link (id + token secreto), sem expor outros pedidos.
create or replace function public.get_order(p_id uuid, p_token uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select (to_jsonb(o) - 'access_token' - 'user_id') || jsonb_build_object('token', o.access_token)
    from public.orders o where o.id = p_id and o.access_token = p_token;
$$;

-- Prévia do cupom no checkout. O valor final é recalculado no servidor.
create or replace function public.check_coupon(p_code text, p_subtotal numeric)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare c public.coupons; d numeric;
begin
  select * into c from public.coupons where code = upper(trim(p_code));
  if not found or not c.active then return jsonb_build_object('valid', false, 'message', 'Cupom inválido.'); end if;
  if c.expires_at is not null and c.expires_at < now() then return jsonb_build_object('valid', false, 'message', 'Este cupom expirou.'); end if;
  if c.usage_limit is not null and c.used_count >= c.usage_limit then return jsonb_build_object('valid', false, 'message', 'Este cupom atingiu o limite de uso.'); end if;
  if p_subtotal < c.min_subtotal then return jsonb_build_object('valid', false, 'message', 'Válido para compras a partir de R$ ' || to_char(c.min_subtotal, 'FM999G990D00')); end if;
  d := case when c.kind = 'percent' then round(p_subtotal * c.value / 100, 2) else least(c.value, p_subtotal) end;
  return jsonb_build_object('valid', true, 'discount', d,
    'label', case when c.kind = 'percent' then trim(to_char(c.value, 'FM990')) || '% de desconto' else 'R$ ' || to_char(c.value, 'FM999G990D00') || ' de desconto' end);
end;
$$;

revoke all on function public.reserve_stock(jsonb) from public, anon, authenticated;
grant execute on function public.get_order(uuid, uuid) to anon, authenticated;
grant execute on function public.check_coupon(text, numeric) to anon, authenticated;

-- ------------------------------------------------------------------ RLS
alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;

drop policy if exists "admins: ver a si mesma" on public.admins;
create policy "admins: ver a si mesma" on public.admins for select using (user_id = auth.uid());

drop policy if exists "categorias: leitura" on public.categories;
create policy "categorias: leitura" on public.categories for select using (active or public.is_admin());
drop policy if exists "categorias: admin" on public.categories;
create policy "categorias: admin" on public.categories for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "produtos: leitura" on public.products;
create policy "produtos: leitura" on public.products for select using (active or public.is_admin());
drop policy if exists "produtos: admin" on public.products;
create policy "produtos: admin" on public.products for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "config: leitura" on public.settings;
create policy "config: leitura" on public.settings for select using (true);
drop policy if exists "config: admin" on public.settings;
create policy "config: admin" on public.settings for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "cupons: admin" on public.coupons;
create policy "cupons: admin" on public.coupons for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos são criados apenas pela função "checkout" (service role).
drop policy if exists "pedidos: cliente lê os seus" on public.orders;
create policy "pedidos: cliente lê os seus" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "pedidos: admin altera" on public.orders;
create policy "pedidos: admin altera" on public.orders for update using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------------ imagens
insert into storage.buckets (id, name, public) values ('catalogo', 'catalogo', true)
on conflict (id) do nothing;

drop policy if exists "catalogo: leitura" on storage.objects;
create policy "catalogo: leitura" on storage.objects for select using (bucket_id = 'catalogo');
drop policy if exists "catalogo: admin envia" on storage.objects;
create policy "catalogo: admin envia" on storage.objects for insert with check (bucket_id = 'catalogo' and public.is_admin());
drop policy if exists "catalogo: admin altera" on storage.objects;
create policy "catalogo: admin altera" on storage.objects for update using (bucket_id = 'catalogo' and public.is_admin());
drop policy if exists "catalogo: admin remove" on storage.objects;
create policy "catalogo: admin remove" on storage.objects for delete using (bucket_id = 'catalogo' and public.is_admin());

-- ------------------------------------------------------------------ dados iniciais
insert into public.categories (slug, name, description, image, position) values
  ('ouro-18k', 'Ouro 18K', 'Semijoias folheadas com visual sofisticado.', 'assets/img/editorial/cat-ouro.webp', 1),
  ('prata-925', 'Prata 925', 'Peças para quem aprecia elegância atemporal.', 'assets/img/editorial/cat-prata.webp', 2),
  ('aco-inoxidavel', 'Aço inoxidável', 'Design versátil para diferentes ocasiões.', 'assets/img/editorial/cat-aco.webp', 3),
  ('aliancas-personalizados', 'Alianças e personalizados', 'Peças especiais para celebrar conexões e momentos importantes.', 'assets/img/editorial/cat-aliancas.webp', 4)
on conflict (slug) do nothing;

-- Configurações começam vazias: o site usa os textos padrão até a loja editar no painel.
-- Pagamentos online e frete ficam desligados até serem configurados de verdade.
insert into public.settings (key, value) values ('store', '{}') on conflict (key) do nothing;
