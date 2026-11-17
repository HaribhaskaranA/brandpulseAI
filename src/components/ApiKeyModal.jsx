import React, { useState, useEffect } from "react";
import { Key, Check, X, Sparkles, ShieldCheck, RefreshCw } from "lucide-react";

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [backupKey, setBackupKey] = useState("");
  const [preferredModel, setPreferredModel] = useState("gemini-3.8-flash");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPrimary = localStorage.getItem("brandpulse_gemini_key") || "";
      const storedBackup = localStorage.getItem("brandpulse_gemini_backup_key") || "";
      const storedModel = localStorage.getItem("brandpulse_preferred_model") || "gemini-3.8-flash";
      setApiKey(storedPrimary);
      setBackupKey(storedBackup);
      setPreferredModel(storedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== "undefined") {
      if (apiKey.trim()) {
        localStorage.setItem("brandpulse_gemini_key", apiKey.trim());
      } else {
        localStorage.removeItem("brandpulse_gemini_key");
      }

      if (backupKey.trim()) {
        localStorage.setItem("brandpulse_gemini_backup_key", backupKey.trim());
      } else {
        localStorage.removeItem("brandpulse_gemini_backup_key");
      }

      if (preferredModel) {
        localStorage.setItem("brandpulse_preferred_model", preferredModel);
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }
  };

  const handleClear = () => {
    setApiKey("");
    setBackupKey("");
    setPreferredModel("gemini-3.8-flash");
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandpulse_gemini_key");
      localStorage.removeItem("brandpulse_gemini_backup_key");
      localStorage.setItem("brandpulse_preferred_model", "gemini-3.8-flash");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Google Gemini Dual-Key Configuration</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          BrandPulse AI features <strong>automatic dual-key failover</strong>. If the primary key is rate-limited or unavailable, the system automatically routes requests through your backup key, with seamless offline local rule engine fallback.
        </p>

        {/* Primary API Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Primary Gemini API Key</span>
            <span className="text-[10px] font-mono text-emerald-700">Default Route</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter primary Gemini API key..."
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Backup API Key */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Backup / Failover Gemini API Key</span>
            <span className="text-[10px] font-mono text-amber-700">Auto Failover</span>
          </label>
          <input
            type="password"
            value={backupKey}
            onChange={(e) => setBackupKey(e.target.value)}
            placeholder="Enter backup failover API key..."
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        {/* Target Gemini Model Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Target Gemini AI Model</span>
            <span className="text-[10px] font-mono text-emerald-700">Audit Engine</span>
          </label>
          <select
            value={preferredModel}
            onChange={(e) => setPreferredModel(e.target.value)}
            className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white cursor-pointer"
          >
            <option value="gemini-3.8-flash">Google Gemini 3.8 Flash (Cutting-Edge Multimodal)</option>
            <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (High-Speed Audit Engine)</option>
            <option value="gemini-3.7-flash">Google Gemini 3.7 Flash (Balanced Reasoning)</option>
            <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Enterprise Production)</option>
            <option value="gemini-flash-latest">Google Gemini Flash Latest (Auto-Track Flagship)</option>
          </select>
          <p className="text-[10px] text-slate-400">
            Selected model will be called first for multimodal tone, terminology, and fact verification.
          </p>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Security & Privacy:</strong> Keys are kept in local `.env` and browser memory, excluded from Git via `.gitignore`. If both keys are exhausted, the app seamlessly falls back to local grounded rules.
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-red-600 font-medium"
          >
            Clear Overrides
          </button>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save Keys</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
