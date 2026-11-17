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
  Sparkles
} from "lucide-react";
import ReportCard from "./ReportCard";

export default function LeaderView({ 
  drafts, 
  selectedDraftId, 
  onSelectDraft, 
  onApproveDraft, 
  onRequestRevisions, 
  onAddComment 
}) {
  const [commentText, setCommentText] = useState("");

  const activeDraft = drafts.find(d => d.id === selectedDraftId) || drafts[0];

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(activeDraft.id, {
      author: "Editorial Leader",
      role: "Leader",
      text: commentText.trim()
    });
    setCommentText("");
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
        return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-slate-100 text-slate-700">Draft</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Sidebar: Draft Review Queue (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Editorial Review Desk ({drafts.length})</span>
              </h2>
              <p className="text-[11px] text-slate-500">Departmental publications pending sign-off</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active
            </span>
          </div>

          {/* Role Isolation Notice */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
            <span className="font-bold text-slate-800 block">🔒 Creator Content Privacy Protected</span>
            <p className="text-[10px] text-slate-500 leading-tight">
              Individual creator drafts remain confidential in creator workspaces. Only designated organizational documents appear in this review desk.
            </p>
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
                    <span>{d.author?.split(" ")[0]}</span>
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

        {/* Human Authority Safeguard Callout */}
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Human-in-the-Loop Safeguard</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Google Gemini acts strictly as an advisory copilot. Publishing sign-off or return with revisions requires explicit human leadership consent.
          </p>
        </div>
      </div>

      {/* Main Panel: Shared Audit & Diff Inspector (8 cols) */}
      <div className="lg:col-span-8 space-y-5">
        
        {/* Top Header Card of Selected Draft */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded">
                  {activeDraft.channel}
                </span>
                {getStatusBadge(activeDraft.status)}
              </div>
              <h1 className="text-lg font-extrabold text-slate-900">{activeDraft.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Submitted by <strong>{activeDraft.author}</strong> on {new Date(activeDraft.submittedAt).toLocaleDateString()}
              </p>
            </div>

            {/* Approval Decision Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onRequestRevisions(activeDraft.id)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <XCircle className="w-3.5 h-3.5 text-slate-500" />
                <span>Request Revisions</span>
              </button>

              <button
                type="button"
                onClick={() => onApproveDraft(activeDraft.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve for Publication</span>
              </button>
            </div>
          </div>

          {/* Approved Publication Badge if Approved */}
          {activeDraft.status === "Approved" && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <strong className="block text-emerald-950">Brand-Certified for Publication</strong>
                  <span className="text-[11px] text-emerald-800">
                    Formally approved by Editorial Leader. Timestamped immutable audit trail locked.
                  </span>
                </div>
              </div>
              <span className="font-mono text-[10px] text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200">
                LOCKED: PASS
              </span>
            </div>
          )}

          {/* Submitted Copy Inspector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700">Submitted Copy Body</span>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-900 leading-relaxed font-sans">
              {activeDraft.content}
            </div>
          </div>

          {/* Attached Creative Preview */}
          {activeDraft.hasImage && (
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Attached Marketing Banner</span>
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

        {/* Live Shared Gemini Audit Report */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-900 uppercase">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Shared Gemini Pre-Flight Audit Report</span>
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
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3 h-3" />
              <span>Post</span>
            </button>
          </form>
        </div>

        {/* Revision History & Audit Trail */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-900 uppercase pb-2 border-b border-slate-100">
            <History className="w-4 h-4 text-slate-500" />
            <span>Revision History & AI Audit Provenance</span>
          </div>

          <div className="space-y-2 text-xs">
            {(activeDraft.history || []).map((h) => (
              <div key={h.id} className="flex items-start gap-2.5 text-slate-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5"></span>
                <div>
                  <span className="font-semibold text-slate-900">{h.author}: </span>
                  <span>{h.note}</span>
                  <span className="text-[10px] text-slate-400 font-mono ml-2">
                    {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
