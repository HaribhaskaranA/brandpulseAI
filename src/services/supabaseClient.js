import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Check active connection to Supabase
 */
export async function testSupabaseConnection() {
  if (!supabase) return { connected: false, error: "Supabase credentials not configured in environment" };
  try {
    const { error } = await supabase.auth.getSession();
    return { connected: !error, error: error ? error.message : null };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

/**
 * Record anonymized audit telemetry to Supabase (Zero-Knowledge, no draft copy)
 */
export async function recordAuditTelemetry(telemetry) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("compliance_audits")
      .insert([
        {
          overall_score: telemetry.overallScore,
          categories_summary: telemetry.categoriesSummary,
          violations_count: telemetry.violationsCount,
          created_at: new Date().toISOString()
        }
      ]);
    if (error) {
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}
