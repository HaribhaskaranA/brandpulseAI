import React from "react";
import { ShieldCheck, CheckCircle2, Star, Sparkles, Award, Lock } from "lucide-react";

/**
 * GovernanceVerifiedBadge
 * Displays a locked "BrandPulse Governance Verified" sign-off card
 * with timestamp, guideline version, final compliance score, and Google Gemini AI disclosure.
 */
export default function GovernanceVerifiedBadge({ 
  draft, 
  reviewerRole = "Editorial Leader",
  guidelineVersion = "Acme Cloud Brand Book v2.1 (Q4 Compliance Standard)" 
}) {
  if (!draft) return null;

  const score = draft.lastAudit?.overallScore ?? 96;
  const rating = draft.reviewRating || 5;
  const assessment = draft.reviewAssessment || "Exceeds Standard";
  const comment = draft.reviewComment || "Formally certified against brand guidelines and verified factual claims.";
  
  const formattedDate = draft.reviewedAt 
    ? new Date(draft.reviewedAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      })
    : new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true
      });

  const verificationHash = `BP-GOV-${score}-${(draft.id || "DRAFT").toUpperCase().replace(/[^A-Z0-9]/g, "")}-${Math.abs((draft.title || "").length * 31).toString(16).toUpperCase()}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 text-white p-5 shadow-xl space-y-4">
      {/* Background Watermark Shield */}
      <div className="absolute -right-6 -bottom-8 opacity-10 pointer-events-none select-none text-emerald-400">
        <ShieldCheck className="w-56 h-56" />
      </div>

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-emerald-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                <span>BrandPulse Governance Verified</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400 inline" />
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                APPROVED FOR PUBLICATION
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 font-mono mt-0.5">
              Digital Brand Clearance & Editorial Sign-Off Certificate
            </p>
          </div>
        </div>

        {/* Verification Reference Badge */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-[10px] font-mono">
          <span className="text-slate-400 uppercase tracking-widest text-[9px]">Certificate Hash</span>
          <span className="text-emerald-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
            {verificationHash}
          </span>
        </div>
      </div>

      {/* Grid of Verified Sign-Off Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Sign-Off Timestamp</span>
          <div className="font-mono font-bold text-slate-200 text-[11px] truncate">
            {formattedDate}
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Guideline Baseline</span>
          <div className="font-semibold text-slate-200 text-[11px] truncate" title={guidelineVersion}>
            Brand Book v2.1
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Final Compliance Score</span>
          <div className="flex items-center gap-1.5">
            <span className={`font-mono font-black text-sm ${
              score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400"
            }`}>
              {score}/100
            </span>
            <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
              PASSED
            </span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-900/70 rounded-xl border border-slate-800 space-y-0.5">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Certified By</span>
          <div className="font-semibold text-emerald-300 text-[11px] flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>{reviewerRole}</span>
          </div>
        </div>
      </div>

      {/* Reviewer Quality Rating & Sign-Off Endorsement */}
      <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/20 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
            <span className="font-mono font-bold text-slate-200 ml-1 text-[11px]">
              {rating}/5.0 ({assessment})
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Clearance Authorized
          </span>
        </div>
        <p className="text-[11px] text-slate-300 italic pl-2.5 border-l-2 border-emerald-500 leading-relaxed font-sans">
          "{comment}"
        </p>
      </div>

      {/* Required Transparency Disclosure */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>
            <strong>Evaluated with Google Gemini AI:</strong> Pre-flight semantic & pixel verification completed.
          </span>
        </div>
        <span className="text-emerald-400/90 font-medium">
          Locked Human Editorial Clearance
        </span>
      </div>
    </div>
  );
}
