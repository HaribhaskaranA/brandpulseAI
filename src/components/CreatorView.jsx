import React, { useState } from "react";
import { 
  Sparkles, 
  Send, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Info,
  Check,
  AlertCircle
} from "lucide-react";
import ReportCard from "./ReportCard";

export default function CreatorView({ 
  draft, 
  onUpdateDraft, 
  onRunAudit, 
  onSubmitToLeader, 
  isAuditing, 
  onApplyFix 
}) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const channels = ["Social Post", "Ad Copy", "Email Campaign", "Document Draft"];

  const handleTitleChange = (e) => {
    onUpdateDraft({ ...draft, title: e.target.value });
  };

  const handleChannelChange = (ch) => {
    onUpdateDraft({ ...draft, channel: ch });
  };

  const handleContentChange = (e) => {
    onUpdateDraft({ ...draft, content: e.target.value });
  };

  const toggleImageContrast = () => {
    onUpdateDraft({
      ...draft,
      hasImageContrastIssue: !draft.hasImageContrastIssue
    });
  };

  const toggleHasImage = () => {
    onUpdateDraft({
      ...draft,
      hasImage: !draft.hasImage
    });
  };

  const wordCount = (draft.content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (draft.content || "").length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* Left Panel: Draft Editor & Multi-Format Input (7 cols) */}
      <div className="lg:col-span-6 space-y-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
          
          {/* Header & Status Indicator */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Creative Web Studio</h2>
              <p className="text-xs text-slate-500">Draft copy, upload marketing banners, and run pre-flight audits.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-xs font-mono font-bold rounded-full ${
                draft.status === "Approved" 
                  ? "bg-emerald-100 text-emerald-800" 
                  : draft.status === "Needs Review" 
                    ? "bg-amber-100 text-amber-800" 
                    : "bg-slate-100 text-slate-700"
              }`}>
                ● {draft.status}
              </span>
            </div>
          </div>

          {/* Draft Title Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Campaign Title</label>
            <input
              type="text"
              value={draft.title || ""}
              onChange={handleTitleChange}
              placeholder="e.g. Q4 Enterprise Launch Social Campaign"
              className="w-full px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {/* Channel Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Publishing Channel</label>
            <div className="flex flex-wrap gap-2">
              {channels.map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleChannelChange(ch)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    draft.channel === ch
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Copy Editor */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="font-bold text-slate-700">Draft Content (Copy / Proposal)</label>
              <span className="font-mono text-[11px]">{wordCount} words • {charCount} chars</span>
            </div>
            <textarea
              rows={6}
              value={draft.content || ""}
              onChange={handleContentChange}
              placeholder="Type or paste marketing copy, product descriptions, or document drafts here..."
              className="w-full p-3 text-xs text-slate-900 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-y"
            ></textarea>
          </div>

          {/* Image & Banner Uploader */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Creative Banner Asset (Multimodal Vision Audit)</span>
              </label>
              <button
                type="button"
                onClick={toggleHasImage}
                className="text-[11px] font-mono text-emerald-700 hover:underline"
              >
                {draft.hasImage ? "Remove Banner" : "+ Attach Sample Banner"}
              </button>
            </div>

            {draft.hasImage ? (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-800 font-semibold">{draft.bannerName || "banner.jpg"}</span>
                    {draft.hasImageContrastIssue ? (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded">
                        WCAG Contrast: 3.1:1 (Fails AA)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 rounded">
                        WCAG Contrast: 5.8:1 (Passes AA)
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={toggleImageContrast}
                    className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                  >
                    Toggle Contrast State
                  </button>
                </div>

                <div className="relative rounded-lg overflow-hidden border border-slate-300 max-h-48 group">
                  <img
                    src={draft.bannerUrl}
                    alt="Creative Preview"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <div className="text-white text-xs space-y-0.5">
                      <div className="font-bold">Next-Gen Enterprise Cloud Engine</div>
                      <div className={`text-[11px] ${draft.hasImageContrastIssue ? "text-slate-400 font-normal" : "text-white font-semibold"}`}>
                        {draft.hasImageContrastIssue ? "Sub-optimal subtitle contrast ratio" : "High contrast verified typography"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div 
                onClick={toggleHasImage}
                className="p-4 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-slate-400"
              >
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs font-semibold text-slate-700">Click to attach sample marketing banner</span>
                <span className="text-[10px] text-slate-400">Tests Gemini Vision logo placement & WCAG text contrast math</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
            <button
              type="button"
              onClick={onRunAudit}
              disabled={isAuditing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              {isAuditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Auditing with Google Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Gemini Brand Check</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onSubmitToLeader}
              disabled={isAuditing}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Draft to Leader for Approval</span>
            </button>
          </div>

        </div>
      </div>

      {/* Right Panel: Live Gemini Brand Evaluation Report (5 cols) */}
      <div className="lg:col-span-6">
        <ReportCard
          audit={draft.lastAudit}
          onApplyFix={onApplyFix}
          isApplying={isAuditing}
        />
      </div>

    </div>
  );
}
