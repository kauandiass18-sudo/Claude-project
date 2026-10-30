# House Hamburgueria 66 · site de pedidos

Site de vendas com cardápio digital, sacola, finalização pelo WhatsApp e painel
do proprietário. HTML, CSS e JavaScript puro: não precisa de build.

```
house/
├── index.html            Site (início, piscinas, cardápio, promoções, sobre, contato)
├── admin.html            Painel do proprietário (login obrigatório)
├── assets/
│   ├── css/site.css      Visual do site
│   ├── css/admin.css     Visual do painel
│   ├── js/config.js      ← chaves do Supabase (único arquivo técnico a editar)
│   ├── js/dados.js       Dados iniciais (tirados do Instagram da loja)
│   ├── js/store.js       Banco de dados, sacola, pedidos e login
│   ├── js/site.js        Cardápio, produto, sacola e envio pelo WhatsApp
│   ├── js/admin.js       Painel
│   ├── vendor/supabase.js
│   └── img/              Fotos reais da House
└── supabase/schema.sql   Banco de dados completo (tabelas, regras e função de pedido)
```

## Como funciona o pedido

1. O cliente escolhe o produto, tamanho/adicionais, quantidade e observação.
2. Na sacola, ajusta quantidades e segue para os dados: nome, telefone,
   entrega ou retirada, endereço, bairro, referência, pagamento e observações.
3. O site gera o pedido numerado, salva no painel e mostra a mensagem pronta.
4. "Enviar pedido no WhatsApp" abre a conversa com a House já preenchida.

Com o Supabase ligado, o preço é recalculado no servidor (função
`criar_pedido`): ninguém consegue alterar valores pelo navegador.

## Modo demonstração x no ar

Com `config.js` vazio o site roda em **modo demonstração**: o painel usa a senha
`house66` e tudo (cardápio editado e pedidos) fica salvo **só no navegador em uso**.
Serve para apresentar e testar. Para a loja usar de verdade:

1. Crie um projeto em [supabase.com](https://supabase.com) (plano gratuito atende).
2. Em **SQL Editor**, cole e rode todo o `supabase/schema.sql`.
3. Em **Authentication → Users → Add user**, crie o e-mail e senha do proprietário.
   Depois, no SQL Editor:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'email-do-dono@exemplo.com';
   ```
4. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*
   para `assets/js/config.js`.
5. Publique a pasta `house/` (GitHub Pages, Netlify, Vercel ou hospedagem comum).

Fotos enviadas pelo painel vão para o bucket `cardapio` do Supabase, já reduzidas.

## O que ainda precisa ser confirmado com a loja

Nada abaixo foi inventado; está vazio ou marcado como "a confirmar" e muda pelo painel:

- **WhatsApp**: veio do link da bio e das postagens (`+55 41 99283-1441`). Confirmar
  que é o número que recebe pedidos (painel → Loja).
- **Cardápio**: só a Piscina de Cheddar (a partir de R$ 94,99) tem preço público no
  Instagram. Mini Burgers, Lanches, Porções, Promoções e Bebidas aparecem com
  "Perguntar no WhatsApp" até os itens serem cadastrados (painel → Cardápio).
- **Tamanhos e adicionais** da piscina: cadastrar em "Opções do produto".
- **Taxa de entrega**: hoje "a combinar". **Formas de pagamento**: ainda não perguntadas.
- **Fotos**: as do site foram extraídas do perfil. Fotos originais em boa resolução
  de cada produto deixam o cardápio muito mais forte.
- Página do Facebook "House Deliveri": falta o link.

## Prévia como Artifact

`python3 build-previa.py` gera `../house-previa.html` (o site sem o esqueleto
`<html>`), publicado junto com `admin.html` e `assets/`.
