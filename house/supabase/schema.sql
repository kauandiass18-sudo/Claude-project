-- =========================================================================
-- House Hamburgueria 66 · banco de dados (Supabase / PostgreSQL)
-- Rode uma única vez no SQL Editor de um projeto Supabase novo.
-- Depois crie o acesso ao painel (README, passo 3).
-- =========================================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------------ acesso
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  criado_em timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ------------------------------------------------------------------ cardápio
create table if not exists public.config (
  chave text primary key,
  valor jsonb not null default '{}',
  atualizado_em timestamptz not null default now()
);

create table if not exists public.categorias (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  nome text not null,
  ordem int not null default 0,
  ativo boolean not null default true,
  estilo text not null default 'normal' check (estilo in ('normal', 'destaque')),
  foto text not null default ''
);

create table if not exists public.produtos (
  id uuid primary key default gen_random_uuid(),
  categoria_id text references public.categorias (id) on update cascade on delete set null,
  nome text not null check (length(trim(nome)) > 0),
  descricao text not null default '',
  preco numeric(10, 2) check (preco is null or preco >= 0),
  a_partir_de boolean not null default false,
  foto text not null default '',
  selo text not null default '',
  destaque boolean not null default false,
  ativo boolean not null default true,
  ordem int not null default 0,
  opcoes jsonb not null default '[]' check (jsonb_typeof(opcoes) = 'array'),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists produtos_categoria_idx on public.produtos (categoria_id);

create table if not exists public.promocoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text not null default '',
  preco numeric(10, 2) check (preco is null or preco >= 0),
  a_partir_de boolean not null default false,
  foto text not null default '',
  produto_id uuid references public.produtos (id) on delete set null,
  selo text not null default '',
  ativo boolean not null default true,
  ordem int not null default 0
);

-- ------------------------------------------------------------------ pedidos
create sequence if not exists public.pedido_numero_seq start 1001;

create table if not exists public.pedidos (
  id uuid primary key default gen_random_uuid(),
  numero int not null unique default nextval('public.pedido_numero_seq'),
  status text not null default 'novo' check (status in ('novo', 'preparo', 'saiu', 'concluido', 'cancelado')),
  cliente jsonb not null,
  modalidade text not null check (modalidade in ('entrega', 'retirada')),
  endereco jsonb not null default '{}',
  pagamento text not null default '',
  observacoes text not null default '',
  itens jsonb not null,
  subtotal numeric(10, 2) not null,
  taxa numeric(10, 2),
  total numeric(10, 2) not null,
  criado_em timestamptz not null default now()
);
create index if not exists pedidos_criado_idx on public.pedidos (criado_em desc);

create or replace function public.tocar_atualizado()
returns trigger language plpgsql as $$
begin new.atualizado_em = now(); return new; end;
$$;
drop trigger if exists produtos_tocar on public.produtos;
create trigger produtos_tocar before update on public.produtos for each row execute function public.tocar_atualizado();

-- ------------------------------------------------------------------ criar pedido
-- Única porta de entrada de pedidos do site. Recalcula preços pelo cardápio
-- do banco: o valor enviado pelo navegador nunca é usado.
create or replace function public.criar_pedido(p jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  it jsonb; sel jsonb; grp jsonb; opt jsonb;
  prod public.produtos;
  loja jsonb;
  qtd int; unit numeric; sub numeric := 0; taxa numeric; n int;
  itens jsonb := '[]'; escolhas jsonb;
  modal text := p->>'modalidade';
  nome text := left(trim(coalesce(p #>> '{cliente,nome}', '')), 80);
  fone text := regexp_replace(coalesce(p #>> '{cliente,telefone}', ''), '\D', '', 'g');
  novo public.pedidos;
begin
  if modal not in ('entrega', 'retirada') then raise exception 'Escolha entrega ou retirada.'; end if;
  if length(nome) < 2 then raise exception 'Informe seu nome.'; end if;
  if length(fone) < 10 or length(fone) > 13 then raise exception 'Informe um telefone válido.'; end if;
  if jsonb_typeof(p->'itens') is distinct from 'array' or jsonb_array_length(p->'itens') = 0 then raise exception 'Sua sacola está vazia.'; end if;
  if jsonb_array_length(p->'itens') > 40 then raise exception 'Pedido grande demais para o site. Fale com a loja pelo WhatsApp.'; end if;

  select valor into loja from public.config where chave = 'loja';
  loja := coalesce(loja, '{}');
  if modal = 'entrega' and (loja->>'entrega') = 'false' then raise exception 'A loja não está fazendo entregas pelo site.'; end if;
  if modal = 'retirada' and (loja->>'retirada') = 'false' then raise exception 'A loja não está aceitando retirada pelo site.'; end if;
  if modal = 'entrega' and (length(trim(coalesce(p #>> '{endereco,rua}', ''))) < 3 or length(trim(coalesce(p #>> '{endereco,bairro}', ''))) < 2) then
    raise exception 'Informe o endereço e o bairro para entrega.';
  end if;

  for it in select value from jsonb_array_elements(p->'itens') loop
    begin
      select * into prod from public.produtos where id = (it->>'id')::uuid and ativo;
    exception when invalid_text_representation then prod := null;
    end;
    if prod.id is null or prod.preco is null then raise exception 'Um item da sacola não está mais disponível. Atualize a página.'; end if;
    qtd := greatest(1, least(50, coalesce((it->>'qtd')::int, 1)));
    unit := prod.preco;
    escolhas := '[]';
    for sel in select value from jsonb_array_elements(coalesce(it->'opcoes', '[]')) loop
      opt := null;
      select o.value into opt
        from jsonb_array_elements(prod.opcoes) g(value), jsonb_array_elements(g.value->'itens') o(value)
       where g.value->>'nome' = sel->>'grupo' and o.value->>'nome' = sel->>'item'
       limit 1;
      if opt is null then raise exception 'Uma opção escolhida em "%" não existe mais. Atualize a página.', prod.nome; end if;
      unit := unit + coalesce((opt->>'preco')::numeric, 0);
      escolhas := escolhas || jsonb_build_array(jsonb_build_object('grupo', sel->>'grupo', 'item', sel->>'item', 'preco', coalesce((opt->>'preco')::numeric, 0)));
    end loop;
    -- grupos obrigatórios e limites
    for grp in select value from jsonb_array_elements(prod.opcoes) loop
      select count(*) into n from jsonb_array_elements(escolhas) e(value) where e.value->>'grupo' = grp->>'nome';
      if (grp->>'obrigatorio') = 'true' and n < 1 then raise exception 'Escolha uma opção em "%" de %.', grp->>'nome', prod.nome; end if;
      if (grp->>'tipo') = 'uma' and n > 1 then raise exception 'Escolha só uma opção em "%".', grp->>'nome'; end if;
      if coalesce((grp->>'max')::int, 0) > 0 and n > (grp->>'max')::int then raise exception 'Limite de opções em "%" excedido.', grp->>'nome'; end if;
    end loop;
    sub := sub + unit * qtd;
    itens := itens || jsonb_build_array(jsonb_build_object(
      'produtoId', prod.id, 'nome', prod.nome, 'qtd', qtd, 'unitario', unit, 'aPartirDe', prod.a_partir_de,
      'opcoes', escolhas, 'obs', left(coalesce(it->>'obs', ''), 200), 'total', unit * qtd));
  end loop;

  if modal = 'entrega' then
    taxa := case when jsonb_typeof(loja->'taxaEntrega') = 'number' then (loja->>'taxaEntrega')::numeric else null end;
  else
    taxa := 0;
  end if;

  insert into public.pedidos (cliente, modalidade, endereco, pagamento, observacoes, itens, subtotal, taxa, total)
  values (
    jsonb_build_object('nome', nome, 'telefone', fone),
    modal,
    case when modal = 'entrega' then jsonb_build_object(
      'rua', left(p #>> '{endereco,rua}', 160), 'bairro', left(p #>> '{endereco,bairro}', 80),
      'referencia', left(coalesce(p #>> '{endereco,referencia}', ''), 160)) else '{}'::jsonb end,
    left(coalesce(p->>'pagamento', ''), 40),
    left(coalesce(p->>'observacoes', ''), 500),
    itens, sub, taxa, sub + coalesce(taxa, 0)
  ) returning * into novo;

  return to_jsonb(novo);
end;
$$;

revoke all on function public.criar_pedido(jsonb) from public;
grant execute on function public.criar_pedido(jsonb) to anon, authenticated;

-- ------------------------------------------------------------------ regras de acesso (RLS)
alter table public.admins enable row level security;
alter table public.config enable row level security;
alter table public.categorias enable row level security;
alter table public.produtos enable row level security;
alter table public.promocoes enable row level security;
alter table public.pedidos enable row level security;

drop policy if exists "admins: ver a si" on public.admins;
create policy "admins: ver a si" on public.admins for select using (user_id = auth.uid());

drop policy if exists "config: leitura" on public.config;
create policy "config: leitura" on public.config for select using (true);
drop policy if exists "config: admin" on public.config;
create policy "config: admin" on public.config for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categorias: leitura" on public.categorias;
create policy "categorias: leitura" on public.categorias for select using (ativo or public.is_admin());
drop policy if exists "categorias: admin" on public.categorias;
create policy "categorias: admin" on public.categorias for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "produtos: leitura" on public.produtos;
create policy "produtos: leitura" on public.produtos for select using (ativo or public.is_admin());
drop policy if exists "produtos: admin" on public.produtos;
create policy "produtos: admin" on public.produtos for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "promocoes: leitura" on public.promocoes;
create policy "promocoes: leitura" on public.promocoes for select using (ativo or public.is_admin());
drop policy if exists "promocoes: admin" on public.promocoes;
create policy "promocoes: admin" on public.promocoes for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos entram só pela função criar_pedido. Só o painel lê e altera.
drop policy if exists "pedidos: admin lê" on public.pedidos;
create policy "pedidos: admin lê" on public.pedidos for select using (public.is_admin());
drop policy if exists "pedidos: admin altera" on public.pedidos;
create policy "pedidos: admin altera" on public.pedidos for update using (public.is_admin()) with check (public.is_admin());

-- ------------------------------------------------------------------ fotos
insert into storage.buckets (id, name, public) values ('cardapio', 'cardapio', true)
on conflict (id) do nothing;

drop policy if exists "cardapio: leitura" on storage.objects;
create policy "cardapio: leitura" on storage.objects for select using (bucket_id = 'cardapio');
drop policy if exists "cardapio: admin envia" on storage.objects;
create policy "cardapio: admin envia" on storage.objects for insert with check (bucket_id = 'cardapio' and public.is_admin());
drop policy if exists "cardapio: admin altera" on storage.objects;
create policy "cardapio: admin altera" on storage.objects for update using (bucket_id = 'cardapio' and public.is_admin());
drop policy if exists "cardapio: admin remove" on storage.objects;
create policy "cardapio: admin remove" on storage.objects for delete using (bucket_id = 'cardapio' and public.is_admin());

-- ------------------------------------------------------------------ dados iniciais
-- Os mesmos de assets/js/dados.js (informações do Instagram da loja).
insert into public.config (chave, valor) values ('loja', '{}') on conflict (chave) do nothing;

insert into public.categorias (id, nome, ordem, estilo, foto) values
  ('piscinas', 'Piscinas de Cheddar', 1, 'destaque', 'assets/img/destaque-piscinas.webp'),
  ('mini-burgers', 'Mini Burgers', 2, 'normal', 'assets/img/destaque-mini-burgers.webp'),
  ('lanches', 'Lanches', 3, 'normal', 'assets/img/destaque-lanches.webp'),
  ('promocoes', 'Promoções', 4, 'normal', 'assets/img/destaque-promocoes.webp'),
  ('porcoes', 'Porções', 5, 'normal', 'assets/img/destaque-porcoes.webp'),
  ('bebidas', 'Bebidas', 6, 'normal', '')
on conflict (id) do nothing;

with piscina as (
  insert into public.produtos (categoria_id, nome, descricao, preco, a_partir_de, foto, selo, destaque, ordem)
  select 'piscinas', 'Piscina de Cheddar',
         'Hambúrgueres no pão, batata frita e bacon, tudo coberto de cheddar artesanal e servido na mesma bandeja.',
         94.99, true, 'assets/img/piscina-de-cheddar.webp', 'Destaque da casa', true, 1
   where not exists (select 1 from public.produtos where nome = 'Piscina de Cheddar')
  returning id
)
insert into public.promocoes (titulo, texto, preco, a_partir_de, foto, produto_id, ordem)
select 'Piscinas de Cheddar',
       'Cansado de comer sempre a mesma coisa? Fuja da rotina com as nossas piscinas de cheddar artesanal.',
       94.99, true, 'assets/img/piscina-de-cheddar.webp', id, 1
  from piscina;
