/* =========================================================================
   Configuração técnica da loja.
   Textos, WhatsApp, Instagram, frete e pagamentos são editados no painel
   (admin.html). Aqui ficam apenas as chaves de conexão.

   Enquanto supabaseUrl estiver vazio, o site funciona em MODO DEMONSTRAÇÃO:
   catálogo ilustrativo, painel e pedidos salvos apenas neste navegador.
   ========================================================================= */
window.MB_CONFIG = {
  // Projeto Supabase (Settings → API). A chave "anon" é pública por design;
  // a segurança vem das políticas RLS de supabase/schema.sql.
  supabaseUrl: "",
  supabaseAnonKey: "",

  // Endereço público do site, sem barra no final. Usado em links de
  // compartilhamento e na mensagem do WhatsApp. Vazio = endereço atual.
  siteUrl: ""
};
