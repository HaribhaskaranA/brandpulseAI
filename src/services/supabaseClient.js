import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://vxruhsoxwfsbwtnxktvm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_EhjiFdoTOmtvvghGoGADPQ_-5XqL4sj";

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
  if (!supabase) return { connected: false, error: "Supabase client not initialized" };
  try {
    const { error } = await supabase.from("posts").select("id").limit(1);
    return { connected: !error, error: error ? error.message : null };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

// =========================================================================
// POSTS & DRAFTS TABLE OPERATIONS
// =========================================================================

/**
 * Fetch all posts/drafts from Supabase
 */
export async function fetchPostsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(p => ({
      id: p.id,
      title: p.title,
      channel: p.channel,
      author: p.author,
      content: p.content,
      bannerUrl: p.banner_url,
      bannerName: p.banner_name,
      hasImage: p.has_image,
      hasImageContrastIssue: p.has_contrast_issue,
      status: p.status,
      visibility: p.visibility,
      lastAudit: p.last_audit,
      comments: p.comments || [],
      history: p.history || [],
      createdAt: p.created_at,
      updatedAt: p.updated_at
    }));
  } catch (err) {
    console.warn("Could not fetch posts from Supabase, using local fallback:", err.message);
    return null;
  }
}

/**
 * Upsert a post to Supabase (Private draft or review)
 */
export async function savePostToSupabase(post) {
  if (!supabase) return post;
  try {
    const payload = {
      id: post.id,
      title: post.title,
      channel: post.channel,
      author: post.author || "Content Creator",
      content: post.content,
      banner_url: post.bannerUrl,
      banner_name: post.bannerName,
      has_image: Boolean(post.hasImage),
      has_contrast_issue: Boolean(post.hasImageContrastIssue),
      status: post.status,
      visibility: post.visibility || (post.status === "Private Draft" ? "private" : "leader_review"),
      last_audit: post.lastAudit,
      comments: post.comments || [],
      history: post.history || [],
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("posts")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Error saving post to Supabase:", err.message);
    return post;
  }
}

/**
 * Delete a post from Supabase (Removes draft completely from Leader/Manager view)
 */
export async function deletePostFromSupabase(postId) {
  if (!supabase) return true;
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("Error deleting post from Supabase:", err.message);
    return false;
  }
}

// =========================================================================
// BRAND RULES TABLE OPERATIONS
// =========================================================================

/**
 * Fetch brand rules from Supabase
 */
export async function fetchRulesFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("brand_rules")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(r => ({
      id: r.id,
      category: r.category,
      title: r.title,
      citation: r.citation,
      guidelineText: r.guideline_text,
      verifiedFact: r.verified_fact,
      bannedTerms: r.banned_terms || [],
      severity: r.severity,
      active: r.active
    }));
  } catch (err) {
    console.warn("Could not fetch brand rules from Supabase:", err.message);
    return null;
  }
}

/**
 * Save new rule to Supabase
 */
export async function saveRuleToSupabase(rule) {
  if (!supabase) return rule;
  try {
    const payload = {
      id: rule.id,
      category: rule.category,
      title: rule.title,
      citation: rule.citation,
      guideline_text: rule.guidelineText,
      verified_fact: rule.verifiedFact,
      banned_terms: rule.bannedTerms || [],
      severity: rule.severity,
      active: rule.active
    };
    const { data, error } = await supabase
      .from("brand_rules")
      .upsert(payload, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Error saving rule to Supabase:", err.message);
    return rule;
  }
}

// =========================================================================
// AUDIT TELEMETRY OPERATIONS
// =========================================================================

/**
 * Record anonymized audit telemetry to Supabase
 */
export async function recordAuditTelemetry(telemetry) {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("compliance_audits")
      .insert([
        {
          post_id: telemetry.postId || null,
          overall_score: telemetry.overallScore,
          categories_summary: telemetry.categoriesSummary,
          violations_count: telemetry.violationsCount,
          created_at: new Date().toISOString()
        }
      ]);
    if (error) return null;
    return data;
  } catch (err) {
    return null;
  }
}
