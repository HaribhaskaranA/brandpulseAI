import React from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ArrowRight, 
  BookOpen, 
  Check, 
  Layers,
  ShieldCheck,
  TrendingUp,
  FileCheck2
} from "lucide-react";

export default function ReportCard({ audit, onApplyFix, isApplying }) {
  if (!audit) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-slate-200 text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-slate-400">
          <Sparkles className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-bold text-slate-700">No Pre-Flight Audit Run Yet</h4>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Click <strong>"Run Gemini Brand Check"</strong> to evaluate tone, terminology, verified claims, and visual contrast against Acme Cloud Brand Book v2.1.
        </p>
      </div>
    );
  }

  const { overallScore, summary, categories = [], positives = [], negatives = [], mode, modelName } = audit;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-700 bg-amber-50 border-amber-200";
    return "text-red-700 bg-red-50 border-red-200";
  };

  const getBarColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  const getStatusBadge = (status, score) => {
    if (status === "good" || score >= 80) {
      return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-100 text-emerald-800">Good</span>;
    }
    if (status === "warning" || score >= 60) {
      return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 text-amber-800">Needs Fix</span>;
    }
    return <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-red-100 text-red-800">Flagged</span>;
  };

  return (
    <div className="space-y-4">
      {/* AI Disclosure Banner (Mandatory AI Transparency) */}
      <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium text-slate-200">
            Evaluated by <strong className="text-white">{modelName || "Google Gemini Multimodal AI"}</strong> against <strong className="text-emerald-400">Acme Cloud Brand Book v2.1</strong>
          </span>
        </div>
        <span className="hidden sm:inline-block px-2 py-0.5 bg-slate-800 text-[10px] font-mono rounded text-slate-300 border border-slate-700">
          Strict RAG Grounding
        </span>
      </div>

      {/* Overall Readiness Score & Visual Progress Grid */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Brand Readiness Index
            </span>
            <div className="text-base font-extrabold text-slate-900 mt-0.5">
              Overall Compliance Health
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border text-base font-mono font-extrabold flex items-center gap-2 ${getScoreColor(overallScore)}`}>
            <span>{overallScore}</span>
            <span className="text-[11px] font-sans font-medium">/ 100</span>
          </div>
        </div>

        {/* 5-Category Horizontal Bar Charts */}
        <div className="space-y-2.5">
          {categories.map((cat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{cat.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-500 font-semibold">{cat.score}%</span>
                  {getStatusBadge(cat.status, cat.score)}
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(cat.score)}`}
                  style={{ width: `${Math.max(5, cat.score)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Part 1: Overall Compliance Guide */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-900 uppercase">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Part 1: Overall Compliance Guide</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed pt-1">
          {summary}
        </p>
      </div>

      {/* Part 2: Positives (Strengths) */}
      {positives && positives.length > 0 && (
        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-emerald-900 uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Part 2: Positives (Brand Strengths)</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-700">
            {positives.map((pos, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                <span className="leading-relaxed">{pos}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Part 3: Negatives & Explainable Fixes */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-xs font-bold font-mono text-slate-900 uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Part 3: Negatives & Explainable Fixes ({negatives.length})</span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Human-in-the-Loop Override
          </span>
        </div>

        {negatives.length === 0 ? (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>No brand violations detected! All copy, claims, and visuals meet approved brand guidelines.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {negatives.map((neg) => {
              const isError = neg.severity === "error";
              return (
                <div 
                  key={neg.id} 
                  className={`p-3.5 rounded-lg border text-xs space-y-2 transition-all ${
                    isError 
                      ? "bg-red-50/40 border-red-200" 
                      : "bg-amber-50/40 border-amber-200"
                  }`}
                >
                  {/* Category & Exact Citation Tag */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      isError ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {neg.category} • {isError ? "VIOLATION" : "ADVISORY"}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span>{neg.citation}</span>
                    </span>
                  </div>

                  {/* Flagged Element */}
                  <div className="text-slate-800 font-medium">
                    <span className="text-slate-500 font-normal">Flagged: </span>
                    <span className="line-through text-red-600 font-semibold bg-red-100/60 px-1 py-0.5 rounded font-mono text-[11px]">
                      "{neg.flaggedText}"
                    </span>
                  </div>

                  {/* Why Flagged */}
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    <strong>Why:</strong> {neg.reason}
                  </p>

                  {/* Suggested Rewrite with 1-Click Apply */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-3 flex-wrap">
                    <div className="text-emerald-800 text-[11px] font-medium flex-1">
                      <span className="text-slate-500 font-normal">Suggested Fix: </span>
                      <strong className="text-emerald-700 bg-emerald-100/60 px-1 py-0.5 rounded">
                        "{neg.suggestedRewrite}"
                      </strong>
                    </div>

                    {onApplyFix && (
                      <button
                        type="button"
                        onClick={() => onApplyFix(neg)}
                        disabled={isApplying}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-md shadow-xs flex items-center gap-1 active:scale-95 transition-all shrink-0 cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>1-Click Apply Fix</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
