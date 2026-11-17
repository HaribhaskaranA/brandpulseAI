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
  Zap
} from "lucide-react";

export default function CreatorProfileCard({ profile, recentRatings = [] }) {
  const ratings = recentRatings.length > 0 ? recentRatings : profile.ratingsHistory || [];

  return (
    <div className="space-y-6">
      
      {/* Top Profile Summary Card */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs">
                ✓
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900">{profile.name}</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Top 5% Compliant
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{profile.role} • {profile.department}</p>
              
              {/* Star Rating Strip */}
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-extrabold text-slate-900 font-mono">{profile.overallRating}</span>
                <span className="text-[11px] text-slate-400 font-mono">({profile.totalReviews} executive ratings from Leaders & Managers)</span>
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
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold">
              <span>Brand Alignment</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{profile.complianceRate}%</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">↑ +4.8% vs last quarter</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold">
              <span>Approval Speed</span>
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{profile.approvalSpeed}</div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">↓ 64% faster than manual</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold">
              <span>Drafts Audited</span>
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{profile.totalDraftsAudited}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">{profile.totalApproved} approved for publication</div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase font-bold">
              <span>Reputation Score</span>
              <Award className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">Tier 1</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Fast-track direct publication eligible</div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Monthly Performance Progression & Earned Badges */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Monthly Compliance Progression Infographic (7 cols) */}
        <div className="md:col-span-7 p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Monthly Compliance Progression (Quality Index)</span>
              </h3>
              <p className="text-xs text-slate-500">Historical adherence to Acme Cloud Brand Book standards over time.</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Upward Trajectory
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {profile.performanceTrend.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{item.period}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">{item.drafts} drafts</span>
                    <span className="font-mono font-bold text-slate-900">{item.score}/100</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Key Growth Driver:</strong> Utilizing Gemini's 1-click suggested rewrites reduced unverified claim rejections by <strong>88%</strong> since August.
            </p>
          </div>
        </div>

        {/* Skill Badges & Certifications (5 cols) */}
        <div className="md:col-span-5 p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Earned Brand Badges</span>
              </h3>
              <p className="text-xs text-slate-500">Milestones verified by Google Gemini audits.</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {profile.badges.map((b) => (
              <div key={b.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                  ★
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{b.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded font-semibold">
                      {b.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Leader & Manager Executive Reviews & Ratings Feed */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Manager & Leader Review Feed & Ratings</span>
            </h3>
            <p className="text-xs text-slate-500">Live feedback and performance star ratings awarded by publication reviewers.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Direct Governance Feedback</span>
        </div>

        <div className="space-y-3">
          {ratings.map((rate, idx) => (
            <div key={rate.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{rate.reviewer}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                    rate.role === "Manager" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {rate.role}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">• {rate.postTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 text-slate-800">
                    {rate.tag || "Reviewed"}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(rate.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{rate.date}</span>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-sans pl-2 border-l-2 border-emerald-500">
                "{rate.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
