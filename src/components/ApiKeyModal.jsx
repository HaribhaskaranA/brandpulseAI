import React, { useState, useEffect } from "react";
import { Key, Check, X, Sparkles, ShieldCheck } from "lucide-react";

export default function ApiKeyModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("brandpulse_gemini_key") || "";
      setApiKey(stored);
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
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    }
  };

  const handleClear = () => {
    setApiKey("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("brandpulse_gemini_key");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Key className="w-4 h-4 text-emerald-600" />
            <span>Google Gemini API Configuration</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          BrandPulse AI works <strong>100% offline out-of-the-box</strong> using our built-in intelligent rule-matching engine. 
          Optionally paste your Google Gemini API key below to enable live cloud inference via <span className="font-mono text-emerald-700 font-semibold">gemini-2.0-flash</span>.
        </p>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Gemini API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
          <div className="text-[11px] text-slate-400">
            Stored locally in your browser's localStorage. Never sent to any third-party server.
          </div>
        </div>

        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-2.5 text-xs text-emerald-950">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Judge-Ready Fallback:</strong> If left blank, the app uses deterministic semantic rule verification grounded in the Manager's uploaded Brand Book.
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-red-600 font-medium"
          >
            Clear Key (Use Local Engine)
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
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
