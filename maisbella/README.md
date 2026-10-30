# Mais Bella Semijoias · Loja online

E-commerce completo para a Mais Bella Semijoias: vitrine, página de produto,
sacola, checkout, área da cliente, páginas institucionais e painel
administrativo. Feito com **HTML, CSS e JavaScript puro** (sem build), com
backend no **Supabase** (banco, login, imagens e funções) e pagamentos pelo
**Mercado Pago** (Pix e cartão).

## Dois modos de funcionamento

| | Demonstração (padrão) | Loja ativa |
| --- | --- | --- |
| Quando | `assets/js/config.js` sem chaves do Supabase | Chaves preenchidas |
| Catálogo | 13 peças ilustrativas | Produtos cadastrados no painel |
| Painel | Entra com um clique; salva neste navegador | Login com e-mail e senha da administradora |
| Pedidos | Salvos neste navegador; finalização pelo WhatsApp | Banco de dados; Pix e cartão reais |
| Pix / cartão | Exibidos como "disponível após ativação" | Funcionam após configurar o Mercado Pago |

**Sobre as imagens da demonstração:** todas as fotos de peças e cenas são
renderizações 3D criadas especialmente para esta apresentação, com materiais
físicos (ouro, prata, aço, zircônia, pérola). Elas não retratam peças reais da
loja e devem ser substituídas pelas fotografias oficiais. Nomes, preços,
parcelamento e frete da demonstração são ilustrativos.

## Páginas

| Arquivo | Conteúdo |
| --- | --- |
| `index.html` | Campanha, coleções, vitrine com filtros, essência da marca, presentes, alianças e faixa de confiança |
| `colecao.html` | Catálogo com categorias, filtros, ordenação, busca (`?busca=`) e favoritos (`?lista=favoritos`) |
| `produto.html?p=slug` | Galeria com zoom e tela cheia, variações, personalização com validação, compra e WhatsApp com o nome e o link da peça |
| `checkout.html` | Dados, entrega (CEP automático pelo ViaCEP, frete), pagamento, cupom, embalagem para presente |
| `pedido.html` | Confirmação, QR Code Pix com atualização automática, envio do pedido pelo WhatsApp |
| `conta.html` | Login, cadastro, recuperação de senha e histórico de pedidos |
| `sobre`, `contato`, `faq`, `entrega`, `trocas`, `garantia`, `privacidade`, `termos` | Páginas institucionais editáveis no painel |
| `admin.html` | Painel da loja |

Links úteis: `colecao.html?categoria=ouro-18k`, `colecao.html?filtro=novidades`,
`colecao.html?filtro=presentes`, `colecao.html?filtro=mais-vendidos`.

## Painel (`admin.html`)

- **Visão geral:** pedidos, vendas aprovadas, estoque baixo e lista do que falta para a loja ficar completa.
- **Pedidos:** busca, filtro por status, alteração de status, código de rastreio e atalho para o WhatsApp da cliente.
- **Produtos:** cadastro completo, envio de várias fotos (otimizadas automaticamente), reordenação, preço promocional, estoque, etiquetas (novidade, mais vendido, presente), detalhes da peça, variações (aro, tamanho) e campos de personalização.
- **Categorias e cupons.**
- **Página inicial:** faixa superior, campanha, imagens, essência, presentes, faixa de confiança e SEO.
- **Loja e atendimento:** WhatsApp, Instagram, e-mail, horário, mensagens automáticas, logotipo e dados legais.
- **Pagamento e entrega:** Pix, cartão, desconto no Pix, parcelamento, formas de entrega, frete grátis, Melhor Envio, embalagem para presente e prazo de peças personalizadas.
- **Páginas:** textos institucionais e perguntas frequentes.

## Testar no computador

```
cd maisbella
python3 -m http.server 8080
```

Abra `http://localhost:8080`.

---

## Ativar a loja de verdade

### 1. Supabase (banco, login e imagens)

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Em **SQL Editor**, cole e execute o arquivo `supabase/schema.sql`.
3. Em **Authentication → Users**, crie o usuário da administradora (e-mail e senha forte).
4. No **SQL Editor**, dê acesso ao painel:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-da-administradora@exemplo.com';
   ```
5. Em **Settings → API**, copie a *Project URL* e a chave *anon public* para `assets/js/config.js`.
   A chave anon é pública por design: quem protege os dados são as regras RLS do `schema.sql`.
   **Nunca** coloque a chave `service_role` no site.
6. Em **Authentication → URL Configuration**, informe o endereço do site (para os e-mails de confirmação e de nova senha).

### 2. Funções do servidor

Instale o [Supabase CLI](https://supabase.com/docs/guides/cli) e, na pasta `maisbella`:

```
supabase login
supabase link --project-ref SEU_PROJETO
supabase secrets set SITE_URL=https://seu-dominio.com.br
supabase secrets set MP_ACCESS_TOKEN=APP_USR-...        # Mercado Pago (produção)
supabase secrets set ALLOWED_ORIGIN=https://seu-dominio.com.br
# opcional, frete automático:
supabase secrets set MELHOR_ENVIO_TOKEN=...
supabase functions deploy checkout
supabase functions deploy mp-webhook --no-verify-jwt
supabase functions deploy frete
```

- `checkout` recalcula preços, frete, cupom e estoque no servidor (o navegador não define valores) e cria a cobrança.
- `mp-webhook` recebe as notificações do Mercado Pago e consulta o pagamento na API antes de marcar o pedido como pago.
- `frete` cota o Melhor Envio quando ativado no painel.

### 3. Mercado Pago

1. Crie a aplicação em **Suas integrações** no painel de desenvolvedor do Mercado Pago e copie o *Access Token* de produção.
2. Cadastre a chave Pix na conta Mercado Pago.
3. Em **Webhooks**, informe `https://SEU_PROJETO.supabase.co/functions/v1/mp-webhook` com o evento *Pagamentos*.
4. No painel da loja, em **Pagamento e entrega**, ative Pix e/ou cartão. O parcelamento exibido deve refletir o que a conta oferece.

Teste antes com as credenciais de teste do Mercado Pago.

### 4. Publicar

Qualquer hospedagem estática serve (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
Depois de publicar, troque `og:image` nos arquivos `.html` pelo endereço completo
(ex.: `https://seu-dominio.com.br/assets/img/og-image.jpg`) para as prévias no WhatsApp e redes sociais.

---

## O que depende da Mais Bella

Nada abaixo foi inventado. Enquanto não for preenchido, o site mostra textos neutros ou avisos.

- [ ] Número comercial do WhatsApp (formato `55DDDNÚMERO`) e link do Instagram
- [ ] Logotipo oficial (o site usa uma versão tipográfica até lá)
- [ ] Fotografias reais das peças e das campanhas
- [ ] Catálogo real: nomes, preços, estoque, medidas, peso, espessura do banho
- [ ] Formas de entrega, prazos e valores (ou token do Melhor Envio)
- [ ] Conta Mercado Pago para Pix e cartão
- [ ] Razão social, CNPJ e endereço (Decreto 7.962/2013)
- [ ] História verdadeira da marca, política de trocas para personalizados e condições de garantia (os trechos destacados em rosa nas páginas)

### Fotografia

Vertical 4:5, mínimo 1200 × 1500 px, fundo claro e consistente entre as peças,
luz suave. A segunda foto de cada peça aparece ao passar o mouse: um ângulo
diferente, um detalhe ou a peça em uso funcionam bem.

## Estrutura

```
maisbella/
├── *.html                    páginas
├── assets/
│   ├── css/maisbella.css     identidade visual e componentes (mobile first)
│   ├── css/admin.css         painel
│   ├── js/config.js          chaves do Supabase
│   ├── js/data.js            textos padrão e catálogo de demonstração
│   ├── js/store.js           dados: catálogo, sacola, pedidos, login, painel
│   ├── js/ui.js              cabeçalho, menu, busca, sacola, rodapé, WhatsApp
│   ├── js/home.js · colecao.js · produto.js · checkout.js · pedido.js · conta.js · pagina.js · admin.js
│   ├── vendor/supabase.js    cliente oficial do Supabase (carregado só com a loja ativa)
│   ├── fonts/                Italiana, Great Vibes, Cormorant Garamond e Jost (SIL Open Font License)
│   └── img/                  ícones, renderizações de demonstração
└── supabase/
    ├── schema.sql            tabelas, regras de acesso (RLS), estoque, cupons
    ├── config.toml
    └── functions/            checkout, mp-webhook, frete
```

## Acessibilidade e desempenho

Navegação por teclado, foco visível, textos alternativos, contraste AA nos
textos pequenos, `prefers-reduced-motion` respeitado. Imagens WebP em dois
tamanhos com `srcset`, fontes locais com pré-carregamento e nenhum framework.
