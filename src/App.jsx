import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import CreatorView from "./components/CreatorView";
import LeaderView from "./components/LeaderView";
import ManagerView from "./components/ManagerView";
import ApiKeyModal from "./components/ApiKeyModal";
import { INITIAL_BRAND_KIT, INITIAL_DRAFTS, INITIAL_ANALYTICS } from "./data/initialData";
import { analyzeContentWithGemini } from "./services/geminiAudit";
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

  const [drafts, setDrafts] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandpulse_drafts");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_DRAFTS;
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

  const [activeDraftId, setActiveDraftId] = useState(INITIAL_DRAFTS[0].id);
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
      localStorage.setItem("brandpulse_drafts", JSON.stringify(drafts));
    }
  }, [drafts]);

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

  // Run initial audit on load for draft 1 if it has none
  useEffect(() => {
    const draft1 = drafts.find(d => d.id === INITIAL_DRAFTS[0].id);
    if (draft1 && !draft1.lastAudit) {
      analyzeContentWithGemini(draft1, brandKit).then(audit => {
        setDrafts(prev => prev.map(d => d.id === draft1.id ? { ...d, lastAudit: audit } : d));
      });
    }
  }, []);

  const activeDraft = drafts.find(d => d.id === activeDraftId) || drafts[0];

  // Actions
  const handleUpdateDraft = (updatedDraft) => {
    setDrafts(prev => prev.map(d => d.id === updatedDraft.id ? updatedDraft : d));
  };

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      // Simulate real-time async feeling
      await new Promise(r => setTimeout(r, 600));
      const auditResult = await analyzeContentWithGemini(activeDraft, brandKit);
      setDrafts(prev => prev.map(d => {
        if (d.id === activeDraft.id) {
          return {
            ...d,
            lastAudit: auditResult,
            history: [
              ...(d.history || []),
              {
                id: `hist-${Date.now()}`,
                timestamp: new Date().toISOString(),
                type: "audit",
                author: "Google Gemini AI",
                note: `Pre-flight audit generated (Score: ${auditResult.overallScore}/100)`
              }
            ]
          };
        }
        return d;
      }));
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
    
    // Replace the exact text in content
    const oldContent = activeDraft.content || "";
    const newContent = oldContent.replace(neg.flaggedText, neg.suggestedRewrite);

    // If it was an image contrast issue, toggle off the issue
    const hadContrastIssue = neg.category === "Accessibility" && activeDraft.hasImageContrastIssue;

    const updatedDraft = {
      ...activeDraft,
      content: newContent,
      hasImageContrastIssue: hadContrastIssue ? false : activeDraft.hasImageContrastIssue,
      history: [
        ...(activeDraft.history || []),
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: "fix_applied",
          author: "Alex Chen (Creator)",
          note: `Applied 1-click suggested fix for "${neg.flaggedText}" -> "${neg.suggestedRewrite}"`
        }
      ]
    };

    handleUpdateDraft(updatedDraft);

    // Re-evaluate immediately with updated content
    const newAudit = await analyzeContentWithGemini(updatedDraft, brandKit);
    handleUpdateDraft({
      ...updatedDraft,
      lastAudit: newAudit
    });

    showToast(`Applied fix: "${neg.suggestedRewrite}"`);
  };

  const handleSubmitToLeader = () => {
    setDrafts(prev => prev.map(d => {
      if (d.id === activeDraft.id) {
        return {
          ...d,
          status: "Needs Review",
          submittedAt: new Date().toISOString(),
          history: [
            ...(d.history || []),
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              type: "submission",
              author: "Alex Chen (Creator)",
              note: `Submitted to Leader Review Desk with Gemini Audit (Score: ${d.lastAudit?.overallScore || 0}/100)`
            }
          ]
        };
      }
      return d;
    }));
    showToast("Draft submitted to Leader queue for approval!");
  };

  const handleApproveDraft = (draftId) => {
    setDrafts(prev => prev.map(d => {
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
              author: currentRole === "manager" ? "Marcus Vance (Manager)" : "Sarah Jenkins (Leader)",
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
    setDrafts(prev => prev.map(d => {
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
              author: "Sarah Jenkins (Leader)",
              note: "Returned to creator with comments requesting revisions."
            }
          ]
        };
      }
      return d;
    }));
    showToast("Revisions requested. Returned to Creator studio.", "error");
  };

  const handleAddComment = (draftId, commentObj) => {
    setDrafts(prev => prev.map(d => {
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

  const handleAddRule = (ruleObj) => {
    setBrandKit(prev => ({
      ...prev,
      rules: [ruleObj, ...prev.rules]
    }));
    showToast(`New rule activated: "${ruleObj.title}"`);
  };

  const handleResetDemo = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandpulse_brandkit");
      localStorage.removeItem("brandpulse_drafts");
      localStorage.removeItem("brandpulse_analytics");
    }
    const freshDrafts = JSON.parse(JSON.stringify(INITIAL_DRAFTS));
    const freshBrandKit = JSON.parse(JSON.stringify(INITIAL_BRAND_KIT));
    
    // Auto-audit draft 1
    const audit1 = await analyzeContentWithGemini(freshDrafts[0], freshBrandKit);
    freshDrafts[0].lastAudit = audit1;

    setBrandKit(freshBrandKit);
    setDrafts(freshDrafts);
    setAnalytics(INITIAL_ANALYTICS);
    setActiveDraftId(freshDrafts[0].id);
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

        {/* View A: Content Creator */}
        {currentRole === "creator" && (
          <CreatorView
            draft={activeDraft}
            onUpdateDraft={handleUpdateDraft}
            onRunAudit={handleRunAudit}
            onSubmitToLeader={handleSubmitToLeader}
            isAuditing={isAuditing}
            onApplyFix={handleApplyFix}
          />
        )}

        {/* View B: Leader Review Desk */}
        {currentRole === "leader" && (
          <LeaderView
            drafts={drafts}
            selectedDraftId={activeDraftId}
            onSelectDraft={setActiveDraftId}
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
            drafts={drafts}
            onApproveDraft={handleApproveDraft}
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
            Team: Green Coders (Sri Krishna College of Engg & Tech)
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
