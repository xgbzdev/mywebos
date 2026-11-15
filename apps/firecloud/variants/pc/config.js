/* FireCloud configuration (pc version).
 * Pre-configured for the B2L FireCloud server. The publishable key is meant
 * to be public: what each account can do is enforced by the server's rules. */
var FC_CONFIG = {
  variant: "pc",
  supabaseUrl: "https://wksjtjligjvclvmyjgcd.supabase.co",
  supabaseKey: "sb_publishable_6IVna--g-1c-3dA3ebDrcQ_AjGl8lVZ",
  helper: "http://127.0.0.1:8099",
  bucket: "firecloud",
  quotaBytes: 100 * 1024 * 1024,
  maxFileBytes: 10 * 1024 * 1024
};
