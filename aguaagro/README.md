# Tratamento de água para o agronegócio · Página de vendas

Página de vendas de uma empresa de tratamento de água para propriedades rurais
e agroindústrias. O objetivo é gerar **solicitações de avaliação técnica**:
pelo formulário, que chega à empresa por integração real, ou pelo WhatsApp.
Feita em HTML, CSS e JavaScript puro: não tem build nem dependências. Basta
publicar a pasta.

Visual: branco predominante, verde institucional `#173F32` nos títulos, botões
e na seção de conversão. Manrope (600/700) nos títulos e Inter (400/500) nos
textos. Sem gradientes, sombras pesadas, carrosséis ou animações contínuas.

## Roteiro da página

| # | Seção | Âncora | Função |
| --- | --- | --- | --- |
| 1 | Abertura | `#inicio` | O que a empresa faz, para quem e o próximo passo |
| 2 | Necessidade | `#necessidade` | Por que a água precisa ser avaliada caso a caso |
| 3 | Soluções | `#solucoes` | Serviços, com "quando faz sentido" e link para avaliação |
| 4 | Aplicações | `#aplicacoes` | Segmentos atendidos |
| 5 | Diferenciais | `#abordagem` | Decisões técnicas antes da solução |
| 6 | Metodologia | `#metodo` | As 4 etapas do atendimento |
| 7 | Empresa | `#empresa` | Compromissos de transparência e evidências reais |
| 8 | Perguntas frequentes | `#duvidas` | Respostas às dúvidas antes do contato |
| 9 | Conversão e formulário | `#contato` | Fundo verde, formulário e canais diretos |

A chamada principal é sempre a mesma, **"Solicitar avaliação técnica"**, e
leva ao formulário. O link "Solicitar avaliação" de cada serviço já deixa a
necessidade correspondente selecionada no formulário. As perguntas frequentes
vêm antes da conversão para tirar as dúvidas antes do pedido.

## Onde editar

| Arquivo | O que contém |
| --- | --- |
| `assets/js/config.js` | Nome, logotipo, contatos, WhatsApp, endereço, CNPJ, regiões, integração do formulário, serviços e segmentos ativos, equipe, estudos de caso e depoimentos |
| `index.html` | Textos da página, SEO (título, descrição, canonical) |
| `privacidade.html` | Política de Privacidade (modelo, revisar com o jurídico) |
| `assets/css/style.css` | Cores (em `:root`), tipografia e layout |
| `assets/js/app.js` | Comportamento: menu, WhatsApp, formulário e medição |

Campos vazios em `config.js` não aparecem no site. **Nada foi inventado:**
nome, contatos, regiões, equipe, casos e depoimentos ficam em branco até a
empresa informar.

### Serviços e segmentos

Os serviços e segmentos da página são sugestões que precisam ser confirmadas.
Em `config.js → servicos` e `config.js → aplicacoes`, mude para `false` o que a
empresa não oferece: o item sai da página e das opções do formulário. Para
mudar um texto, edite o `index.html` (os blocos têm `data-servico` e
`data-aplicacao`).

### Evidências (seção Empresa)

Sem material comprovado, a seção mostra só a apresentação institucional e os
compromissos de trabalho. Com autorização do cliente, preencha em `config.js`:

- `empresa.regioes` e `equipe.responsavelTecnico` / `equipe.destaque`;
- `casos`: contexto → necessidade identificada → solução aplicada → resultado documentado;
- `depoimentos`: texto, nome e cargo, todos reais e autorizados.

Cada bloco só aparece quando tem conteúdo.

## Formulário

Campos: nome, empresa ou propriedade, cidade, estado, telefone, tipo de
operação, necessidade principal e um campo livre opcional. A validação mostra
erros ao lado de cada campo e um resumo no topo. Há um campo invisível contra
robôs.

- **Com integração** (`formulario.endpoint` preenchido): a página envia um POST
  em JSON para o endereço configurado e só mostra "Solicitação enviada" quando
  o servidor confirma (resposta 2xx). Em caso de erro, mostra a mensagem e
  oferece o WhatsApp. Serve o backend da empresa, o webhook do CRM ou serviços
  como Formspree (crie o formulário e cole a URL `https://formspree.io/f/...`).
- **Sem integração** (endpoint vazio): a página **não simula envio**. Depois de
  validar, mostra "Falta só um passo" e um botão que abre o WhatsApp com a
  solicitação pronta para a pessoa revisar e enviar.

Os dados nunca vão para a URL da página nem para os eventos de medição.

Campos enviados: `assunto`, `pagina`, `nome`, `empresa`, `cidade`, `uf`,
`telefone`, `operacao`, `necessidade`, `mensagem`.

## WhatsApp

Preencha `contato.whatsapp` (55 + DDD + número, só números). A mensagem inicial
fica em `mensagemWhatsApp`. O WhatsApp aparece na área de contato, no rodapé e
num botão discreto no canto da tela, que surge depois da abertura e se esconde
na área de contato. Sem número, os links abrem o WhatsApp para a pessoa
escolher o contato.

## Medição de conversões

A página envia eventos para o `dataLayer` (Google Tag Manager) e, se existir,
para o `gtag` (GA4). Nenhum script de terceiros vem instalado: adicione o GTM
ou o GA4 no `<head>` quando a empresa decidir, com o aviso de cookies que for
exigido, e atualize o item 8 da Política de Privacidade.

| Evento | Quando | Parâmetros |
| --- | --- | --- |
| `generate_lead` | Formulário confirmado pelo servidor, ou clique em "Enviar pelo WhatsApp" | `metodo`, `operacao`, `necessidade` |
| `contato_whatsapp` | Clique em qualquer link de WhatsApp | `local` |
| `clique_avaliacao` | Clique em "Solicitar avaliação técnica" | `local` |
| `formulario_invalido` | Tentativa de envio com campos pendentes | `campos` |
| `formulario_erro_envio` | Falha na integração | — |

## Imagens

Não havia fotos da empresa nem acesso a bancos de imagem. Por isso **a
abertura usa um esquema técnico** (captação, bombeamento, filtração, dosagem,
reservação e distribuição), marcado como ilustrativo na legenda. É leve, nítido
em qualquer tela e não finge ser uma instalação real.

Quando houver fotografias reais de instalações, siga o comentário no
`index.html` (bloco `abertura__figura`): exporte em AVIF e WebP, com 800 e
1400 px de largura, coloque em `assets/img/fotos/` e informe `width`, `height`
e um `alt` que descreva a instalação. Evite imagens de banco genéricas.

`assets/img/og-image.jpg` é a imagem de compartilhamento (1200×630). Depois de
publicar, troque `og:image` pelo endereço completo e descomente o `canonical`.

## Acessibilidade e desempenho

- HTML semântico, títulos em ordem, link "Pular para o conteúdo".
- Foco visível, menu do celular com `aria-expanded` e fechamento com Esc.
- Perguntas frequentes com `<details>`, que funciona sem JavaScript.
- Contraste AA: o cinza `#737B76` é usado só em números e elementos grandes;
  textos auxiliares pequenos usam `#5F6762`, do mesmo tom, que passa no AA.
- Movimento reduzido respeitado; nenhuma animação de entrada.
- Sem bibliotecas: só as duas fontes do Google Fonts, o CSS e um script de ~20 KB.

## Antes de publicar: confirmar com a empresa

- [ ] Nome e logotipo oficial (`empresa.nome`, `empresa.logo`)
- [ ] WhatsApp comercial, telefone, e-mail e horário
- [ ] Integração do formulário (`formulario.endpoint`) testada com um envio real
- [ ] Serviços oferecidos (`servicos`) e textos de cada um
- [ ] Segmentos atendidos (`aplicacoes`)
- [ ] Diferenciais (seção `#abordagem`): manter só os verdadeiros
- [ ] Metodologia: confirmar se as 4 etapas refletem o atendimento real
- [ ] Respostas das perguntas frequentes (custos de avaliação, instalação, manutenção)
- [ ] Regiões de atendimento, endereço, razão social e CNPJ (se autorizados)
- [ ] Evidências reais: responsável técnico, estudos de caso, depoimentos
- [ ] Fotografias reais das instalações
- [ ] Política de Privacidade revisada pelo jurídico
- [ ] Ferramenta de medição (GTM/GA4) e aviso de cookies, se aplicável
- [ ] Depois de tudo confirmado: `modoPrevia: false`

## Publicação

Funciona em qualquer hospedagem estática (GitHub Pages, Netlify, Vercel) com
HTTPS.
