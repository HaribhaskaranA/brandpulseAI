import React, { useState } from "react";
import { GitCompare, Check, X, ShieldAlert, Sparkles } from "lucide-react";

/**
 * BeforeAfterDiffViewer
 * Clean Before vs. After Text Diff component displaying original draft text
 * alongside creator-revised text with visual change annotations.
 */
export default function BeforeAfterDiffViewer({ 
  originalText, 
  revisedText,
  title = "Content Inspection"
}) {
  const [viewMode, setViewMode] = useState("side-by-side"); // "side-by-side" | "inline"

  const before = originalText || "";
  const after = revisedText || "";
  const hasChanges = before.trim() !== after.trim();

  // Known brand violations to highlight specifically if present in original text
  const flaggedTerms = [
    "100% sick", 
    "10x faster speeds than every competitor", 
    "10x faster", 
    "completely demolishes", 
    "demolishes", 
    "guaranteed 100% uptime", 
    "100% uptime", 
    "zero latency",
    "crazy fast",
    "kills it",
    "beast mode"
  ];

  // Helper to highlight flagged terms in original text
  const renderHighlightedOriginal = (text) => {
    if (!text) return <span className="text-slate-400 italic">No original text recorded.</span>;

    // Build regex to catch flagged phrases
    const regex = new RegExp(`(${flaggedTerms.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isViolation = flaggedTerms.some(t => t.toLowerCase() === part.toLowerCase());
      if (isViolation) {
        return (
          <span 
            key={i} 
            className="bg-red-200/90 text-red-900 font-bold px-1.5 py-0.5 rounded mx-0.5 line-through decoration-red-700 decoration-2"
            title="Flagged Brand Guideline Violation"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-2.5">
      {/* Controls Bar */}
      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <GitCompare className="w-3.5 h-3.5 text-emerald-600" />
          <span className="font-bold text-slate-800">{title}</span>
          {hasChanges ? (
            <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full border border-amber-200">
              Modifications Applied
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full">
              Identical to Original
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-mono font-semibold">
          <button
            type="button"
            onClick={() => setViewMode("side-by-side")}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              viewMode === "side-by-side" 
                ? "bg-white text-emerald-800 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Side-by-Side
          </button>
          <button
            type="button"
            onClick={() => setViewMode("inline")}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              viewMode === "inline" 
                ? "bg-white text-emerald-800 shadow-2xs font-bold" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Stacked View
          </button>
        </div>
      </div>

      {/* Main Diff Content Container */}
      {viewMode === "side-by-side" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Before Column */}
          <div className="space-y-1.5 p-3.5 bg-red-50/40 rounded-xl border border-red-200/80">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                <X className="w-3 h-3 text-red-600" />
                Original Draft (Pre-Audit)
              </span>
              <span className="text-[10px] font-mono text-red-600">
                {before.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="p-3 bg-white/90 rounded-lg border border-red-200 text-slate-800 leading-relaxed font-sans text-xs min-h-[90px]">
              {renderHighlightedOriginal(before)}
            </div>

            <p className="text-[10px] font-mono text-red-700/80 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              <span>Red highlights indicate unverified superlatives or off-brand terminology.</span>
            </p>
          </div>

          {/* After Column */}
          <div className="space-y-1.5 p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Creator-Revised (Brand-Aligned)
              </span>
              <span className="text-[10px] font-mono text-emerald-700">
                {after.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            <div className="p-3 bg-white/90 rounded-lg border border-emerald-200 text-slate-900 leading-relaxed font-sans font-medium text-xs min-h-[90px]">
              {after || <span className="text-slate-400 italic">No revised text.</span>}
            </div>

            <p className="text-[10px] font-mono text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Remediated with Gemini brand copilot suggestions. Grounded in Brand Book v2.1.</span>
            </p>
          </div>
        </div>
      ) : (
        /* Stacked Inline View */
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-1">
            <span className="font-mono text-[10px] font-bold text-red-700 uppercase tracking-wider block">
              1. Original Submission (Pre-Audit)
            </span>
            <div className="text-slate-800 text-xs leading-relaxed">
              {renderHighlightedOriginal(before)}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-300 space-y-1">
            <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
              2. Revised Copy (Brand-Aligned For Publication)
            </span>
            <div className="text-slate-900 text-xs leading-relaxed font-medium">
              {after}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
