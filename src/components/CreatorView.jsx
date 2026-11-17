import React, { useState } from "react";
import { 
  Sparkles, 
  Save, 
  Send,
  Trash2,
  Undo2,
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Info,
  Check,
  AlertCircle,
  ShieldCheck,
  Lock,
  Plus,
  Eye,
  FileText,
  User,
  BarChart2,
  PenTool
} from "lucide-react";
import ReportCard from "./ReportCard";
import CreatorProfileCard from "./CreatorProfileCard";

export default function CreatorView({ 
  draft, 
  allPosts = [],
  profile,
  onSelectPost,
  onCreateNewPost,
  onUpdateDraft, 
  onRunAudit, 
  onSavePrivateDraft, 
  onSendToReview,
  onWithdrawReview,
  onDeletePost,
  isAuditing, 
  onApplyFix 
}) {
  const [activeSubTab, setActiveSubTab] = useState("editor"); // "editor" | "profile"
  const [showSendModal, setShowSendModal] = useState(false);
  const [targetReviewer, setTargetReviewer] = useState("both"); // "leader" | "manager" | "both"

  const channels = ["Social Post", "Ad Copy", "Email Campaign", "Document Draft"];

  const handleTitleChange = (e) => {
    onUpdateDraft({ ...draft, title: e.target.value });
  };

  const handleChannelChange = (ch) => {
    onUpdateDraft({ ...draft, channel: ch });
  };

  const handleContentChange = (e) => {
    onUpdateDraft({ ...draft, content: e.target.value });
  };

  const toggleImageContrast = () => {
    onUpdateDraft({
      ...draft,
      hasImageContrastIssue: !draft.hasImageContrastIssue
    });
  };

  const toggleHasImage = () => {
    onUpdateDraft({
      ...draft,
      hasImage: !draft.hasImage
    });
  };

  const handleRemoveBanner = () => {
    onUpdateDraft({
      ...draft,
      hasImage: false,
      bannerUrl: "",
      bannerName: ""
    });
  };

  const wordCount = (draft.content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (draft.content || "").length;

  const isPrivate = !draft.visibility || draft.visibility === "private" || draft.status === "Private Draft";
  const isInReview = draft.status === "Needs Review" && (draft.visibility === "leader_review" || draft.visibility === "manager_review" || draft.visibility === "both");

  return (
    <div className="space-y-4">
      
      {/* Sub-Tabs: Creative Studio vs Profile & Performance */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab("editor")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "editor"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-600" />
            <span>Studio Workspace & Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "profile"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Profile & Performance</span>
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500">
            Current Status: <strong className="text-slate-900">{isPrivate ? "Private Workspace" : "Active in Review"}</strong>
          </span>
        </div>
      </div>

      {/* VIEW 1: CREATOR PROFILE & PERFORMANCE */}
      {activeSubTab === "profile" && (
        <CreatorProfileCard profile={profile} />
      )}

      {/* VIEW 2: WORKSPACE & DRAFT EDITOR */}
      {activeSubTab === "editor" && (
        <div className="space-y-4">
          
          {/* Draft Selector Strip */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-bold text-slate-700 shrink-0 font-mono">My Drafts ({allPosts.length}):</span>
              {allPosts.map((p) => {
                const isSelected = p.id === draft.id;
                const pPrivate = !p.visibility || p.visibility === "private" || p.status === "Private Draft";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPost && onSelectPost(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pPrivate ? <Lock className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3 text-amber-400" />}
                    <span className="max-w-[140px] truncate">{p.title || "Untitled Draft"}</span>
                    <span className="text-[10px] opacity-75">({pPrivate ? "Private" : "In Review"})</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onCreateNewPost}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Panel: Draft Editor & Multi-Format Input (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Header & Status Indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>Creative Web Studio</span>
                      <span className="text-[10px] font-mono text-slate-400 font-normal">Supabase Synced</span>
                    </h2>
                    <p className="text-xs text-slate-500">Draft copy, test creative banners, and run pre-flight Gemini audits.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-full border flex items-center gap-1.5 ${
                      isPrivate
                        ? "bg-slate-100 text-slate-800 border-slate-200"
                        : draft.status === "Approved"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                    }`}>
                      {isPrivate ? <Lock className="w-3 h-3 text-emerald-600" /> : <Eye className="w-3 h-3 text-amber-600" />}
                      <span>{draft.status}</span>
                    </span>
                  </div>
                </div>

                {/* Privacy & Review Status Banner */}
                {isPrivate ? (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <span className="font-bold">Private Draft (Strictly Isolated):</span> This draft is saved only in your private workspace and Supabase table. It is <strong>NOT visible to Leaders or Managers</strong> until you explicitly choose to send it for review.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start justify-between gap-2.5 text-xs text-amber-950">
                    <div className="flex items-start gap-2">
                      <Eye className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold">Submitted for Review:</span> Visible on the <strong>{
                          draft.visibility === "both" 
                            ? "Leader & Manager Desks (Simultaneous)" 
                            : draft.visibility === "manager_review" 
                              ? "Manager Review Desk" 
                              : "Leader Review Desk"
                        }</strong>. You can withdraw or delete it anytime below.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onWithdrawReview}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-900 border border-amber-300 rounded hover:bg-amber-100 shrink-0 flex items-center gap-1"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Withdraw Draft</span>
                    </button>
                  </div>
                )}

                {/* Draft Title Input */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Campaign Title</label>
                  <input
                    type="text"
                    value={draft.title || ""}
                    onChange={handleTitleChange}
                    placeholder="e.g. Q4 Enterprise Launch Social Campaign"
                    className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Channel Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Publishing Channel</label>
                  <div className="flex flex-wrap gap-2">
                    {channels.map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => handleChannelChange(ch)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          draft.channel === ch
                            ? "bg-slate-900 text-white font-semibold shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Copy Editor */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <label className="font-bold text-slate-700">Draft Content (Copy / Proposal)</label>
                    <span className="font-mono text-[11px]">{wordCount} words • {charCount} chars</span>
                  </div>
                  <textarea
                    rows={6}
                    value={draft.content || ""}
                    onChange={handleContentChange}
                    placeholder="Type or paste marketing copy, product descriptions, or document drafts here..."
                    className="w-full p-3 text-xs text-slate-900 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-y"
                  ></textarea>
                </div>

                {/* Image & Banner Uploader */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Creative Banner Asset (Multimodal Vision Audit)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {draft.hasImage && (
                        <button
                          type="button"
                          onClick={handleRemoveBanner}
                          className="text-[11px] font-mono text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete Banner</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={toggleHasImage}
                        className="text-[11px] font-mono text-emerald-700 hover:underline"
                      >
                        {draft.hasImage ? "Toggle Visibility" : "+ Attach Sample Banner"}
                      </button>
                    </div>
                  </div>

                  {draft.hasImage ? (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-800 font-semibold">{draft.bannerName || "banner.jpg"}</span>
                          {draft.hasImageContrastIssue ? (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded">
                              WCAG Contrast: 3.1:1 (Fails AA)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">
                              WCAG Contrast: 5.8:1 (Passes AA)
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={toggleImageContrast}
                          className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                        >
                          Toggle Contrast State
                        </button>
                      </div>

                      <div className="relative rounded-lg overflow-hidden border border-slate-300 max-h-48 group">
                        <img
                          src={draft.bannerUrl}
                          alt="Creative Preview"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                          <div className="text-white text-xs space-y-0.5">
                            <div className="font-bold">Next-Gen Enterprise Cloud Engine</div>
                            <div className={`text-[11px] ${draft.hasImageContrastIssue ? "text-slate-400 font-normal" : "text-white font-semibold"}`}>
                              {draft.hasImageContrastIssue ? "Sub-optimal subtitle contrast ratio" : "High contrast verified typography"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div 
                      onClick={toggleHasImage}
                      className="p-4 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-slate-400"
                    >
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-700">Click to attach sample marketing banner</span>
                      <span className="text-[10px] text-slate-400">Tests Gemini Vision logo placement & WCAG text contrast math</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={onRunAudit}
                      disabled={isAuditing}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                    >
                      {isAuditing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Auditing with Google Gemini...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Run Gemini Brand Check</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Save to Private Draft */}
                      <button
                        type="button"
                        onClick={onSavePrivateDraft}
                        disabled={isAuditing}
                        title="Save draft to your private workspace only (Never visible to Leader/Manager)"
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5 text-slate-500" />
                        <span>Save to Private Draft</span>
                      </button>

                      {/* Send for Review Button */}
                      {isPrivate ? (
                        <button
                          type="button"
                          onClick={() => setShowSendModal(true)}
                          disabled={isAuditing}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send for Review</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onWithdrawReview}
                          className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Withdraw from Review</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete Post Row */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span className="text-[11px] font-mono">
                      Post ID: <span className="text-slate-700 font-semibold">{draft.id}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeletePost && onDeletePost(draft.id)}
                      className="text-red-600 hover:text-red-800 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Post Completely</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Panel: Live Gemini Brand Evaluation Report (6 cols) */}
            <div className="lg:col-span-6">
              <ReportCard
                audit={draft.lastAudit}
                onApplyFix={onApplyFix}
                isApplying={isAuditing}
              />
            </div>

          </div>
        </div>
      )}

      {/* Send for Review Modal (Leader, Manager, or BOTH Simultaneously) */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Send Post for Editorial Review</span>
              </h3>
              <button 
                onClick={() => setShowSendModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Choose who should review and rate this publication. You can send to <strong>Leader</strong>, <strong>Manager</strong>, or <strong>Both simultaneously</strong>.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Select Review Destination:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetReviewer("leader")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "leader"
                      ? "border-emerald-500 bg-emerald-50/50 font-bold text-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-slate-900">Leader Only</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">Editorial desk review</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetReviewer("manager")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "manager"
                      ? "border-emerald-500 bg-emerald-50/50 font-bold text-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-slate-900">Manager Only</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">Brand Policy approval</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetReviewer("both")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "both"
                      ? "border-emerald-600 bg-emerald-100/60 font-bold text-emerald-950 ring-2 ring-emerald-600/30"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-emerald-950 flex items-center gap-1">
                    <span>Both at Once</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1 rounded">Fast-Track</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-normal mt-0.5">Simultaneous sign-off</div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Security Guarantee:</span> Once submitted, the draft becomes visible to the selected reviewers, who can approve and award quality star ratings. You can withdraw it back to private draft anytime.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSendToReview(targetReviewer);
                  setShowSendModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send to {
                  targetReviewer === "both" 
                    ? "Both Leader & Manager" 
                    : targetReviewer === "manager" 
                      ? "Manager" 
                      : "Leader"
                }</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
