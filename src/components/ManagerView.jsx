import React, { useState } from "react";
import { 
  ShieldCheck, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Upload, 
  Check, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Layers,
  Palette,
  ExternalLink,
  Star,
  UserCheck,
  Clock,
  Eye,
  Award,
  Search,
  Filter,
  ArrowUpRight,
  MessageSquare,
  XCircle,
  Inbox
} from "lucide-react";
import ReportCard from "./ReportCard";

export default function ManagerView({ 
  brandKit, 
  onAddRule, 
  analytics,
  posts = [],
  onApproveDraft,
  onRequestRevisions,
  onAddComment
}) {
  const [activeTab, setActiveTab] = useState("rules_book"); // "rules_book" | "review_desk" | "insights"
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState("all");
  const [ruleSearchQuery, setRuleSearchQuery] = useState("");
  
  // Selected draft for Manager Review Desk
  const managerReviewQueue = posts.filter(p => 
    p.visibility === "manager_review" || 
    p.visibility === "both" || 
    p.status === "Approved"
  );
  const [selectedReviewId, setSelectedReviewId] = useState(
    managerReviewQueue.find(p => p.status === "Needs Review")?.id || managerReviewQueue[0]?.id || ""
  );
  
  // Rating & Approval modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedAssessment, setSelectedAssessment] = useState("Brand-Certified");
  const [approvalComment, setApprovalComment] = useState("");
  
  // Inspection modal for published draft from Rules Book
  const [inspectingPost, setInspectingPost] = useState(null);

  // New rule form state
  const [newCategory, setNewCategory] = useState("Tone & Voice");
  const [newTitle, setNewTitle] = useState("");
  const [newGuideline, setNewGuideline] = useState("");
  const [newCitation, setNewCitation] = useState("Brand Book v2.1 §6.1, Page 32");
  const [newBannedTerms, setNewBannedTerms] = useState("");
  const [newVerifiedFact, setNewVerifiedFact] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Active post in review desk
  const activeReviewPost = managerReviewQueue.find(p => p.id === selectedReviewId) || managerReviewQueue[0];

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newGuideline.trim()) return;

    const termsArray = newBannedTerms
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const ruleObj = {
      id: `rule-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      citation: newCitation.trim() || "Brand Book v2.1 §6.1",
      guidelineText: newGuideline.trim(),
      verifiedFact: newVerifiedFact.trim() || undefined,
      bannedTerms: termsArray,
      severity: newCategory === "Fact & Claim Verification" ? "error" : "warning",
      active: true,
      exampleCompliantPost: "Enterprise Whitepaper: Modern Cloud Architecture"
    };

    onAddRule(ruleObj);
    setIsAddingRule(false);
    setNewTitle("");
    setNewGuideline("");
    setNewBannedTerms("");
    setNewVerifiedFact("");
  };

  const handleSimulateUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1500);
  };

  const handleConfirmApproval = () => {
    if (!activeReviewPost) return;
    onApproveDraft && onApproveDraft(activeReviewPost.id, {
      rating: selectedRating,
      assessment: selectedAssessment,
      comment: approvalComment.trim() || "Certified by Brand Policy Authority. Adheres strictly to Acme Cloud Brand Book v2.1."
    }, "Manager");
    setShowApprovalModal(false);
  };

  // Filter rules by category and search
  const filteredRules = brandKit.rules.filter(rule => {
    const matchesCat = selectedRuleCategory === "all" || rule.category === selectedRuleCategory;
    const matchesSearch = !ruleSearchQuery.trim() || 
      rule.title.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
      rule.guidelineText.toLowerCase().includes(ruleSearchQuery.toLowerCase()) ||
      rule.citation.toLowerCase().includes(ruleSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Approved/published posts
  const publishedPosts = posts.filter(p => p.status === "Approved");

  // Helper to find compliant published post for a rule
  const getCompliantPostForRule = (rule) => {
    // Check if any published post matches rule example or matches category
    if (rule.exampleCompliantPost) {
      const match = publishedPosts.find(p => p.title.toLowerCase().includes(rule.exampleCompliantPost.toLowerCase()));
      if (match) return match;
    }
    return publishedPosts[0] || null;
  };

  const pendingManagerCount = managerReviewQueue.filter(p => p.status === "Needs Review").length;

  return (
    <div className="space-y-6">
      
      {/* View Header & Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
              Brand Governance & Compliance Deck
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Manager Brand Deck & Governance Vault
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Source of Truth: <strong>{brandKit.name}</strong> • Synchronized across Creator Pre-Flight & Review Desks
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs flex-wrap gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("rules_book")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "rules_book"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rules Book & Published Drafts ({brandKit.rules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("review_desk")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "review_desk"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Manager Reviews & Ratings</span>
            {pendingManagerCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingManagerCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "insights"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Infographics & Insights</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BRAND GUIDELINES RULES BOOK WITH PUBLISHED DRAFTS
         ========================================================================= */}
      {activeTab === "rules_book" && (
        <div className="space-y-6">
          
          {/* Top Controls: Upload Brand Book, Add Rule, and Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              {/* Search & Category Filter */}
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={ruleSearchQuery}
                    onChange={(e) => setRuleSearchQuery(e.target.value)}
                    placeholder="Search rules, keywords, citations..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <select
                  value={selectedRuleCategory}
                  onChange={(e) => setSelectedRuleCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Categories ({brandKit.rules.length})</option>
                  <option value="Tone & Voice">Tone & Voice</option>
                  <option value="Fact & Claim Verification">Fact & Claim</option>
                  <option value="Terminology">Terminology</option>
                  <option value="Visual Consistency">Visual Consistency</option>
                  <option value="Accessibility">Accessibility</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload PDF / docx</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingRule(!isAddingRule)}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingRule ? "Cancel" : "Add Brand Rule"}</span>
                </button>
              </div>

            </div>

            {/* Sub-note on Rule Adherence */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing <strong>{filteredRules.length}</strong> active brand book rules mapped to published creator drafts</span>
              <span className="font-mono text-emerald-700 font-semibold">Strict RAG Grounding Active</span>
            </div>
          </div>

          {/* Add Rule Form Panel */}
          {isAddingRule && (
            <form onSubmit={handleCreateRule} className="p-5 bg-white rounded-xl border border-emerald-300 shadow-sm space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Define & Approve New Organizational Brand Rule</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-700">Immediate RAG Grounding</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Tone & Voice">Tone & Voice</option>
                    <option value="Fact & Claim Verification">Fact & Claim Verification</option>
                    <option value="Terminology">Terminology</option>
                    <option value="Visual Consistency">Visual Consistency</option>
                    <option value="Accessibility">Accessibility</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rule Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Disallow Unaudited Multi-Cloud Superlatives"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Guideline Description (Injected into Gemini RAG prompt)</label>
                <textarea
                  rows={2}
                  value={newGuideline}
                  onChange={(e) => setNewGuideline(e.target.value)}
                  placeholder="Explain exactly what is permitted or forbidden and why..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Banned Terms (comma-separated)</label>
                  <input
                    type="text"
                    value={newBannedTerms}
                    onChange={(e) => setNewBannedTerms(e.target.value)}
                    placeholder="e.g. unbeatable, 100% bug-free"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Verified Fact (Ground Truth)</label>
                  <input
                    type="text"
                    value={newVerifiedFact}
                    onChange={(e) => setNewVerifiedFact(e.target.value)}
                    placeholder="e.g. Audited 99.95% uptime across 42 regions"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Guideline Citation</label>
                  <input
                    type="text"
                    value={newCitation}
                    onChange={(e) => setNewCitation(e.target.value)}
                    placeholder="e.g. Brand Book v2.1 §6.1, Page 32"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Activate Rule in Supabase</span>
                </button>
              </div>
            </form>
          )}

          {/* Approved Brand Hex Palette Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Approved Brand Color Palette (Acme Cloud v2.1)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Enforced via Gemini Multimodal Vision</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {brandKit.approvedColors.map((col, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: col.hex }}
                  ></div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-slate-900 truncate">{col.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{col.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Rules Book: Each Rule Mapped to Published Creator Drafts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span className="font-bold text-slate-800">
                Company Brand Rules Book ({filteredRules.length} Guidelines Active)
              </span>
              <span>Showing live published drafts verified against each rule</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredRules.map((rule) => {
                const compliantPost = getCompliantPostForRule(rule);
                return (
                  <div 
                    key={rule.id} 
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
                  >
                    {/* Top Row: Category & Badges */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          {rule.category}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Active in Gemini RAG</span>
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                          {rule.citation}
                        </span>
                      </div>
                    </div>

                    {/* Rule Title & Guideline Text */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-7 space-y-2">
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{rule.title}</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rule.guidelineText}
                        </p>

                        {/* Verified Ground Truth Fact */}
                        {rule.verifiedFact && (
                          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-emerald-900">Verified Corporate Fact: </strong>
                              <span>{rule.verifiedFact}</span>
                            </div>
                          </div>
                        )}

                        {/* Banned Terms List */}
                        {rule.bannedTerms && rule.bannedTerms.length > 0 && (
                          <div className="text-xs text-slate-500 pt-1">
                            <span className="font-semibold text-slate-700">Strictly Prohibited Phrases: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.bannedTerms.map((t, idx) => (
                                <span key={idx} className="bg-red-50 text-red-700 font-mono text-[10px] px-1.5 py-0.5 rounded border border-red-200 font-medium">
                                  "{t}"
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column: Published Creator Draft adhering to this rule */}
                      <div className="lg:col-span-5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                            <span className="text-[11px] font-mono font-bold text-slate-700 uppercase flex items-center gap-1">
                              <FileText className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Live Published Draft</span>
                            </span>
                            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                              100% Rule Adherent
                            </span>
                          </div>

                          {compliantPost ? (
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center justify-between">
                                <h5 className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                                  {compliantPost.title}
                                </h5>
                                <span className="text-[10px] font-mono text-slate-500">
                                  {compliantPost.channel}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-600 line-clamp-2 italic bg-white p-2 rounded border border-slate-200">
                                "{compliantPost.content}"
                              </p>

                              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span className="font-bold text-slate-800">
                                    {compliantPost.reviewRating || 5.0} / 5.0
                                  </span>
                                  <span className="text-slate-400">({compliantPost.reviewAssessment || "Brand-Certified"})</span>
                                </div>
                                <span className="text-emerald-700 font-semibold font-mono">
                                  Score: {compliantPost.lastAudit?.overallScore || 94}/100
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="py-4 text-center text-xs text-slate-400">
                              No published draft linked yet.
                            </div>
                          )}
                        </div>

                        {compliantPost && (
                          <button
                            type="button"
                            onClick={() => setInspectingPost(compliantPost)}
                            className="w-full py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Approved Asset & Audit</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: MANAGER REVIEW DESK & CREATOR RATING
         ========================================================================= */}
      {activeTab === "review_desk" && (
        <div className="space-y-6">
          
          {/* Desk Header Info */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Manager Review Desk: Direct & Dual Sign-Off Queue</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect content submitted specifically to the Manager or fast-tracked to Both. Rate creators on quality to build institutional memory.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {pendingManagerCount} Pending Approval
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                {publishedPosts.length} Certified
              </span>
            </div>
          </div>

          {managerReviewQueue.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">No Manager Reviews Pending</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Creator drafts remain private until creators choose <strong>"Manager Only"</strong> or <strong>"Both at Once"</strong> in the Send for Review modal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Review Queue List (4 cols) */}
              <div className="lg:col-span-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 px-1 font-mono">
                  Submitted for Manager Review ({managerReviewQueue.length}):
                </div>

                <div className="space-y-2">
                  {managerReviewQueue.map((item) => {
                    const isSelected = item.id === (activeReviewPost?.id || "");
                    const isNeedsReview = item.status === "Needs Review";
                    const isApproved = item.status === "Approved";
                    const isBoth = item.visibility === "both";

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedReviewId(item.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                            : "bg-white text-slate-900 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                            isSelected ? "bg-slate-800 text-emerald-400" : "bg-slate-100 text-slate-700"
                          }`}>
                            {item.channel}
                          </span>

                          <div className="flex items-center gap-1">
                            {isBoth && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isSelected ? "bg-emerald-500 text-slate-900" : "bg-emerald-100 text-emerald-800"
                              }`}>
                                Both Desk
                              </span>
                            )}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : isNeedsReview
                                  ? "bg-amber-100 text-amber-900 animate-pulse"
                                  : "bg-slate-200 text-slate-700"
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>

                        <h4 className="text-xs font-bold truncate mt-1">
                          {item.title}
                        </h4>

                        <div className={`text-[11px] mt-1.5 line-clamp-2 ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                          "{item.content}"
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100/20 text-[10px]">
                          <span className={isSelected ? "text-slate-400" : "text-slate-400"}>
                            By {item.author || "Content Creator"}
                          </span>
                          <span className={isSelected ? "text-emerald-400 font-bold" : "text-emerald-700 font-bold"}>
                            Score: {item.lastAudit?.overallScore || 90}/100
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Draft Details & Manager Review Action (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {activeReviewPost ? (
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-5">
                    
                    {/* Header Strip with Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                            {activeReviewPost.channel}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-600">
                            Author: <strong>{activeReviewPost.author}</strong>
                          </span>
                        </div>
                        <h2 className="text-lg font-extrabold text-slate-900 mt-0.5">
                          {activeReviewPost.title}
                        </h2>
                      </div>

                      {/* Approval / Rejection Controls */}
                      <div className="flex items-center gap-2">
                        {activeReviewPost.status === "Approved" ? (
                          <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Formally Certified (Rating: {activeReviewPost.reviewRating || 5}★)</span>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => onRequestRevisions && onRequestRevisions(activeReviewPost.id)}
                              className="px-3.5 py-2 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all flex items-center gap-1.5"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Request Revisions</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setShowApprovalModal(true)}
                              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <Award className="w-4 h-4" />
                              <span>Rate & Certify Post</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content Box */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                        Submitted Copy:
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                        {activeReviewPost.content}
                      </p>
                    </div>

                    {/* Attached Banner Preview if available */}
                    {activeReviewPost.hasImage && activeReviewPost.bannerUrl && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono font-bold text-slate-500 uppercase">
                          Attached Visual Asset:
                        </div>
                        <div className="rounded-xl overflow-hidden border border-slate-200 max-h-56 relative bg-slate-900">
                          <img
                            src={activeReviewPost.bannerUrl}
                            alt="Campaign Banner"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Gemini Multimodal Compliance Audit Card */}
                    {activeReviewPost.lastAudit ? (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold font-mono text-slate-900 uppercase flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Shared Gemini Compliance Audit</span>
                          </h4>
                          <span className="text-xs font-extrabold text-emerald-700 font-mono">
                            Readiness Score: {activeReviewPost.lastAudit.overallScore}/100
                          </span>
                        </div>

                        <ReportCard audit={activeReviewPost.lastAudit} />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                        Audit report is loading or pending check...
                      </div>
                    )}

                  </div>
                ) : null}
              </div>

            </div>
          )}

        </div>
      )}

      {/* =========================================================================
          TAB 3: GOVERNANCE INSIGHTS & INFOGRAPHICS
         ========================================================================= */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          
          {/* Top Analytics 4-Card Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Total Audits</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.stats.totalAuditsCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across {analytics.stats.activeTeamCreators} creators</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Turnaround Time</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.stats.averageTurnaroundHours}h</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">↓ {analytics.stats.turnaroundReductionPercent}% vs manual review</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Leaks Prevented</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.stats.offBrandLeaksPrevented}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Prevented pre-publication</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Brand Health Index</div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">{analytics.stats.companyBrandHealthScore}/100</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">↑ +13 pts over 30 days</div>
            </div>
          </div>

          {/* INFOGRAPHIC 1: 30-Day Brand Compliance Score Progression (Interactive SVG Area Chart) */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Brand Compliance Score Progression (SVG Infographic)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracking organizational alignment as creators adopt real-time Gemini pre-flight checks.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Compliance Score (%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                  <span>Baseline (78%)</span>
                </span>
              </div>
            </div>

            {/* Responsive SVG Area Chart */}
            <div className="w-full pt-2">
              <svg viewBox="0 0 700 200" className="w-full h-48 overflow-visible">
                <defs>
                  <linearGradient id="brandHealthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1="40" y1="20" x2="680" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="60" x2="680" y2="60" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="100" x2="680" y2="100" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="40" y1="140" x2="680" y2="140" stroke="#F1F5F9" strokeWidth="1" />

                {/* Y-Axis Labels */}
                <text x="32" y="24" fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">100%</text>
                <text x="32" y="64" fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">90%</text>
                <text x="32" y="104" fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">80%</text>
                <text x="32" y="144" fill="#94A3B8" fontSize="10" textAnchor="end" fontFamily="monospace">70%</text>

                {/* Area Fill */}
                {/* Points corresponding to 81, 84, 87, 89, 92, 93, 96 */}
                {/* X coordinates: 70, 170, 270, 370, 470, 570, 670 */}
                {/* Y coordinates: 20 + (100 - score)*4: 81->96, 84->84, 87->72, 89->64, 92->52, 93->48, 96->36 */}
                <polygon
                  fill="url(#brandHealthGradient)"
                  points="70,160 70,96 170,84 270,72 370,64 470,52 570,48 670,36 670,160"
                />

                {/* Main Trend Line */}
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="70,96 170,84 270,72 370,64 470,52 570,48 670,36"
                />

                {/* Data Points & Value Callouts */}
                {[
                  { x: 70, y: 96, label: "Day 1", val: "81%" },
                  { x: 170, y: 84, label: "Day 5", val: "84%" },
                  { x: 270, y: 72, label: "Day 10", val: "87%" },
                  { x: 370, y: 64, label: "Day 15", val: "89%" },
                  { x: 470, y: 52, label: "Day 20", val: "92%" },
                  { x: 570, y: 48, label: "Day 25", val: "93%" },
                  { x: 670, y: 36, label: "Day 30", val: "96%" }
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.y} r="4.5" fill="#FFFFFF" stroke="#059669" strokeWidth="2.5" />
                    <text x={pt.x} y={pt.y - 9} fill="#0F172A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                      {pt.val}
                    </text>
                    <text x={pt.x} y="175" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <span><strong>Key Governance Insight:</strong> Real-time Gemini RAG feedback reduced unverified superlatives by 88% within 3 weeks of rollout.</span>
              <span className="font-mono text-emerald-700 font-bold text-[11px] shrink-0 pl-2">Trend: +15% Growth</span>
            </div>
          </div>

          {/* INFOGRAPHIC 2: Category Adherence Bars & Recurring Violations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Category Adherence Breakdown */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>Category Adherence Performance</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Past 30 Days</span>
              </div>

              <div className="space-y-3.5">
                {[
                  { name: "Tone & Voice", score: 96, status: "Excellent" },
                  { name: "Approved Terminology", score: 94, status: "Strong" },
                  { name: "Fact & Claim Verification", score: 92, status: "Good" },
                  { name: "Visual Consistency", score: 95, status: "Excellent" },
                  { name: "Accessibility (WCAG Contrast)", score: 89, status: "Moderate" }
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{cat.name}</span>
                      <span className="font-mono text-slate-600 font-bold">{cat.score}% ({cat.status})</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          cat.score >= 94 ? "bg-emerald-500" : cat.score >= 90 ? "bg-blue-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${cat.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recurring Violations Heatmap / Breakdown */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Top Flagged Brand Ambiguities</span>
                </h3>
                <span className="text-[11px] font-mono text-slate-400">Action Triggers</span>
              </div>

              <div className="space-y-3">
                {analytics.recurringViolations.map((violation, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[220px]">{violation.rule}</span>
                      <span className="font-mono text-slate-600 font-bold">{violation.percentage}% ({violation.count} flags)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${violation.severity === "error" ? "bg-red-500" : "bg-amber-500"}`}
                        style={{ width: `${violation.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950">
                <strong>Manager Recommendation:</strong> Distribute updated 1-page Fact Sheet to eliminate recurring 42% superlative flags.
              </div>
            </div>

          </div>

          {/* INFOGRAPHIC 3: Creator Team Performance & Quality Rating Leaderboard */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Creator Team Performance & Reviewer Rating Leaderboard</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluating individual and departmental adherence to brand guidelines based on Leader & Manager ratings.
                </p>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                Q4 Assessment
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2 font-semibold">Creator / Team</th>
                    <th className="pb-2 font-semibold">Specialization</th>
                    <th className="pb-2 font-semibold">Brand Alignment</th>
                    <th className="pb-2 font-semibold">Certified Assets</th>
                    <th className="pb-2 font-semibold">Reviewer Rating</th>
                    <th className="pb-2 font-semibold">Status Tier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.creatorLeaderboard.map((creator, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          idx === 0 ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{creator.name}</span>
                      </td>
                      <td className="py-3 text-slate-600">{creator.role}</td>
                      <td className="py-3 font-mono font-bold text-emerald-700">{creator.score}%</td>
                      <td className="py-3 font-mono text-slate-700">{creator.published} published</td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-mono font-bold text-slate-900">{creator.rating}</span>
                          <span className="text-[10px] text-slate-400">/ 5.0</span>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          creator.status === "Top Performer" 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : creator.status === "Certified"
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-slate-100 text-slate-700"
                        }`}>
                          {creator.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          MODAL 1: RATE & CERTIFY POST (MANAGER)
         ========================================================================= */}
      {showApprovalModal && activeReviewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Manager Quality Rating & Certification</h3>
                  <p className="text-[11px] text-slate-500">Certify adherence to Acme Cloud Brand Book v2.1</p>
                </div>
              </div>
              <button 
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Draft Title: </span>
              <strong className="text-slate-900">{activeReviewPost.title}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                "{activeReviewPost.content}"
              </div>
            </div>

            {/* 1 to 5 Star Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Award Creator Quality Rating (Feeds Creator Profile & Leaderboard):
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-all"
                  >
                    <Star 
                      className={`w-6 h-6 transition-all ${
                        star <= selectedRating 
                          ? "fill-amber-400 text-amber-400 scale-110" 
                          : "text-slate-300"
                      }`} 
                    />
                  </button>
                ))}
                <span className="text-xs font-extrabold text-slate-900 font-mono pl-2">
                  {selectedRating}.0 / 5.0
                </span>
              </div>
            </div>

            {/* Assessment Tag */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Compliance Assessment Tag:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  "Brand-Certified", 
                  "Exceeds Standard", 
                  "Policy Compliant", 
                  "Standard Alignment"
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedAssessment(tag)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                      selectedAssessment === tag
                        ? "bg-emerald-600 text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback / Evaluation Comment */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">Manager Executive Feedback & Grounding Note:</label>
              <textarea
                rows={2}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="e.g. Excellent adherence to Section 3.2 uptime SLA specifications. Zero unverified superlatives."
                className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowApprovalModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Confirm & Lock Certification</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: INSPECT PUBLISHED DRAFT (FROM RULES BOOK)
         ========================================================================= */}
      {inspectingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Approved & Published Asset Details</h3>
                  <p className="text-[11px] text-slate-500">Live verified asset demonstrating brand rule adherence</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectingPost(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Post Metadata Card */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
                  {inspectingPost.channel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approved & Published</span>
                </span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900">{inspectingPost.title}</h2>
              <p className="text-xs text-slate-700 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200">
                "{inspectingPost.content}"
              </p>
            </div>

            {/* Reviewer Rating & Certification Note */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ★
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950">
                    Reviewer Assessment: {inspectingPost.reviewAssessment || "Brand-Certified"}
                  </span>
                  <span className="text-xs font-mono font-extrabold text-emerald-800">
                    ({inspectingPost.reviewRating || 5.0} / 5.0 Stars)
                  </span>
                </div>
                <p className="text-[11px] text-emerald-900 mt-0.5">
                  "{inspectingPost.reviewComment || "Exemplary brand book adherence. Official SLA data quoted flawlessly."}"
                </p>
              </div>
            </div>

            {/* Audit Details */}
            {inspectingPost.lastAudit && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Verified Compliance Scorecard:
                </h4>
                <ReportCard audit={inspectingPost.lastAudit} />
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingPost(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Brand Book PDF Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Upload & Vectorize Brand Guidelines</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Drop an updated company Brand Book (.pdf or .docx). The ingestion pipeline extracts section headers, terminology rules, and color palettes for Gemini RAG indexing.
            </p>

            <div 
              onClick={handleSimulateUpload}
              className="p-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-slate-500"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-800">
                {uploadSuccess ? "✓ Document Parsed & Vectorized into Supabase!" : "Click to select Acme_Brand_Book_v2.2.pdf"}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Simulates Supabase Storage & pgvector chunking</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
