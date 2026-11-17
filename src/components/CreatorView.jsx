import React, { useState, useRef } from "react";
import { 
  Sparkles, 
  Save, 
  Send,
  Trash2,
  Undo2,
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Info,
  Check,
  AlertCircle,
  ShieldCheck,
  Lock,
  Plus,
  Eye,
  FileText,
  User,
  BarChart2,
  PenTool,
  FileType,
  FileSpreadsheet,
  Paperclip,
  Zap,
  X
} from "lucide-react";
import ReportCard from "./ReportCard";
import CreatorProfileCard from "./CreatorProfileCard";

export default function CreatorView({ 
  draft, 
  allPosts = [],
  profile,
  onSelectPost,
  onCreateNewPost,
  onUpdateDraft, 
  onRunAudit, 
  onSavePrivateDraft, 
  onSendToReview,
  onWithdrawReview,
  onDeletePost,
  isAuditing, 
  onApplyFix 
}) {
  const [activeSubTab, setActiveSubTab] = useState("editor"); // "editor" | "profile"
  const [showSendModal, setShowSendModal] = useState(false);
  const [targetReviewer, setTargetReviewer] = useState("both"); // "leader" | "manager" | "both"
  const [selectedAuditModel, setSelectedAuditModel] = useState(() => {
    return (typeof window !== "undefined" && localStorage.getItem("brandpulse_preferred_model")) || "gemini-3.1-flash-lite";
  });
  const fileInputRef = useRef(null);

  const handleAuditModelChange = (model) => {
    setSelectedAuditModel(model);
    if (typeof window !== "undefined") {
      localStorage.setItem("brandpulse_preferred_model", model);
    }
  };

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

  // Generic File Upload Handler supporting Images, PDFs, DOCX, TXT
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDoc = file.name.toLowerCase().endsWith(".docx") || file.name.toLowerCase().endsWith(".txt");

    const sizeFormatted = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${Math.round(file.size / 1024)} KB`;

    if (isImage) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onUpdateDraft({
          ...draft,
          hasImage: true,
          assetType: "image",
          bannerUrl: event.target.result,
          bannerName: file.name,
          assetSize: sizeFormatted,
          hasImageContrastIssue: false
        });
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or Document
      const estimatedPages = Math.max(1, Math.min(18, Math.round(file.size / 75000)));
      onUpdateDraft({
        ...draft,
        hasImage: false,
        assetType: isPdf ? "pdf" : "document",
        bannerName: file.name,
        assetSize: sizeFormatted,
        pageCount: estimatedPages,
        bannerUrl: ""
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Sample Presets for Quick Testing
  const handleAttachSampleImage = () => {
    onUpdateDraft({
      ...draft,
      hasImage: true,
      assetType: "image",
      bannerName: "acme-q4-cloud-hero.png",
      bannerUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
      assetSize: "1.8 MB",
      hasImageContrastIssue: false
    });
  };

  const handleAttachSamplePdf = () => {
    onUpdateDraft({
      ...draft,
      hasImage: false,
      assetType: "pdf",
      bannerName: "Acme_Cloud_Enterprise_Architecture_v2.pdf",
      assetSize: "2.4 MB",
      pageCount: 6,
      bannerUrl: ""
    });
  };

  const handleRemoveAsset = () => {
    onUpdateDraft({
      ...draft,
      hasImage: false,
      assetType: "none",
      bannerUrl: "",
      bannerName: "",
      assetSize: "",
      pageCount: undefined,
      hasImageContrastIssue: false
    });
  };

  const wordCount = (draft.content || "").trim().split(/\s+/).filter(Boolean).length;
  const charCount = (draft.content || "").length;

  const isPrivate = !draft.visibility || draft.visibility === "private" || draft.status === "Private Draft";
  const isInReview = draft.status === "Needs Review" && (draft.visibility === "leader_review" || draft.visibility === "manager_review" || draft.visibility === "both");

  return (
    <div className="space-y-4">
      
      {/* Sub-Tabs: Creative Studio vs Profile & Performance */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab("editor")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "editor"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool className="w-3.5 h-3.5 text-emerald-600" />
            <span>Studio Workspace & Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("profile")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "profile"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>My Profile & Performance</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </button>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-mono text-slate-500">
            Current Status: <strong className="text-slate-900">{isPrivate ? "Private Workspace" : "Active in Review"}</strong>
          </span>
        </div>
      </div>

      {/* VIEW 1: CREATOR PROFILE & PERFORMANCE */}
      {activeSubTab === "profile" && (
        <CreatorProfileCard profile={profile} />
      )}

      {/* VIEW 2: WORKSPACE & DRAFT EDITOR */}
      {activeSubTab === "editor" && (
        <div className="space-y-4">
          
          {/* Draft Selector Strip */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-bold text-slate-700 shrink-0 font-mono">My Drafts ({allPosts.length}):</span>
              {allPosts.map((p) => {
                const isSelected = p.id === draft.id;
                const pPrivate = !p.visibility || p.visibility === "private" || p.status === "Private Draft";
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelectPost && onSelectPost(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? "bg-slate-900 text-white shadow-xs font-bold"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {pPrivate ? <Lock className="w-3 h-3 text-emerald-400" /> : <Eye className="w-3 h-3 text-amber-400" />}
                    <span className="max-w-[140px] truncate">{p.title || "Untitled Draft"}</span>
                    <span className="text-[10px] opacity-75">({pPrivate ? "Private" : "In Review"})</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onCreateNewPost}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-2xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Draft</span>
            </button>
          </div>

          {/* Main Split Screen: Left (Editor) | Right (Audit Report) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT PANEL: Multi-Format Draft Editor & Asset Uploader (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                
                {/* Status Notice Pill */}
                {isPrivate ? (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Private Workspace Active:</strong> Saved only in your private country. Invisible to Leaders and Managers.</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">Isolated</span>
                  </div>
                ) : (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between text-xs text-amber-950">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        Submitted to <strong>{
                          draft.visibility === "both" 
                            ? "Both Leader & Manager (Fast-Track)" 
                            : draft.visibility === "manager_review" 
                              ? "Manager Review Desk" 
                              : "Leader Review Desk"
                        }</strong>. You can withdraw or delete it anytime.
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onWithdrawReview}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-amber-900 border border-amber-300 rounded hover:bg-amber-100 shrink-0 flex items-center gap-1"
                    >
                      <Undo2 className="w-3 h-3" />
                      <span>Withdraw Draft</span>
                    </button>
                  </div>
                )}

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

                {/* MULTI-FORMAT & MULTIMODAL ASSET UPLOADER (Pictures, PDFs, DOCX, TXT) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*, .pdf, .docx, .txt"
                    className="hidden"
                  />

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Multimodal Asset Attachment (Images, PDFs, Documents)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded flex items-center gap-1 transition-all"
                      >
                        <Upload className="w-3 h-3 text-slate-500" />
                        <span>Upload File</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleAttachSampleImage}
                        className="text-[11px] font-mono text-emerald-700 hover:underline"
                      >
                        + Sample Image
                      </button>

                      <button
                        type="button"
                        onClick={handleAttachSamplePdf}
                        className="text-[11px] font-mono text-blue-700 hover:underline"
                      >
                        + Sample PDF
                      </button>
                    </div>
                  </div>

                  {/* DISPLAY ATTACHED ASSET (Image or Document) */}
                  {(draft.hasImage || draft.assetType === "image") && draft.bannerUrl ? (
                    /* Image Asset Card */
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-emerald-600" />
                          <span className="font-mono text-xs text-slate-900 font-bold">{draft.bannerName || "banner.jpg"}</span>
                          <span className="text-[10px] font-mono text-slate-500">({draft.assetSize || "1.8 MB"})</span>
                          
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

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={toggleImageContrast}
                            className="text-[11px] font-medium text-slate-600 hover:text-slate-900 underline"
                          >
                            Toggle Contrast
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveAsset}
                            className="text-slate-400 hover:text-red-600 p-1 rounded"
                            title="Remove attached file"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                  ) : (draft.assetType === "pdf" || draft.assetType === "document" || (draft.bannerName && draft.bannerName.toLowerCase().endsWith(".pdf"))) ? (
                    /* PDF / Document Asset Card */
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs shrink-0">
                          PDF
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900">{draft.bannerName || "Uploaded_Document.pdf"}</h5>
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-100 text-blue-800 rounded">
                              {draft.pageCount || 4} Pages
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {draft.assetSize || "2.1 MB"} • Multimodal document ready for Gemini content & policy analysis
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hidden sm:inline">
                          OCR & Vectorized
                        </span>
                        <button
                          type="button"
                          onClick={handleRemoveAsset}
                          className="text-slate-400 hover:text-red-600 p-1.5 rounded"
                          title="Remove attached document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Empty Dropzone supporting any format */
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-5 border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all text-slate-400"
                    >
                      <Upload className="w-6 h-6 text-slate-400 mb-1.5" />
                      <span className="text-xs font-semibold text-slate-800">
                        Click to upload any format (Images, PDFs, Word DOCX, Plain Text)
                      </span>
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        Supports multimodal investigation: layout compliance, logo placement, WCAG contrast, and document claims
                      </span>
                    </div>
                  )}

                </div>

                {/* Action Buttons Toolbar */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  
                  {/* Model Selection Toolbar (Choose AI Model Before Running Audit) */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 fill-amber-500 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>1. Choose AI Model</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                            Fastest Recommended
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">Select model first: choose fastest for instant &lt; 2s evaluation.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={selectedAuditModel}
                        onChange={(e) => handleAuditModelChange(e.target.value)}
                        className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="gemini-3.1-flash-lite">⚡ Gemini 3.1 Flash-Lite (Fastest ~1.2s - Default)</option>
                        <option value="gemini-flash-lite-latest">⚡ Gemini Flash-Lite Latest (Turbo Mode)</option>
                        <option value="gemini-3.5-flash-lite">⚡ Gemini 3.5 Flash-Lite (Fast Efficient)</option>
                        <option value="gemini-3.8-flash">Gemini 3.8 Flash (Deep Multimodal Reasoning)</option>
                        <option value="gemini-3.6-flash">Gemini 3.6 Flash (High-Speed Audit)</option>
                        <option value="gemini-flash-latest">Gemini Flash Latest</option>
                        <option value="local-engine">⚡ Local Deterministic Engine (Instant ~15ms)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onRunAudit && onRunAudit(selectedAuditModel)}
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
                          <span>2. Run Gemini Brand Check</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={onSavePrivateDraft}
                        className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Save className="w-3.5 h-3.5 text-slate-500" />
                        <span>Save to Private Draft</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowSendModal(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Send for Review...</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                    <span>Private drafts remain strictly isolated until you click Send for Review.</span>
                    <button
                      type="button"
                      onClick={() => onDeletePost && onDeletePost(draft.id)}
                      className="text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 font-mono text-[10px]"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Post</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT PANEL: Live Gemini Brand Evaluation Report (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 sticky top-20">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-bold text-xs text-slate-900 uppercase font-mono tracking-wider">
                      Live Brand Evaluation Report
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                    Acme Cloud v2.1
                  </span>
                </div>

                {draft.lastAudit ? (
                  <ReportCard
                    audit={draft.lastAudit}
                    onApplyFix={onApplyFix}
                  />
                ) : (
                  <div className="p-8 text-center space-y-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Pre-Flight Audit Ready</h4>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Click "Run Gemini Multimodal Check" to evaluate this copy and attached assets against Acme Cloud Brand Book v2.1.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      )}

      {/* MODAL: Send for Review (Leader, Manager, or Both simultaneously) */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Submit Draft for Review</h3>
              </div>
              <button 
                onClick={() => setShowSendModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-mono text-[10px] uppercase">Post Title: </span>
              <strong className="text-slate-900">{draft.title || "Untitled Draft"}</strong>
              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1 italic">
                "{draft.content}"
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800">Select Review Destination:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetReviewer("leader")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "leader"
                      ? "border-emerald-500 bg-emerald-50/50 font-bold text-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-slate-900">Leader Only</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">Editorial desk review</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetReviewer("manager")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "manager"
                      ? "border-emerald-500 bg-emerald-50/50 font-bold text-slate-900 ring-2 ring-emerald-500/20"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-slate-900">Manager Only</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">Brand Policy approval</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetReviewer("both")}
                  className={`p-3 rounded-lg border text-left text-xs transition-all ${
                    targetReviewer === "both"
                      ? "border-emerald-600 bg-emerald-100/60 font-bold text-emerald-950 ring-2 ring-emerald-600/30"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="font-bold text-emerald-950 flex items-center gap-1">
                    <span>Both at Once</span>
                    <span className="text-[9px] bg-emerald-600 text-white px-1 rounded">Fast-Track</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-normal mt-0.5">Simultaneous sign-off</div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">Review Guarantee:</span> Once submitted, the draft becomes visible to the selected reviewers, who can approve and award quality star ratings. You can withdraw it back to private draft anytime.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowSendModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onSendToReview(targetReviewer);
                  setShowSendModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send to {
                  targetReviewer === "both" 
                    ? "Both Leader & Manager" 
                    : targetReviewer === "manager" 
                      ? "Manager" 
                      : "Leader"
                }</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
