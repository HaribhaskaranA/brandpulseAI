import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CreatorView from "./components/CreatorView";
import LeaderView from "./components/LeaderView";
import ManagerView from "./components/ManagerView";
import ApiKeyModal from "./components/ApiKeyModal";
import { 
  INITIAL_BRAND_KIT, 
  INITIAL_POSTS, 
  INITIAL_ANALYTICS 
} from "./data/initialData";
import { analyzeContentWithGemini } from "./services/geminiAudit";
import { 
  supabase,
  isSupabaseConfigured,
  fetchPostsFromSupabase,
  savePostToSupabase,
  deletePostFromSupabase,
  fetchRulesFromSupabase,
  saveRuleToSupabase,
  recordAuditTelemetry 
} from "./services/supabaseClient";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // Current active persona role: "creator" | "leader" | "manager"
  const [currentRole, setCurrentRole] = useState("creator");
  
  // Persisted brand kit state
  const [brandKit, setBrandKit] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_brandkit");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_BRAND_KIT;
  });

  // Central Posts state (synced with Supabase `posts` table)
  const [posts, setPosts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_posts");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_POSTS;
  });

  const [activeDraftId, setActiveDraftId] = useState(INITIAL_POSTS[0].id);
  const [activeLeaderDraftId, setActiveLeaderDraftId] = useState(
    INITIAL_POSTS.find(p => p.visibility === "leader_review")?.id || INITIAL_POSTS[0].id
  );

  const [analytics, setAnalytics] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_analytics");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_ANALYTICS;
  });

  const [isAuditing, setIsAuditing] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_brandkit", JSON.stringify(brandKit));
    }
  }, [brandKit]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_posts", JSON.stringify(posts));
    }
  }, [posts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_analytics", JSON.stringify(analytics));
    }
  }, [analytics]);

  // Load live data from Supabase on mount
  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Fetch live posts
      fetchPostsFromSupabase().then(dbPosts => {
        if (dbPosts && dbPosts.length > 0) {
          setPosts(dbPosts);
          if (!dbPosts.find(p => p.id === activeDraftId)) {
            setActiveDraftId(dbPosts[0].id);
          }
        }
      });

      // 2. Fetch live brand rules
      fetchRulesFromSupabase().then(dbRules => {
        if (dbRules && dbRules.length > 0) {
          setBrandKit(prev => ({
            ...prev,
            rules: dbRules
          }));
        }
      });

      // 3. Realtime subscription to Supabase posts table
      if (supabase) {
        const channel = supabase
          .channel("realtime:posts")
          .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, (payload) => {
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              const updatedRow = payload.new;
              const formatted = {
                id: updatedRow.id,
                title: updatedRow.title,
                channel: updatedRow.channel,
                author: updatedRow.author,
                content: updatedRow.content,
                bannerUrl: updatedRow.banner_url,
                bannerName: updatedRow.banner_name,
                hasImage: updatedRow.has_image,
                hasImageContrastIssue: updatedRow.has_contrast_issue,
                status: updatedRow.status,
                visibility: updatedRow.visibility,
                lastAudit: updatedRow.last_audit,
                comments: updatedRow.comments || [],
                history: updatedRow.history || [],
                createdAt: updatedRow.created_at,
                updatedAt: updatedRow.updated_at
              };
              setPosts(prev => {
                const idx = prev.findIndex(p => p.id === formatted.id);
                if (idx >= 0) {
                  const copy = [...prev];
                  copy[idx] = formatted;
                  return copy;
                }
                return [formatted, ...prev];
              });
            } else if (payload.eventType === "DELETE") {
              const deletedId = payload.old.id;
              setPosts(prev => prev.filter(p => p.id !== deletedId));
            }
          })
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      }
    }
  }, []);

  // Currently active draft for Creator Studio
  const activeDraft = posts.find(p => p.id === activeDraftId) || posts[0] || INITIAL_POSTS[0];

  // Leader Review Desk Queue: ONLY shows posts where visibility is leader_review
  // Private drafts created by creators are strictly excluded!
  const leaderReviews = posts.filter(p => 
    p.visibility === "leader_review" || 
    (p.visibility !== "private" && (p.status === "Needs Review" || p.status === "Approved" || p.status === "Revision Requested"))
  );

  // Run initial audit on load for active draft if missing
  useEffect(() => {
    if (activeDraft && !activeDraft.lastAudit) {
      analyzeContentWithGemini(activeDraft, brandKit).then(audit => {
        handleUpdateDraft({ ...activeDraft, lastAudit: audit }, false);
      });
    }
  }, [activeDraftId]);

  // --- Creator Actions ---

  const handleUpdateDraft = (updatedDraft, saveToDb = false) => {
    setPosts(prev => prev.map(p => p.id === updatedDraft.id ? updatedDraft : p));
    if (saveToDb) {
      savePostToSupabase(updatedDraft);
    }
  };

  const handleCreateNewPost = async () => {
    const newPost = {
      id: `post-${Date.now()}`,
      title: "New Marketing Campaign",
      channel: "Social Post",
      author: "Content Creator",
      content: "Type your draft here...",
      bannerUrl: "",
      bannerName: "",
      hasImage: false,
      hasImageContrastIssue: false,
      status: "Private Draft",
      visibility: "private",
      lastAudit: null,
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "creation",
          author: "Content Creator",
          note: "Created new private draft"
        }
      ],
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    setActiveDraftId(newPost.id);
    await savePostToSupabase(newPost);
    showToast("New private draft created in Supabase table!");
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const auditResult = await analyzeContentWithGemini(activeDraft, brandKit);
      const updated = {
        ...activeDraft,
        lastAudit: auditResult,
        history: [
          ...(activeDraft.history || []),
          {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "audit",
            author: "Google Gemini AI",
            note: `Pre-flight audit generated (Score: ${auditResult.overallScore}/100)`
          }
        ]
      };

      handleUpdateDraft(updated, true);

      // Record anonymized telemetry
      recordAuditTelemetry({
        postId: activeDraft.id,
        overallScore: auditResult.overallScore,
        categoriesSummary: auditResult.categories,
        violationsCount: auditResult.negatives?.length || 0
      }).catch(() => {});

      showToast(`Gemini Pre-Flight Check Complete! Score: ${auditResult.overallScore}/100`);
    } catch (err) {
      console.error(err);
      showToast("Error running audit", "error");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyFix = async (neg) => {
    if (!neg.flaggedText || !neg.suggestedRewrite) return;
    
    const oldContent = activeDraft.content || "";
    const newContent = oldContent.replace(neg.flaggedText, neg.suggestedRewrite);
    const hadContrastIssue = neg.category === "Accessibility" && activeDraft.hasImageContrastIssue;

    const updated = {
      ...activeDraft,
      content: newContent,
      hasImageContrastIssue: hadContrastIssue ? false : activeDraft.hasImageContrastIssue,
      history: [
        ...(activeDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "fix_applied",
          author: "Content Creator",
          note: `Applied 1-click suggested fix for "${neg.flaggedText}" -> "${neg.suggestedRewrite}"`
        }
      ]
    };

    handleUpdateDraft(updated, true);

    const newAudit = await analyzeContentWithGemini(updated, brandKit);
    handleUpdateDraft({
      ...updated,
      lastAudit: newAudit
    }, true);

    showToast(`Applied fix: "${neg.suggestedRewrite}"`);
  };

  // 1. Save to Private Draft (Guarantees isolation in Supabase table)
  const handleSavePrivateDraft = async () => {
    const updated = {
      ...activeDraft,
      status: "Private Draft",
      visibility: "private",
      history: [
        ...(activeDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "saved_private",
          author: "Content Creator",
          note: "Saved to private workspace (Hidden from Leader/Manager)"
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast("Saved to Private Draft in Supabase table (Not visible to Leader or Manager)");
  };

  // 2. Send for Review (Explicit Creator Choice)
  const handleSendToReview = async (target = "leader") => {
    const isManagerTarget = target === "manager";
    const updated = {
      ...activeDraft,
      status: "Needs Review",
      visibility: isManagerTarget ? "manager_review" : "leader_review",
      history: [
        ...(activeDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "submission",
          author: "Content Creator",
          note: `Submitted post to ${isManagerTarget ? "Manager" : "Leader"} Review Desk`
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast(`Post submitted to ${isManagerTarget ? "Manager" : "Leader"} Review Desk!`);
  };

  // 3. Withdraw Draft from Review (Removes immediately from reviewer's desk)
  const handleWithdrawReview = async () => {
    const updated = {
      ...activeDraft,
      status: "Private Draft",
      visibility: "private",
      history: [
        ...(activeDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "withdrawn",
          author: "Content Creator",
          note: "Withdrawn from review desk back to private workspace"
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast("Post withdrawn from review. Now saved only in your private workspace.");
  };

  // 4. Delete Post Completely (Removes from Supabase table & all dashboards)
  const handleDeletePost = async (postId) => {
    const success = await deletePostFromSupabase(postId);
    if (success) {
      const remaining = posts.filter(p => p.id !== postId);
      setPosts(remaining);
      if (remaining.length > 0) {
        setActiveDraftId(remaining[0].id);
      } else {
        handleCreateNewPost();
      }
      showToast("Post deleted from Supabase table and removed from all dashboards.");
    } else {
      showToast("Failed to delete post", "error");
    }
  };

  // --- Leader Review Desk Actions ---
  const handleApproveDraft = async (draftId) => {
    const targetPost = posts.find(p => p.id === draftId);
    if (!targetPost) return;

    const updated = {
      ...targetPost,
      status: "Approved",
      history: [
        ...(targetPost.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "approval",
          author: "Editorial Leader",
          note: "Formally approved for publication. Digital compliance certificate locked in Supabase."
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast("Asset formally approved for publication in Supabase!");
  };

  const handleRequestRevisions = async (draftId) => {
    const targetPost = posts.find(p => p.id === draftId);
    if (!targetPost) return;

    const updated = {
      ...targetPost,
      status: "Revision Requested",
      history: [
        ...(targetPost.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "revision_request",
          author: "Editorial Leader",
          note: "Returned with comments requesting revisions."
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast("Revisions requested. Notification sent to author in Supabase.", "error");
  };

  const handleAddComment = async (draftId, commentObj) => {
    const targetPost = posts.find(p => p.id === draftId);
    if (!targetPost) return;

    const updated = {
      ...targetPost,
      comments: [
        ...(targetPost.comments || []),
        {
          id: `comm-${Date.now()}`,
          timestamp: new Date().toISOString(),
          ...commentObj
        }
      ]
    };
    handleUpdateDraft(updated, true);
    showToast("Feedback comment posted and saved to Supabase!");
  };

  // --- Manager Brand Vault Actions ---
  const handleAddRule = async (ruleObj) => {
    setBrandKit(prev => ({
      ...prev,
      rules: [ruleObj, ...prev.rules]
    }));
    await saveRuleToSupabase(ruleObj);
    showToast(`New rule activated and saved to Supabase table: "${ruleObj.title}"`);
  };

  // --- Global Reset Demo Action ---
  const handleResetDemo = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandpulse_brandkit");
      localStorage.removeItem("brandpulse_posts");
      localStorage.removeItem("brandpulse_analytics");
    }
    const freshPosts = JSON.parse(JSON.stringify(INITIAL_POSTS));
    const freshBrandKit = JSON.parse(JSON.stringify(INITIAL_BRAND_KIT));
    
    const audit1 = await analyzeContentWithGemini(freshPosts[0], freshBrandKit);
    freshPosts[0].lastAudit = audit1;

    setBrandKit(freshBrandKit);
    setPosts(freshPosts);
    setAnalytics(INITIAL_ANALYTICS);
    setActiveDraftId(freshPosts[0].id);

    // Seed back to Supabase
    for (const p of freshPosts) {
      savePostToSupabase(p);
    }

    showToast("Demo data reset to initial Acme Cloud Brand Book state!");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header Bar (Persistent) */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onResetDemo={handleResetDemo}
        onOpenApiModal={() => setApiModalOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-20 right-6 z-50 animate-bounce">
            <div className={`px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 ${
              toast.type === "error" 
                ? "bg-red-50 text-red-900 border-red-200" 
                : "bg-emerald-50 text-emerald-950 border-emerald-300"
            }`}>
              {toast.type === "error" ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </div>
        )}

        {/* View A: Content Creator Studio */}
        {currentRole === "creator" && (
          <CreatorView
            draft={activeDraft}
            allPosts={posts}
            onSelectPost={setActiveDraftId}
            onCreateNewPost={handleCreateNewPost}
            onUpdateDraft={(updated) => handleUpdateDraft(updated, false)}
            onRunAudit={handleRunAudit}
            onSavePrivateDraft={handleSavePrivateDraft}
            onSendToReview={handleSendToReview}
            onWithdrawReview={handleWithdrawReview}
            onDeletePost={handleDeletePost}
            isAuditing={isAuditing}
            onApplyFix={handleApplyFix}
          />
        )}

        {/* View B: Leader Review Desk (Departmental & Submitted Reviews Only) */}
        {currentRole === "leader" && (
          <LeaderView
            drafts={leaderReviews}
            selectedDraftId={activeLeaderDraftId}
            onSelectDraft={setActiveLeaderDraftId}
            onApproveDraft={handleApproveDraft}
            onRequestRevisions={handleRequestRevisions}
            onAddComment={handleAddComment}
          />
        )}

        {/* View C: Manager Governance & Brand Vault */}
        {currentRole === "manager" && (
          <ManagerView
            brandKit={brandKit}
            onAddRule={handleAddRule}
            analytics={analytics}
          />
        )}

      </main>

      {/* Persistent Minimalist Footer */}
      <footer className="border-t border-slate-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            <strong>BrandPulse AI</strong> • Powered by Google Gemini Multimodal Engine • Grounded in Acme Cloud Brand Book v2.1
          </div>
          <div className="font-mono text-slate-400">
            Enterprise Brand Governance Platform (Supabase Table Synced)
          </div>
        </div>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
      />

    </div>
  );
}
