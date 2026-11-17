import React from "react";
import { 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  ShieldCheck, 
  Key, 
  FileEdit, 
  Database,
  CheckCircle2
} from "lucide-react";
import BrandLogo from "./BrandLogo";

export const ROLES = [
  { id: "creator", label: "Content Creator", persona: "Creator Studio", badge: "Private Workspace" },
  { id: "leader", label: "Editorial Leader", persona: "Review Desk", badge: "Publication Gate" },
  { id: "manager", label: "Brand Manager", persona: "Governance Vault", badge: "Policy Authority" }
];

export default function Header({ currentRole, onRoleChange, onResetDemo, onOpenApiModal }) {
  const activeRoleObj = ROLES.find(r => r.id === currentRole) || ROLES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="shrink-0">
          <BrandLogo size="md" showTagline={true} />
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

        {/* Right Persona Badge & Demo Utilities */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {activeRoleObj.persona}
            </span>
            <span className="text-[10px] font-medium text-emerald-700 font-mono leading-tight">
              {activeRoleObj.badge}
            </span>
          </div>

          {/* Engine API Key Modal Button */}
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
            title="Reset to Initial Acme Cloud v2.1 State"
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>

      </div>
    </header>
  );
}
