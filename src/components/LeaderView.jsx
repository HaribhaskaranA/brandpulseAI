import React, { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  History, 
  Send, 
  Clock, 
  Check, 
  FileText, 
  AlertTriangle, 
  ShieldCheck,
  UserCheck,
  Sparkles,
  Inbox,
  Star,
  Award,
  Eye,
  GitCompare,
  FileCheck2,
  Lock,
  User,
  Zap,
  RefreshCw
} from "lucide-react";
import ReportCard from "./ReportCard";
import ComplianceCertificateModal from "./ComplianceCertificateModal";
import { INITIAL_LEADER_PROFILE } from "../data/initialData";

export default function LeaderView({ 
  drafts = [], 
  selectedDraftId, 
  leaderProfile = INITIAL_LEADER_PROFILE,
  onSelectDraft, 
  onApproveDraft, 
  onRequestRevisions, 
  onAddComment,
  onRunAudit,
  isAuditing = false
}) {
  // Safe fallback leader profile for zero-crash resiliency
  const safeLeaderProfile = {
    ...INITIAL_LEADER_PROFILE,
    ...(leaderProfile || {}),
    badges: (leaderProfile?.badges && leaderProfile.badges.length > 0)
      ? leaderProfile.badges
      : INITIAL_LEADER_PROFILE.badges,
    recentReviewsAwarded: (leaderProfile?.recentReviewsAwarded && leaderProfile.recentReviewsAwarded.length > 0)
      ? leaderProfile.recentReviewsAwarded
      : INITIAL_LEADER_PROFILE.recentReviewsAwarded
  };

  const [activeSubTab, setActiveSubTab] = useState("review_desk"); // "review_desk" | "leader_profile"
  const [selectedLeaderModel, setSelectedLeaderModel] = useState("gemini-3.1-flash-lite");
  const [commentText, setCommentText] = useState("");
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showDiff, setShowDiff] = useState(false);
  
  const [selectedRating, setSelectedRating] = useState(5);
  const [selectedAssessment, setSelectedAssessment] = useState("Exceeds Standard");
  const [approvalComment, setApprovalComment] = useState("");

  const activeDraft = drafts.find(d => d.id === selectedDraftId) || drafts[0];

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || !activeDraft) return;
    onAddComment(activeDraft.id, {
      author: "Editorial Leader",
      role: "Leader",
      text: commentText.trim()
    });
    setCommentText("");
  };

  const handleConfirmApproval = () => {
    onApproveDraft(activeDraft.id, {
      rating: selectedRating,
      assessment: selectedAssessment,
      comment: approvalComment.trim() || "Exemplary brand book adherence. Official SLA data quoted flawlessly."
    }, "Leader");
    setShowApprovalModal(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-100 text-emerald-800">Approved</span>;
      case "Revision Requested":
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-red-100 text-red-800">Revision Requested</span>;
      case "Needs Review":
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-amber-100 text-amber-800 animate-pulse">Needs Review</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-100 text-slate-700">{status || "Draft"}</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Sub-Tab Navigation: Review Desk vs Leader Profile */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab("review_desk")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "review_desk"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Editorial Review Desk ({drafts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("leader_profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "leader_profile"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Reviewer Profile & Statistics</span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500">
            Authority: <strong className="text-slate-900">Level 2 Editorial Clearance</strong>
          </span>
        </div>
      </div>

      {/* VIEW 1: LEADER PROFILE VIEW */}
      {activeSubTab === "leader_profile" && (
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-500 shadow-xs select-none">
                    <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                      EL
                    </span>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                    ✓
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-extrabold text-slate-900">{safeLeaderProfile.name}</h2>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                      Level 2 Sign-Off
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {safeLeaderProfile.role} • {safeLeaderProfile.department}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                    <span>Approval Ratio: <strong className="text-slate-900 font-mono">{safeLeaderProfile.approvalRate}%</strong></span>
                    <span>•</span>
                    <span>Average Quality Rating: <strong className="text-amber-600 font-mono">{safeLeaderProfile.qualityRatingGiven} ★</strong></span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-emerald-700">Editorial Desk Authority</div>
                <div className="text-[10px] text-slate-400">Pre-Publication Peer Review Gate</div>
              </div>
            </div>

            {/* 4 Metric Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Reviews Completed</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {safeLeaderProfile.reviewsCompleted}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Across social & doc channels</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Turnaround Speed</span>
                </div>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                  {safeLeaderProfile.averageTurnaround}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Top 10% in organization</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Clearance Status</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  Active
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Editorial publishing authority</div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Reviewer Tier</span>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  Senior Lead
                </div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Dual sign-off authorized</div>
              </div>
            </div>

            {/* Badges & Recent Review Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Governance Badges</h4>
                <div className="space-y-2">
                  {safeLeaderProfile.badges.map((b) => (
                    <div key={b.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{b.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 font-bold border border-purple-200">
                          {b.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase font-mono">Recent Reviews Awarded</h4>
                <div className="space-y-2">
                  {safeLeaderProfile.recentReviewsAwarded.map((rev) => (
                    <div key={rev.id} className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[200px]">{rev.postTitle}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-mono font-bold text-slate-900">{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 italic">"{rev.note}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: EDITORIAL REVIEW DESK */}
      {activeSubTab === "review_desk" && (
        <>
          {(!drafts || drafts.length === 0 || !activeDraft) ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 my-6">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Editorial Queue Empty</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Creator drafts remain strictly in private workspaces until creators click <strong>"Send for Review"</strong>. 
                When a draft is submitted, it will appear here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Sidebar: Draft Review Queue (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>Editorial Review Queue ({drafts.length})</span>
                      </h2>
                      <p className="text-[11px] text-slate-500">Submitted posts awaiting editorial approval & rating</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Live Synced
                    </span>
                  </div>

                  <div className="space-y-2">
                    {drafts.map((d) => {
                      const isSelected = d.id === activeDraft?.id;
                      const score = d.lastAudit?.overallScore || 0;
                      return (
                        <div
                          key={d.id}
                          onClick={() => onSelectDraft(d.id)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-emerald-50/60 border-emerald-400 shadow-xs"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
                              {d.channel}
                            </span>
                            {getStatusBadge(d.status)}
                          </div>

                          <h3 className="font-bold text-slate-900 line-clamp-1 mb-1">
                            {d.title}
                          </h3>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <span>{d.author}</span>
                              {d.visibility === "both" && (
                                <span className="text-[9px] bg-purple-100 text-purple-700 px-1 rounded font-bold">Both</span>
                              )}
                            </span>
                            <span className={`font-mono font-bold ${
                              score >= 80 ? "text-emerald-700" : score >= 60 ? "text-amber-700" : "text-red-700"
                            }`}>
                              Score: {score}/100
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Human-in-the-Loop Governance</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Google Gemini audits content strictly as an advisory brand copilot. Formal publication clearance requires explicit human decision.
                  </p>
                </div>
              </div>

              {/* Main Panel: Shared Audit, Diff Inspector, & Actions (8 cols) */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Draft Header & Action Controls */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                          {activeDraft.channel}
                        </span>
                        {getStatusBadge(activeDraft.status)}
                        {activeDraft.visibility === "both" && (
                          <span className="text-[10px] font-mono font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                            Fast-Track (Leader + Manager)
                          </span>
                        )}
                      </div>
                      <h1 className="text-lg font-extrabold text-slate-900">{activeDraft.title}</h1>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Submitted by <strong>{activeDraft.author}</strong> on {new Date(activeDraft.submittedAt || activeDraft.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {activeDraft.status === "Approved" ? (
                        <button
                          type="button"
                          onClick={() => setShowCertModal(true)}
                          className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <Award className="w-4 h-4 text-emerald-700" />
                          <span>View Digital Certificate</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => onRequestRevisions(activeDraft.id)}
                            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5 text-slate-500" />
                            <span>Request Revisions</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowApprovalModal(true)}
                            className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Rate & Approve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Certified Status Banner if Approved */}
                  {activeDraft.status === "Approved" && (
                    <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2 text-xs text-emerald-950">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <strong className="text-emerald-950 text-sm">Formally Brand-Certified for Publication</strong>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {[...Array(activeDraft.reviewRating || 5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                          <span className="font-mono font-bold text-xs ml-1 text-slate-900">
                            ({activeDraft.reviewRating || 5}/5 - {activeDraft.reviewAssessment || "Exceeds Standard"})
                          </span>
                        </div>
                      </div>

                      {activeDraft.reviewComment && (
                        <p className="text-[11px] text-emerald-900 italic pl-3 border-l-2 border-emerald-500">
                          "{activeDraft.reviewComment}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Diff Inspector Toggle & Content */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Content Inspection</span>
                      <button
                        type="button"
                        onClick={() => setShowDiff(!showDiff)}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        <span>{showDiff ? "Hide Diff" : "Show Brand Fix Diff"}</span>
                      </button>
                    </div>

                    {showDiff ? (
                      /* Diff Comparison View */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-red-600 font-bold uppercase">Original Draft (With Superlatives)</span>
                          <div className="p-2.5 bg-red-50/50 rounded-lg border border-red-200 text-slate-800 line-through">
                            "Our 100% sick cloud engine guarantees 10x faster speeds than every competitor! Acme Cloud completely demolishes old legacy databases with guaranteed 100% uptime and zero latency."
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="font-mono text-[10px] text-emerald-700 font-bold uppercase">Intent-Preserving Brand Fix (Ground Truth)</span>
                          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-300 text-slate-900 font-medium">
                            "{activeDraft.content}"
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans">
                        {activeDraft.content}
                      </div>
                    )}
                  </div>

                  {/* Attached Creative Preview */}
                  {activeDraft.hasImage && activeDraft.bannerUrl && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Attached Visual Creative</span>
                      <div className="rounded-lg overflow-hidden border border-slate-200 max-h-48 relative">
                        <img
                          src={activeDraft.bannerUrl}
                          alt="Banner preview"
                          className="w-full h-36 object-cover"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/80 text-white text-[10px] font-mono rounded backdrop-blur-xs">
                          {activeDraft.bannerName}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Live Shared Gemini Audit Report & Leader AI Review Toolbar */}
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Leader AI Verification Desk</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
                            Re-audit with AI
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Leaders can independently trigger AI review using any model.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedLeaderModel}
                        onChange={(e) => setSelectedLeaderModel(e.target.value)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 cursor-pointer shadow-2xs"
                      >
                        <option value="gemini-3.1-flash-lite">⚡ Gemini 3.1 Flash-Lite (Fastest)</option>
                        <option value="gemini-flash-lite-latest">⚡ Gemini Flash-Lite Latest</option>
                        <option value="gemini-3.5-flash-lite">⚡ Gemini 3.5 Flash-Lite</option>
                        <option value="gemini-3.8-flash">Gemini 3.8 Flash (Multimodal)</option>
                        <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                        <option value="local-engine">⚡ Local Rule Engine (~15ms)</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => onRunAudit && onRunAudit(activeDraft, selectedLeaderModel)}
                        disabled={isAuditing}
                        className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        {isAuditing ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Auditing...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span>Run Leader AI Check</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <ReportCard audit={activeDraft.lastAudit} onApplyFix={null} />
                </div>

                {/* Collaborative Comment Thread */}
                <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                    <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span>Collaborative Review Thread ({activeDraft.comments?.length || 0})</span>
                    </h3>
                    <span className="text-slate-400 font-mono text-[11px]">Real-time Creator & Leader sync</span>
                  </div>

                  <div className="space-y-2.5">
                    {(activeDraft.comments || []).map((comm) => (
                      <div key={comm.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{comm.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">{comm.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handlePostComment} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Leave inline leadership guidance or request specific rewrites..."
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </form>
                </div>

              </div>
            </div>
          )}
        </>
      )}

      {/* APPROVAL & RATING MODAL */}
      {showApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  ★
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Leader Quality Rating & Certification</h3>
                  <p className="text-[11px] text-slate-500">Approve draft and award creator quality rating</p>
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
              <span className="text-slate-500 font-mono text-[10px] uppercase">Draft: </span>
              <strong className="text-slate-900">{activeDraft.title}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                "{activeDraft.content}"
              </div>
            </div>

            {/* 1 to 5 Star Rating */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Award Creator Quality Rating (Feeds Profile & Leaderboard):
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
                  "Exceeds Standard", 
                  "Brand-Certified", 
                  "Compliant", 
                  "Guidance Needed"
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
              <label className="text-xs font-bold text-slate-800">Executive Feedback & Guidance Note:</label>
              <textarea
                rows={2}
                value={approvalComment}
                onChange={(e) => setApprovalComment(e.target.value)}
                placeholder="e.g. Flawless SLA claim precision (§3.2). Measured, authoritative tone throughout."
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
                <span>Confirm & Lock Approval</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DIGITAL COMPLIANCE CERTIFICATE MODAL */}
      <ComplianceCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        post={activeDraft}
      />

    </div>
  );
}
