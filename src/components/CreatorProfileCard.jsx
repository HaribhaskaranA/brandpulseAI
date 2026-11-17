import React from "react";
import { 
  Award, 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileCheck2, 
  UserCheck, 
  Sparkles,
  Zap,
  User
} from "lucide-react";

export default function CreatorProfileCard({ profile, recentRatings = [] }) {
  const safeProfile = profile || {};
  const ratings = recentRatings.length > 0 ? recentRatings : safeProfile.ratingsHistory || [];

  return (
    <div className="space-y-6">
      
      {/* Top Profile Summary Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            
            {/* Clean Monogram Avatar Badge (No stock face photo) */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center font-bold text-xl border-2 border-emerald-500 shadow-xs select-none">
                <span className="bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                  CS
                </span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs" title="Enterprise Verified Creator">
                ✓
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">{safeProfile.name || "Creative Strategist & Copy Lead"}</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Top 5% Compliant
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {safeProfile.role || "Senior Copywriter"} • {safeProfile.department || "Enterprise Brand Marketing"}
              </p>
              
              {/* Star Rating Strip */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-900 font-mono">{safeProfile.overallRating || 4.9}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  ({safeProfile.totalReviews || ratings.length || 24} executive ratings from Leaders & Managers)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-emerald-700">Enterprise Verified</div>
              <div className="text-[10px] text-slate-400">Continuous Gemini RAG Audited</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* 4 Performance Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Brand Alignment</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {safeProfile.complianceRate || 95.2}%
            </div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">↑ 4.2% higher than dept average</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approval Speed</span>
            </div>
            <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
              {safeProfile.approvalSpeed || "1.4h avg"}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">↓ 68% faster review cycle</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Drafts Audited</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
              {safeProfile.totalDraftsAudited || 48}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">{safeProfile.totalApproved || 44} certified for publication</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Reputation Tier</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">Platinum</div>
            <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Fast-track dual review unlocked</div>
          </div>
        </div>
      </div>

      {/* Middle Row: Monthly Compliance Score Progression + Earned Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Monthly Score Progression Bar Chart */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Monthly Brand Alignment Progression</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Past 4 Months</span>
          </div>

          <div className="space-y-3 pt-1">
            {(safeProfile.performanceTrend || [
              { period: "Aug", score: 82, drafts: 7 },
              { period: "Sep", score: 87, drafts: 12 },
              { period: "Oct", score: 92, drafts: 16 },
              { period: "Nov", score: 96, drafts: 19 }
            ]).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.period} 2026</span>
                  <span className="font-mono font-bold text-slate-900">{item.score}% ({item.drafts} drafts audited)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <span><strong>Progression:</strong> +14% score improvement since onboarding Gemini pre-flight checks.</span>
            <span className="font-mono text-emerald-700 font-bold text-[10px] shrink-0 pl-2">Top Performer</span>
          </div>
        </div>

        {/* Earned Governance Badges */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Earned Brand Governance Badges</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Audited by Gemini</span>
          </div>

          <div className="space-y-3">
            {(safeProfile.badges || [
              { id: "b1", title: "Brand Voice Guardian", level: "Gold", description: "Top 5% tone consistency across all social and doc channels" },
              { id: "b2", title: "WCAG Contrast Certified", level: "Platinum", description: "100% compliant text-over-image contrast ratios" },
              { id: "b3", title: "Fact-Check Champion", level: "Silver", description: "Zero unverified superlatives in Q3 & Q4 publications" }
            ]).map((badge) => (
              <div key={badge.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  badge.level === "Platinum" ? "bg-purple-100 text-purple-800 border border-purple-200" :
                  badge.level === "Gold" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                  "bg-slate-200 text-slate-800 border border-slate-300"
                }`}>
                  {badge.level[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                      {badge.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Reviewer Ratings & Executive Evaluations Feed */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Leader & Manager Evaluation Feed</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanent reviews and quality ratings left by Editorial Leaders and Brand Policy Managers.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            Live Synced
          </span>
        </div>

        <div className="space-y-3">
          {ratings.map((rate) => (
            <div key={rate.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(rate.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{rate.tag || "Brand-Certified"}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-medium">By {rate.reviewer} ({rate.role})</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{rate.date}</span>
              </div>

              <div className="text-xs font-semibold text-slate-900">
                Asset: <span className="font-mono text-emerald-700">"{rate.postTitle}"</span>
              </div>

              <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200">
                "{rate.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
