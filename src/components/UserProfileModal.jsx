import React from "react";
import { 
  UserCheck, 
  ShieldCheck, 
  User, 
  Award, 
  Star, 
  Clock, 
  CheckCircle2, 
  FileCheck2, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Database,
  X
} from "lucide-react";
import CreatorProfileCard from "./CreatorProfileCard";
import { INITIAL_CREATOR_PROFILE, INITIAL_LEADER_PROFILE, INITIAL_MANAGER_PROFILE } from "../data/initialData";

export default function UserProfileModal({ 
  isOpen, 
  onClose, 
  currentRole = "creator", 
  creatorProfile, 
  leaderProfile, 
  managerProfile 
}) {
  if (!isOpen) return null;

  const safeCreator = creatorProfile || INITIAL_CREATOR_PROFILE;
  
  const safeLeader = {
    ...INITIAL_LEADER_PROFILE,
    ...(leaderProfile || {}),
    badges: (leaderProfile?.badges && leaderProfile.badges.length > 0) 
      ? leaderProfile.badges 
      : INITIAL_LEADER_PROFILE.badges,
    recentReviews: (leaderProfile?.recentReviews && leaderProfile.recentReviews.length > 0) 
      ? leaderProfile.recentReviews 
      : INITIAL_LEADER_PROFILE.recentReviews
  };

  const safeManager = {
    ...INITIAL_MANAGER_PROFILE,
    ...(managerProfile || {}),
    badges: (managerProfile?.badges && managerProfile.badges.length > 0) 
      ? managerProfile.badges 
      : INITIAL_MANAGER_PROFILE.badges,
    governanceChangelog: (managerProfile?.governanceChangelog && managerProfile.governanceChangelog.length > 0) 
      ? managerProfile.governanceChangelog 
      : INITIAL_MANAGER_PROFILE.governanceChangelog
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {currentRole === "creator" ? "CS" : currentRole === "leader" ? "EL" : "BM"}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {currentRole === "creator" && "Content Creator Studio Profile"}
                {currentRole === "leader" && "Editorial Review Leader Profile"}
                {currentRole === "manager" && "Brand Governance Authority Profile"}
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">
                Enterprise BrandPulse ID: {currentRole === "creator" ? "USR-CRT-408" : currentRole === "leader" ? "USR-REV-104" : "USR-MGR-002"}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE VIEW BODY */}
        {currentRole === "creator" && (
          <CreatorProfileCard profile={creatorProfile} />
        )}

        {currentRole === "leader" && (
          <div className="space-y-6">
            
            {/* Top Summary Card */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
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
                      <h2 className="text-lg font-extrabold text-slate-900">{leaderProfile.name}</h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        Level 2 Sign-Off
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {leaderProfile.role} • {leaderProfile.department}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span>Approval Rate: <strong className="text-slate-900 font-mono">{leaderProfile.approvalRate}%</strong></span>
                      <span>•</span>
                      <span>Avg Rating Awarded: <strong className="text-amber-600 font-mono">{leaderProfile.qualityRatingGiven} ★</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-700">Editorial Desk Gate</div>
                  <div className="text-[10px] text-slate-400">Pre-Publication Clearance Authority</div>
                </div>
              </div>

              {/* 4 Metric Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reviews Completed</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    {leaderProfile.reviewsCompleted}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Across social, docs & ads</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Turnaround Speed</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
                    {leaderProfile.averageTurnaround}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Top 10% in company</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Clearance Status</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    Active
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Full editorial publishing rights</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Editorial Tier</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    Senior Lead
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Dual-sign off authorized</div>
                </div>
              </div>
            </div>

            {/* Badges & Recent Reviews Awarded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reviewer Governance Badges</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Verified</span>
                </div>

                <div className="space-y-3">
                  {leaderProfile.badges.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{b.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white rounded border border-slate-200 font-bold text-purple-700">
                          {b.level}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Reviews Awarded</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Activity Log</span>
                </div>

                <div className="space-y-3">
                  {leaderProfile.recentReviewsAwarded.map((rev) => (
                    <div key={rev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[180px]">{rev.postTitle}</span>
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
        )}

        {currentRole === "manager" && (
          <div className="space-y-6">
            
            {/* Top Summary Card */}
            <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
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
                      <h2 className="text-lg font-extrabold text-slate-900">{safeManager.name}</h2>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold font-mono rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Level 3 Authority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      {safeManager.role} • {safeManager.department}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span>Authority: <strong className="text-slate-900">{safeManager.authorityLevel}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-emerald-700">Brand Vault Authority</div>
                  <div className="text-[10px] text-slate-400">RAG Vector Grounding Owner</div>
                </div>
              </div>

              {/* 4 Metric Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Brand Books Active</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    {safeManager.activeBrandKits} (v2.1)
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Acme Cloud Enterprise</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rules Enforced</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    {safeManager.rulesAuthored} Active
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Strict Gemini RAG Grounded</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    <span>System Brand Health</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
                    {safeManager.systemHealthScore}/100
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">↑ +13% past 30 days</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>Leaks Prevented</span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                    {safeManager.offBrandLeaksPrevented}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Pre-publication intercepts</div>
                </div>
              </div>
            </div>

            {/* Badges & Governance Changelog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Governance Authority Badges</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Executive</span>
                </div>

                <div className="space-y-3">
                  {safeManager.badges.map((b) => (
                    <div key={b.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
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

              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Policy Changelog & Audit Trail</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Immutable</span>
                </div>

                <div className="space-y-3">
                  {safeManager.governanceChangelog.map((entry, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
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
        )}

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}
