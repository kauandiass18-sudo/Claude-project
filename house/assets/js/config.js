/* =========================================================================
   House Hamburgueria 66 · conexão com o banco de dados

   Cardápio, preços, fotos, promoções e dados da loja são editados no painel
   (admin.html). Aqui ficam só as chaves do Supabase.

   Enquanto supabaseUrl estiver vazio, o site roda em MODO DEMONSTRAÇÃO:
   tudo (cardápio editado no painel e pedidos) fica salvo apenas no
   navegador em uso. Para colocar no ar de verdade, siga o README.
   ========================================================================= */
window.HOUSE_CONFIG = {
  // Supabase → Project Settings → API. A chave "anon" é pública por natureza;
  // quem protege os dados são as regras (RLS) de supabase/schema.sql.
  supabaseUrl: "",
  supabaseAnonKey: ""
};
