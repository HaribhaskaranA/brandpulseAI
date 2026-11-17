import React from "react";
import { 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  ShieldCheck, 
  Key, 
  FileEdit, 
  SlidersHorizontal 
} from "lucide-react";

export const ROLES = [
  { id: "creator", label: "Content Creator", persona: "Alex Chen", badge: "Author & Drafter" },
  { id: "leader", label: "Leader", persona: "Sarah Jenkins", badge: "Team Reviewer" },
  { id: "manager", label: "Manager", persona: "Marcus Vance", badge: "Governance Authority" }
];

export default function Header({ currentRole, onRoleChange, onResetDemo, onOpenApiModal }) {
  const activeRoleObj = ROLES.find(r => r.id === currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Mandatory AI Disclosure Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white font-extrabold text-sm shadow-xs relative">
              BP
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                BrandPulse<span className="text-emerald-600">AI</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                Pre-Publication Brand Governance
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Powered by <strong>Google Gemini AI</strong></span>
          </div>
        </div>

        {/* 1-Click Role Switcher Segmented Control */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
          {ROLES.map((role) => {
            const isActive = currentRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => onRoleChange(role.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {role.id === "creator" && <FileEdit className="w-3.5 h-3.5" />}
                {role.id === "leader" && <UserCheck className="w-3.5 h-3.5" />}
                {role.id === "manager" && <ShieldCheck className="w-3.5 h-3.5" />}
                <span>{role.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Persona Pill & Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {activeRoleObj.persona}
            </span>
            <span className="text-[10px] font-medium text-emerald-700 font-mono leading-tight">
              {activeRoleObj.badge}
            </span>
          </div>

          {/* Engine / API Key Modal Button */}
          <button
            onClick={onOpenApiModal}
            title="Configure Gemini API Key"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Key className="w-4 h-4" />
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            title="Reset to default Acme Cloud Brand Book sample data"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
}
