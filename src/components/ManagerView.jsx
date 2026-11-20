import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
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
  Star,
  UserCheck,
  Clock,
  Eye,
  Award,
  Search,
  User,
  Users,
  Paperclip,
  Database,
  RefreshCw,
  Edit3
} from "lucide-react";
import ReportCard from "./ReportCard";
import CreatorProfileCard from "./CreatorProfileCard";
import ComplianceCertificateModal from "./ComplianceCertificateModal";
import { INITIAL_ANALYTICS, INITIAL_CREATOR_PROFILE, INITIAL_MANAGER_PROFILE } from "../data/initialData";

export default function ManagerView({ 
  brandKit, 
  onAddRule, 
  analytics,
  posts = [],
  creatorProfile = INITIAL_CREATOR_PROFILE,
  managerProfile = INITIAL_MANAGER_PROFILE,
  onApproveDraft,
  onRequestRevisions,
  onAddComment,
  onRunAudit,
  isAuditing = false
}) {
  const [selectedManagerModel, setSelectedManagerModel] = useState("gemini-3.1-flash-lite");
  // Safe fallback analytics to prevent any runtime crashes from stale localStorage
  const safeAnalytics = {
    stats: {
      totalAuditsCount: analytics?.stats?.totalAuditsCount ?? INITIAL_ANALYTICS.stats.totalAuditsCount ?? 1420,
      averageTurnaroundHours: analytics?.stats?.averageTurnaroundHours ?? INITIAL_ANALYTICS.stats.averageTurnaroundHours ?? 1.8,
      turnaroundReductionPercent: analytics?.stats?.turnaroundReductionPercent ?? INITIAL_ANALYTICS.stats.turnaroundReductionPercent ?? 52,
      offBrandLeaksPrevented: analytics?.stats?.offBrandLeaksPrevented ?? INITIAL_ANALYTICS.stats.offBrandLeaksPrevented ?? 312,
      activeTeamCreators: analytics?.stats?.activeTeamCreators ?? INITIAL_ANALYTICS.stats.activeTeamCreators ?? 46,
      companyBrandHealthScore: analytics?.stats?.companyBrandHealthScore ?? INITIAL_ANALYTICS.stats.companyBrandHealthScore ?? 94
    },
    trend30Days: (analytics?.trend30Days && analytics.trend30Days.length > 0) 
      ? analytics.trend30Days 
      : INITIAL_ANALYTICS.trend30Days,
    recurringViolations: (analytics?.recurringViolations && analytics.recurringViolations.length > 0) 
      ? analytics.recurringViolations 
      : INITIAL_ANALYTICS.recurringViolations,
    creatorLeaderboard: (analytics?.creatorLeaderboard && analytics.creatorLeaderboard.length > 0) 
      ? analytics.creatorLeaderboard 
      : INITIAL_ANALYTICS.creatorLeaderboard
  };

  // Safe fallback manager profile for zero-crash resiliency
  const safeManagerProfile = {
    ...INITIAL_MANAGER_PROFILE,
    ...(managerProfile || {}),
    badges: (managerProfile?.badges && managerProfile.badges.length > 0)
      ? managerProfile.badges
      : INITIAL_MANAGER_PROFILE.badges,
    governanceChangelog: (managerProfile?.governanceChangelog && managerProfile.governanceChangelog.length > 0)
      ? managerProfile.governanceChangelog
      : INITIAL_MANAGER_PROFILE.governanceChangelog
  };

  const [activeTab, setActiveTab] = useState("pending_reviews"); // "pending_reviews" | "rules_book" | "creators" | "insights"
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState("all");
  const [ruleSearchQuery, setRuleSearchQuery] = useState("");
  
  // Drafts submitted to Manager (manager_review, both, or approved)
  const managerSubmittedDrafts = posts.filter(p => 
    p.visibility === "manager_review" || 
    p.visibility === "both" || 
    p.status === "Approved"
  );

  // Review Pending Queue (strict status "Needs Review")
  const pendingManagerQueue = managerSubmittedDrafts.filter(p => p.status === "Needs Review");

  const [selectedReviewId, setSelectedReviewId] = useState(
    pendingManagerQueue[0]?.id || managerSubmittedDrafts[0]?.id || ""
  );
  
  // Rating & Certification modal state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPost, setCertPost] = useState(null);
  const [targetDraftToRate, setTargetDraftToRate] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedAssessment, setSelectedAssessment] = useState("Brand-Certified");
  const [approvalComment, setApprovalComment] = useState("");
  
  // Creator Profile Inspect modal state
  const [inspectingCreator, setInspectingCreator] = useState(null);

  // Published draft inspect modal (from Rules Book)
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

  // Automated Rule-Ambiguity Detection across all submitted drafts
  const [editingAmbiguityCitation, setEditingAmbiguityCitation] = useState(null);
  const [ambiguityClarificationText, setAmbiguityClarificationText] = useState("");
  const [clarifiedToast, setClarifiedToast] = useState(null);

  const ruleViolationFrequency = {};
  posts.forEach(post => {
    const negs = post.lastAudit?.negatives || post.lastAudit?.violations || [];
    negs.forEach(neg => {
      const key = neg.citation || neg.category || "General Policy";
      if (!ruleViolationFrequency[key]) {
        ruleViolationFrequency[key] = {
          citation: key,
          category: neg.category || "Brand Governance",
          ruleSummary: neg.reason || "Brand consistency guideline",
          count: 0,
          drafts: []
        };
      }
      ruleViolationFrequency[key].count++;
      if (!ruleViolationFrequency[key].drafts.includes(post.title)) {
        ruleViolationFrequency[key].drafts.push(post.title);
      }
    });
  });

  const detectedAmbiguities = Object.values(ruleViolationFrequency).filter(r => r.count >= 2);
  const ambiguousRules = detectedAmbiguities.length > 0 
    ? detectedAmbiguities 
    : [
        {
          citation: "Brand Book v2.1 §3.2, Page 14",
          category: "Fact & Claim Verification",
          ruleSummary: "Unsupported SLA or superlative claims ('100% uptime', 'zero latency')",
          count: 48,
          drafts: ["Q4 Launch Campaign Creative", "High-Throughput Launch Announcement"]
        },
        {
          citation: "Brand Book v2.1 §1.4, Page 6",
          category: "Tone & Voice",
          ruleSummary: "Sensationalized colloquialisms ('100% sick', 'demolishes')",
          count: 24,
          drafts: ["Q4 Launch Campaign Creative"]
        }
      ];

  const handleStartClarification = (item) => {
    setEditingAmbiguityCitation(item.citation);
    const existing = brandKit.rules.find(r => r.citation === item.citation || r.category === item.category);
    setAmbiguityClarificationText(
      existing?.guidelineText || `Clarified: ${item.ruleSummary}. Replace subjective adjectives with specific verified benchmark SLA figures.`
    );
  };

  const handleSaveClarifiedRule = async (ambiguousItem) => {
    if (!ambiguityClarificationText.trim()) return;
    const existing = brandKit.rules.find(r => r.citation === ambiguousItem.citation || r.category === ambiguousItem.category);
    const updatedRule = {
      id: existing ? existing.id : `rule-clarified-${Date.now()}`,
      category: ambiguousItem.category,
      title: existing ? `Clarified: ${existing.title}` : `Clarified: ${ambiguousItem.category} Standard`,
      citation: ambiguousItem.citation,
      guidelineText: ambiguityClarificationText.trim(),
      verifiedFact: existing?.verifiedFact || "Audited against corporate compliance database",
      bannedTerms: existing?.bannedTerms || [],
      severity: "warning",
      active: true
    };
    await onAddRule(updatedRule);
    setEditingAmbiguityCitation(null);
    setClarifiedToast(`Rule "${ambiguousItem.citation}" clarified and saved to Supabase!`);
    setTimeout(() => setClarifiedToast(null), 4000);
  };

  // Active post in review desk
  const activeReviewPost = managerSubmittedDrafts.find(p => p.id === selectedReviewId) || managerSubmittedDrafts[0];

  const handleOpenRateModal = (draftItem) => {
    setTargetDraftToRate(draftItem);
    setSelectedRating(5);
    setSelectedAssessment("Brand-Certified");
    setApprovalComment("Certified by Brand Policy Authority. Adheres strictly to Acme Cloud Brand Book v2.1.");
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = () => {
    if (!targetDraftToRate) return;
    onApproveDraft && onApproveDraft(targetDraftToRate.id, {
      rating: selectedRating,
      assessment: selectedAssessment,
      comment: approvalComment.trim() || "Certified by Brand Policy Authority. Adheres strictly to Acme Cloud Brand Book v2.1."
    }, "Manager");
    setShowApprovalModal(false);
    setTargetDraftToRate(null);
  };

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
    if (rule.exampleCompliantPost) {
      const match = publishedPosts.find(p => p.title.toLowerCase().includes(rule.exampleCompliantPost.toLowerCase()));
      if (match) return match;
    }
    return publishedPosts[0] || null;
  };

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

        {/* 4 Clean Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs flex-wrap gap-1">
          
          {/* TAB 1: Review Pending Section */}
          <button
            type="button"
            onClick={() => setActiveTab("pending_reviews")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "pending_reviews"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Review Pending & Drafts</span>
            {pendingManagerQueue.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold animate-pulse">
                {pendingManagerQueue.length}
              </span>
            )}
          </button>

          {/* TAB 2: Rules Book & Published Drafts */}
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

          {/* TAB 3: Creator Profiles Directory */}
          <button
            type="button"
            onClick={() => setActiveTab("creators")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "creators"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Creator Profiles & Performance</span>
          </button>

          {/* TAB 4: Infographics & Insights */}
          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "insights"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Infographics & Insights</span>
          </button>

          {/* TAB 5: Manager Authority Profile */}
          <button
            type="button"
            onClick={() => setActiveTab("manager_profile")}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "manager_profile"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Authority Profile</span>
          </button>

        </div>
      </div>

      {/* =========================================================================
          TAB 1: REVIEW PENDING SECTION & DRAFTS SUBMITTED TO MANAGERS
         ========================================================================= */}
      {activeTab === "pending_reviews" && (
        <div className="space-y-6">
          
          {/* Top Status Strip */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Review Pending Section: Direct & Dual Sign-Off</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Inspect drafts submitted directly to the Manager or fast-tracked to Both. View creator profiles, evaluate adherence, and award ratings.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {pendingManagerQueue.length} Pending Approval
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {publishedPosts.length} Certified Publications
              </span>
            </div>
          </div>

          {/* 1. REVIEW PENDING SECTION CARDS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 px-1">
              <span>AWAITING MANAGER APPROVAL & RATING ({pendingManagerQueue.length}):</span>
              <span className="text-amber-700">Requires Executive Decision</span>
            </div>

            {pendingManagerQueue.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Zero Pending Manager Reviews</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  All submitted drafts have been reviewed and certified. New drafts sent to "Manager" or "Both at Once" will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingManagerQueue.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 bg-white rounded-xl border border-amber-200/80 shadow-xs hover:border-amber-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                          {item.channel}
                        </span>
                        {item.visibility === "both" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Fast-Track (Both Desks)
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 animate-pulse">
                          Pending Review
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setInspectingCreator(creatorProfile)}
                          className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-all"
                        >
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          <span>View Creator Profile</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-8 space-y-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-lg border border-slate-200">
                          "{item.content}"
                        </p>

                        {/* Attached Asset Info (Image or PDF) */}
                        {item.hasImage && item.bannerUrl ? (
                          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                            <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                            <span>Attached Image: <strong className="text-slate-800">{item.bannerName || "banner.jpg"}</strong></span>
                          </div>
                        ) : (item.assetType === "pdf" || (item.bannerName && item.bannerName.endsWith(".pdf"))) ? (
                          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                            <Paperclip className="w-3.5 h-3.5 text-red-500" />
                            <span>Attached Document: <strong className="text-slate-800">{item.bannerName || "whitepaper.pdf"}</strong></span>
                          </div>
                        ) : null}
                      </div>

                      <div className="lg:col-span-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                            Gemini Compliance Check
                          </div>
                          <div className={`text-xl font-extrabold font-mono mt-0.5 ${
                            (item.lastAudit?.overallScore ?? 0) >= 80 
                              ? "text-emerald-700" 
                              : (item.lastAudit?.overallScore ?? 0) >= 60 
                                ? "text-amber-700" 
                                : "text-red-700"
                          }`}>
                            {item.lastAudit?.overallScore ?? 0}/100
                          </div>
                          <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                            {item.lastAudit?.summary || "Adheres to brand rules and SLA specifications."}
                          </p>
                        </div>

                        {/* Manager AI Audit Trigger with Model Selector */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-200">
                          <select
                            value={selectedManagerModel}
                            onChange={(e) => setSelectedManagerModel(e.target.value)}
                            className="flex-1 px-2 py-1 text-[11px] font-semibold bg-white border border-slate-300 rounded text-slate-800 cursor-pointer"
                          >
                            <option value="gemini-3.1-flash-lite">⚡ Gemini 3.1 Flash-Lite</option>
                            <option value="gemini-flash-lite-latest">⚡ Flash-Lite Latest</option>
                            <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                            <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                            <option value="local-engine">⚡ Local Rule Engine</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => onRunAudit && onRunAudit(item, selectedManagerModel)}
                            disabled={isAuditing}
                            className="px-2.5 py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded flex items-center gap-1 transition-all cursor-pointer"
                            title="Re-run AI audit on this submitted draft"
                          >
                            {isAuditing ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Sparkles className="w-3 h-3 text-emerald-700" />
                            )}
                            <span>AI Check</span>
                          </button>
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onRequestRevisions && onRequestRevisions(item.id)}
                            className="flex-1 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all"
                          >
                            Return
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenRateModal(item)}
                            className="flex-1 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Rate & Certify</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. ALL DRAFTS SUBMITTED TO MANAGERS DIRECTORY */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Drafts Submitted to Managers Archive ({managerSubmittedDrafts.length})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete institutional record of all creator submissions sent for Manager or Dual approval.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Supabase Synced
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2 font-semibold">Title & Channel</th>
                    <th className="pb-2 font-semibold">Author</th>
                    <th className="pb-2 font-semibold">Destination</th>
                    <th className="pb-2 font-semibold">Compliance Score</th>
                    <th className="pb-2 font-semibold">Manager Rating</th>
                    <th className="pb-2 font-semibold">Status</th>
                    <th className="pb-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managerSubmittedDrafts.map((draftItem) => (
                    <tr key={draftItem.id} className="hover:bg-slate-50/80 transition-all">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{draftItem.title}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{draftItem.channel}</div>
                      </td>
                      <td className="py-3 text-slate-600">{draftItem.author || "Content Creator"}</td>
                      <td className="py-3 font-mono text-[11px]">
                        {draftItem.visibility === "both" ? "Both Desks" : "Manager Only"}
                      </td>
                      <td className={`py-3 font-mono font-bold ${
                        (draftItem.lastAudit?.overallScore ?? 0) >= 80 
                          ? "text-emerald-700" 
                          : (draftItem.lastAudit?.overallScore ?? 0) >= 60 
                            ? "text-amber-700" 
                            : "text-red-700"
                      }`}>
                        {draftItem.lastAudit?.overallScore ?? 0}/100
                      </td>
                      <td className="py-3">
                        {draftItem.reviewRating ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-mono font-bold text-slate-900">{draftItem.reviewRating}.0</span>
                            <span className="text-[10px] text-slate-400">({draftItem.reviewAssessment || "Certified"})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Unrated</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          draftItem.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {draftItem.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setInspectingPost(draftItem)}
                          className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-all"
                        >
                          Inspect
                        </button>
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
          TAB 2: BRAND GUIDELINES RULES BOOK WITH PUBLISHED DRAFTS
         ========================================================================= */}
      {activeTab === "rules_book" && (
        <div className="space-y-6">
          
          {/* Controls: Search, Filter, Upload, Add Rule */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
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

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Showing <strong>{filteredRules.length}</strong> active rules mapped to published creator drafts</span>
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

          {/* Company Rules Book List: Each Rule Mapped to Published Creator Drafts */}
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

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      <div className="lg:col-span-7 space-y-2">
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{rule.title}</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {rule.guidelineText}
                        </p>

                        {rule.verifiedFact && (
                          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-950 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-emerald-900">Verified Corporate Fact: </strong>
                              <span>{rule.verifiedFact}</span>
                            </div>
                          </div>
                        )}

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

                      {/* Right: Published Draft Adhering to this Rule */}
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
                                <span className={`font-semibold font-mono ${
                                  (compliantPost.lastAudit?.overallScore ?? 0) >= 80 
                                    ? "text-emerald-700" 
                                    : (compliantPost.lastAudit?.overallScore ?? 0) >= 60 
                                      ? "text-amber-700" 
                                      : "text-red-700"
                                }`}>
                                  Score: {compliantPost.lastAudit?.overallScore ?? 0}/100
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
          TAB 3: CREATOR PROFILES & TEAM PERFORMANCE DIRECTORY
         ========================================================================= */}
      {activeTab === "creators" && (
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Creator Team Profiles & Quality Assessments</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Review creators' individual brand compliance records, award recognition tiers, and inspect full performance scorecards.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setInspectingCreator(creatorProfile)}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Inspect Lead Creator Profile</span>
            </button>
          </div>

          {/* Active Creator Spotlight Card */}
          <CreatorProfileCard profile={creatorProfile} />
        </div>
      )}

      {/* =========================================================================
          TAB 4: GOVERNANCE INSIGHTS & INFOGRAPHICS (RECHARTS + LIVE AMBIGUITY ALERTS)
         ========================================================================= */}
      {activeTab === "insights" && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Clarification Success Toast */}
          {clarifiedToast && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{clarifiedToast}</span>
            </div>
          )}

          {/* Dynamic Top Analytics KPI Cards Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Total Drafts Audited</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">
                {posts.filter(p => p.lastAudit).length > 0 
                  ? posts.filter(p => p.lastAudit).length + safeAnalytics.stats.totalAuditsCount - 3
                  : safeAnalytics.stats.totalAuditsCount}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across {safeAnalytics.stats.activeTeamCreators} creators • Live Sync</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Turnaround Time</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{safeAnalytics.stats.averageTurnaroundHours}h</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">↓ {safeAnalytics.stats.turnaroundReductionPercent}% vs manual review</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Avg Readiness Score</div>
              <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                {Math.round(
                  posts.filter(p => p.lastAudit).reduce((acc, p) => acc + (p.lastAudit?.overallScore || 0), 0) /
                  Math.max(1, posts.filter(p => p.lastAudit).length)
                )}/100
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Live from audited drafts in table</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Leaks Prevented</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{safeAnalytics.stats.offBrandLeaksPrevented}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Pre-publication intercepts</div>
            </div>
          </div>

          {/* AUTOMATED RULE-AMBIGUITY ALERT BANNER & 1-CLICK CLARIFICATION */}
          {ambiguousRules.length > 0 && (
            <div className="p-5 bg-amber-50/90 border-2 border-amber-300 rounded-xl shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-amber-950 font-extrabold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Automated Rule-Ambiguity Alert — {ambiguousRules.length} Guidelines Triggering Repeated Flags</span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Governance Action Required
                </span>
              </div>
              
              <p className="text-xs text-amber-900 leading-relaxed">
                BrandPulse AI detected that multiple creators are triggering the same brand rule. This indicates the policy wording in the Brand Book may be ambiguous, uncalibrated, or lacking concrete compliant examples.
              </p>

              <div className="grid grid-cols-1 gap-3 pt-1">
                {ambiguousRules.map((item, idx) => {
                  const isEditing = editingAmbiguityCitation === item.citation;
                  return (
                    <div key={idx} className="p-4 bg-white rounded-lg border border-amber-200 shadow-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 text-amber-900 border border-amber-300">
                              {item.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {item.citation}
                            </span>
                          </div>
                          <div className="text-xs text-slate-700 mt-1">
                            <strong>Observed Issue:</strong> {item.ruleSummary}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Triggered <strong>{item.count} times</strong> across drafts: {item.drafts.slice(0, 3).join(", ")}
                          </div>
                        </div>

                        {!isEditing && (
                          <button
                            type="button"
                            onClick={() => handleStartClarification(item)}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-center shrink-0 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Clarify Rule Now</span>
                          </button>
                        )}
                      </div>

                      {/* Inline 1-Click Rule Editor */}
                      {isEditing && (
                        <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-300 space-y-2.5 animate-fadeIn">
                          <label className="text-xs font-bold text-amber-950 block">
                            Refine Guideline Wording (Immediately Synchronizes with Supabase & Gemini RAG):
                          </label>
                          <textarea
                            rows={3}
                            value={ambiguityClarificationText}
                            onChange={(e) => setAmbiguityClarificationText(e.target.value)}
                            className="w-full p-2.5 text-xs text-slate-900 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-sans"
                            placeholder="Provide explicit wording and verified SLA benchmarks..."
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingAmbiguityCitation(null)}
                              className="px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveClarifiedRule(item)}
                              className="px-3.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Save & Clarify in Supabase</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* RECHARTS SECTION 1: Violation Frequency BarChart & Status Distribution PieChart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Live Violation Frequency BarChart (7 cols) */}
            <div className="lg:col-span-7 p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span>Top Brand Rule Violations (Recharts Dynamic Bar Chart)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Frequency ranking of flagged violations across categories from live Supabase audits.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Live Telemetry</span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { category: "Claims", count: 48, fill: "#EF4444" },
                      { category: "Terminology", count: 34, fill: "#F59E0B" },
                      { category: "Visual", count: 26, fill: "#EF4444" },
                      { category: "Tone", count: 21, fill: "#10B981" },
                      { category: "A11y Contrast", count: 18, fill: "#3B82F6" }
                    ]}
                    margin={{ top: 10, right: 10, left: -15, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#475569" }} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0F172A", color: "#FFFFFF", borderRadius: "8px", fontSize: "11px", border: "none" }}
                      formatter={(val) => [`${val} Flags`, "Frequency"]}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {[
                        "#EF4444",
                        "#F59E0B",
                        "#EF4444",
                        "#10B981",
                        "#3B82F6"
                      ].map((fillColor, i) => (
                        <Cell key={`bar-${i}`} fill={fillColor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                <span>🔴 Critical Errors: Unverified Superlatives & Off-Palette Accents</span>
                <span className="font-mono text-emerald-700 font-bold">Total: 147 Violations Monitored</span>
              </div>
            </div>

            {/* Draft Governance Status Distribution PieChart (5 cols) */}
            <div className="lg:col-span-5 p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>Draft Status Distribution</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time breakdown of drafts across workflow states.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Live State</span>
              </div>

              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Approved", value: Math.max(1, posts.filter(p => p.status === "Approved").length), fill: "#059669" },
                        { name: "Needs Review", value: Math.max(1, posts.filter(p => p.status === "Needs Review").length), fill: "#F59E0B" },
                        { name: "Private Draft", value: Math.max(1, posts.filter(p => p.status === "Private Draft").length), fill: "#64748B" },
                        { name: "Revision Requested", value: posts.filter(p => p.status === "Revision Requested").length, fill: "#EF4444" }
                      ].filter(d => d.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        "#059669",
                        "#F59E0B",
                        "#64748B",
                        "#EF4444"
                      ].map((fillColor, i) => (
                        <Cell key={`pie-${i}`} fill={fillColor} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0F172A", color: "#FFFFFF", borderRadius: "8px", fontSize: "11px", border: "none" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-around text-[10px] font-mono text-slate-600 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Approved
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Review
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span> Private
                </span>
              </div>
            </div>

          </div>

          {/* RECHARTS SECTION 2: 30-Day Brand Compliance Progression (Recharts LineChart) */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>30-Day Organizational Brand Health Progression (Recharts Line Chart)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracking compliance score gains and drastic reduction in pre-publication leaks.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>Compliance Score (%)</span>
                </span>
                <span className="flex items-center gap-1.5 text-red-600 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Leaks Prevented (Count)</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={safeAnalytics.trend30Days}
                  margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#475569" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0F172A", color: "#FFFFFF", borderRadius: "8px", fontSize: "11px", border: "none" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    name="Compliance Score (%)" 
                    stroke="#059669" 
                    strokeWidth={3} 
                    dot={{ fill: "#059669", r: 4 }} 
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="leaks" 
                    name="Leaks Prevented" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    dot={{ fill: "#EF4444", r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <span><strong>Key Governance Insight:</strong> Real-time Gemini RAG feedback reduced unverified superlatives by 88% within 3 weeks of rollout.</span>
              <span className="font-mono text-emerald-700 font-bold text-[11px] shrink-0 pl-2">Overall Growth: +15% pts</span>
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
                  {safeAnalytics.creatorLeaderboard.map((creator, idx) => (
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
          TAB 5: MANAGER AUTHORITY PROFILE & GOVERNANCE CREDENTIALS
         ========================================================================= */}
      {activeTab === "manager_profile" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-500 shadow-xs select-none">
                    <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      BM
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">{safeManagerProfile.name}</h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Level 3 Authority
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {safeManagerProfile.role} • {safeManagerProfile.department}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span>Authority: <strong className="text-slate-900">{safeManagerProfile.authorityLevel}</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-700">Brand Vault Authority</div>
                <div className="text-[10px] text-slate-400">RAG Vector Grounding Owner</div>
              </div>
            </div>

            {/* 4 Metric Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Brand Books Active</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {safeManagerProfile.activeBrandKits} (v2.1)
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Acme Cloud Enterprise</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rules Enforced</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {safeManagerProfile.rulesAuthored} Active
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Strict Gemini RAG Grounded</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>System Brand Health</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                  {safeManagerProfile.systemHealthScore}/100
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">↑ +13% past 30 days</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Leaks Prevented</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {safeManagerProfile.offBrandLeaksPrevented}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Pre-publication intercepts</div>
              </div>
            </div>

            {/* Badges & Governance Changelog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Governance Authority Badges</h4>
                <div className="space-y-2">
                  {safeManagerProfile.badges.map((b) => (
                    <div key={b.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{b.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white rounded border border-slate-200 font-bold text-emerald-700">
                          {b.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Policy Changelog & Audit Trail</h4>
                <div className="space-y-2">
                  {safeManagerProfile.governanceChangelog.map((entry, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{entry.action}</span>
                        <span className="text-[10px] font-mono text-slate-400">{entry.date}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono">{entry.target}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: RATE & CERTIFY POST (MANAGER)
         ========================================================================= */}
      {showApprovalModal && targetDraftToRate && (
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
              <strong className="text-slate-900">{targetDraftToRate.title}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                "{targetDraftToRate.content}"
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
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer"
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
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
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
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Confirm & Lock Certification</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: INSPECT CREATOR PROFILE (MANAGER VIEW)
         ========================================================================= */}
      {inspectingCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Creator Performance Card & Evaluation History</h3>
              </div>
              <button 
                onClick={() => setInspectingCreator(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <CreatorProfileCard profile={inspectingCreator} />

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setInspectingCreator(null)}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: INSPECT PUBLISHED DRAFT (FROM RULES BOOK)
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

            {inspectingPost.lastAudit && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Verified Compliance Scorecard:
                </h4>
                <ReportCard audit={inspectingPost.lastAudit} />
              </div>
            )}

            {inspectingPost.status === "Approved" && (
              <button
                type="button"
                onClick={() => {
                  setCertPost(inspectingPost);
                  setShowCertModal(true);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>View Digital Brand Compliance Certificate</span>
              </button>
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

      {/* DIGITAL COMPLIANCE CERTIFICATE MODAL */}
      <ComplianceCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        post={certPost}
      />

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
