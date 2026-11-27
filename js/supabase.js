
/* =========================================
   GIDY CONNECT — SUPABASE CONFIGURATION
========================================= */

(() => {
  const SUPABASE_URL =
    "https://qkukdzvulqawtmhtntai.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_hBs99CBY55jYgrOOM6bY5Q_MUr4OOim";

  if (!window.supabase?.createClient) {
    console.error("Supabase library failed to load.");
    return;
  }

  window.gidySupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );

  console.log("Gidy Connect: Supabase initialized.");
})();
