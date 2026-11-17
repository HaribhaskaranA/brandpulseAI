import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CreatorView from "./components/CreatorView";
import LeaderView from "./components/LeaderView";
import ManagerView from "./components/ManagerView";
import ApiKeyModal from "./components/ApiKeyModal";
import { 
  INITIAL_BRAND_KIT, 
  INITIAL_CREATOR_DRAFT, 
  INITIAL_LEADER_REVIEWS, 
  INITIAL_ANALYTICS 
} from "./data/initialData";
import { analyzeContentWithGemini } from "./services/geminiAudit";
import { recordAuditTelemetry } from "./services/supabaseClient";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  // Current active persona role: "creator" | "leader" | "manager"
  const [currentRole, setCurrentRole] = useState("creator");
  
  // Persisted state
  const [brandKit, setBrandKit] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_brandkit");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_BRAND_KIT;
  });

  // Isolated Creator Draft State (strictly private to Creator)
  const [creatorDraft, setCreatorDraft] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_creator_draft");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_CREATOR_DRAFT;
  });

  // Organizational Leader Review Queue (peer publications only)
  const [leaderReviews, setLeaderReviews] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_leader_reviews");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_LEADER_REVIEWS;
  });

  const [analytics, setAnalytics] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_analytics");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_ANALYTICS;
  });

  const [activeLeaderDraftId, setActiveLeaderDraftId] = useState(INITIAL_LEADER_REVIEWS[0].id);
  const [isAuditing, setIsAuditing] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_brandkit", JSON.stringify(brandKit));
    }
  }, [brandKit]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_creator_draft", JSON.stringify(creatorDraft));
    }
  }, [creatorDraft]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_leader_reviews", JSON.stringify(leaderReviews));
    }
  }, [leaderReviews]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_analytics", JSON.stringify(analytics));
    }
  }, [analytics]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Run initial audit on load for creator draft if it has none
  useEffect(() => {
    if (creatorDraft && !creatorDraft.lastAudit) {
      analyzeContentWithGemini(creatorDraft, brandKit).then(audit => {
        setCreatorDraft(prev => ({ ...prev, lastAudit: audit }));
      });
    }
  }, []);

  // --- Creator Actions (Strictly Isolated Workspace) ---
  const handleUpdateCreatorDraft = (updatedDraft) => {
    setCreatorDraft(updatedDraft);
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      const auditResult = await analyzeContentWithGemini(creatorDraft, brandKit);
      setCreatorDraft(prev => ({
        ...prev,
        lastAudit: auditResult,
        history: [
          ...(prev.history || []),
          {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            type: "audit",
            author: "Google Gemini AI",
            note: `Pre-flight audit generated (Score: ${auditResult.overallScore}/100)`
          }
        ]
      }));

      // Non-blocking telemetry sync to Supabase (Zero-Knowledge, no draft copy)
      recordAuditTelemetry({
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
    
    const oldContent = creatorDraft.content || "";
    const newContent = oldContent.replace(neg.flaggedText, neg.suggestedRewrite);
    const hadContrastIssue = neg.category === "Accessibility" && creatorDraft.hasImageContrastIssue;

    const updated = {
      ...creatorDraft,
      content: newContent,
      hasImageContrastIssue: hadContrastIssue ? false : creatorDraft.hasImageContrastIssue,
      history: [
        ...(creatorDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "fix_applied",
          author: "Content Creator",
          note: `Applied 1-click suggested fix for "${neg.flaggedText}" -> "${neg.suggestedRewrite}"`
        }
      ]
    };

    setCreatorDraft(updated);

    // Re-evaluate immediately
    const newAudit = await analyzeContentWithGemini(updated, brandKit);
    setCreatorDraft({
      ...updated,
      lastAudit: newAudit
    });

    showToast(`Applied fix: "${neg.suggestedRewrite}"`);
  };

  const handleSaveCreatorDraft = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_creator_draft", JSON.stringify(creatorDraft));
    }
    showToast("Draft saved privately to your local workspace.");
  };

  // --- Leader Review Desk Actions ---
  const handleApproveDraft = (draftId) => {
    setLeaderReviews(prev => prev.map(d => {
      if (d.id === draftId) {
        return {
          ...d,
          status: "Approved",
          history: [
            ...(d.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "approval",
              author: "Editorial Leader",
              note: "Formally approved for publication. Digital compliance certificate locked."
            }
          ]
        };
      }
      return d;
    }));
    showToast("Asset formally approved for publication!");
  };

  const handleRequestRevisions = (draftId) => {
    setLeaderReviews(prev => prev.map(d => {
      if (d.id === draftId) {
        return {
          ...d,
          status: "Revision Requested",
          history: [
            ...(d.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "revision_request",
              author: "Editorial Leader",
              note: "Returned with comments requesting revisions."
            }
          ]
        };
      }
      return d;
    }));
    showToast("Revisions requested. Notification sent to author team.", "error");
  };

  const handleAddComment = (draftId, commentObj) => {
    setLeaderReviews(prev => prev.map(d => {
      if (d.id === draftId) {
        return {
          ...d,
          comments: [
            ...(d.comments || []),
            {
              id: `comm-${Date.now()}`,
              timestamp: new Date().toISOString(),
              ...commentObj
            }
          ]
        };
      }
      return d;
    }));
    showToast("Feedback comment posted!");
  };

  // --- Manager Brand Vault Actions ---
  const handleAddRule = (ruleObj) => {
    setBrandKit(prev => ({
      ...prev,
      rules: [ruleObj, ...prev.rules]
    }));
    showToast(`New rule activated: "${ruleObj.title}"`);
  };

  // --- Global Reset Demo Action ---
  const handleResetDemo = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandpulse_brandkit");
      localStorage.removeItem("brandpulse_creator_draft");
      localStorage.removeItem("brandpulse_leader_reviews");
      localStorage.removeItem("brandpulse_analytics");
    }
    const freshCreatorDraft = JSON.parse(JSON.stringify(INITIAL_CREATOR_DRAFT));
    const freshBrandKit = JSON.parse(JSON.stringify(INITIAL_BRAND_KIT));
    const freshLeaderReviews = JSON.parse(JSON.stringify(INITIAL_LEADER_REVIEWS));
    
    const audit1 = await analyzeContentWithGemini(freshCreatorDraft, freshBrandKit);
    freshCreatorDraft.lastAudit = audit1;

    setBrandKit(freshBrandKit);
    setCreatorDraft(freshCreatorDraft);
    setLeaderReviews(freshLeaderReviews);
    setAnalytics(INITIAL_ANALYTICS);
    setActiveLeaderDraftId(freshLeaderReviews[0].id);
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

        {/* View A: Content Creator (Isolated Private Studio) */}
        {currentRole === "creator" && (
          <CreatorView
            draft={creatorDraft}
            onUpdateDraft={handleUpdateCreatorDraft}
            onRunAudit={handleRunAudit}
            onSaveDraft={handleSaveCreatorDraft}
            isAuditing={isAuditing}
            onApplyFix={handleApplyFix}
          />
        )}

        {/* View B: Leader Review Desk (Departmental Publications Only) */}
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

        {/* View C: Manager Governance & Brand Vault (Zero Access to Creator Drafts) */}
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
            Enterprise Brand Governance Platform
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