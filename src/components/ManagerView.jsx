import React, { useState } from "react";
import { 
  ShieldCheck, 
  BookOpen, 
  BarChart3, 
  Plus, 
  Upload, 
  Check, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  Layers,
  Palette,
  ExternalLink
} from "lucide-react";
import ReportCard from "./ReportCard";

export default function ManagerView({ 
  brandKit, 
  onAddRule, 
  analytics 
}) {
  const [activeTab, setActiveTab] = useState("vault"); // "vault" | "insights"
  const [isAddingRule, setIsAddingRule] = useState(false);
  
  // New rule form state
  const [newCategory, setNewCategory] = useState("Tone & Voice");
  const [newTitle, setNewTitle] = useState("");
  const [newGuideline, setNewGuideline] = useState("");
  const [newCitation, setNewCitation] = useState("Brand Book v2.1 §6.1, Page 32");
  const [newBannedTerms, setNewBannedTerms] = useState("");
  const [newVerifiedFact, setNewVerifiedFact] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newGuideline.trim()) return;

    const termsArray = newBannedTerms
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);

    const ruleObj = {
      id: `rule-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      citation: newCitation.trim() || "Brand Book v2.1 §6.1",
      guidelineText: newGuideline.trim(),
      verifiedFact: newVerifiedFact.trim() || undefined,
      bannedTerms: termsArray,
      severity: newCategory === "Fact & Claim Verification" ? "error" : "warning",
      active: true
    };

    onAddRule(ruleObj);
    setIsAddingRule(false);
    setNewTitle("");
    setNewGuideline("");
    setNewBannedTerms("");
    setNewVerifiedFact("");
  };

  const handleSimulateUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadSuccess(false);
      setShowUploadModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header & Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
              Brand Governance & Compliance Authority
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Manager Brand Vault & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Guideline Source of Truth: <strong>{brandKit.name}</strong> (Approved v{brandKit.version})
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("vault")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "vault"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Brand Guidelines & Rules ({brandKit.rules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === "insights"
                ? "bg-white text-slate-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Governance Insights & Audit Feed</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: BRAND GUIDELINES & RULE VAULT
         ========================================================================= */}
      {activeTab === "vault" && (
        <div className="space-y-6">
          
          {/* Top Actions: Upload PDF Guideline + Add New Rule */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-2 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload New Brand Book (PDF / docx)</span>
              </button>

              <div className="text-xs text-slate-500 pl-2 hidden md:block">
                Synchronized with Creator pre-flight checks in real time
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingRule(!isAddingRule)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingRule ? "Cancel" : "Add & Approve Brand Rule"}</span>
            </button>
          </div>

          {/* Add Rule Form Panel */}
          {isAddingRule && (
            <form onSubmit={handleCreateRule} className="p-5 bg-white rounded-xl border border-emerald-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Define & Approve New Organizational Brand Rule</span>
                </h3>
                <span className="text-[11px] font-mono text-emerald-700">Immediate RAG Grounding</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Tone & Voice">Tone & Voice</option>
                    <option value="Fact & Claim Verification">Fact & Claim Verification</option>
                    <option value="Terminology">Terminology</option>
                    <option value="Visual Consistency">Visual Consistency</option>
                    <option value="Accessibility">Accessibility</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Rule Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Disallow Unaudited Multi-Cloud Superlatives"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Guideline Description (Injected into Gemini RAG prompt)</label>
                <textarea
                  rows={2}
                  value={newGuideline}
                  onChange={(e) => setNewGuideline(e.target.value)}
                  placeholder="Explain exactly what is permitted or forbidden and why..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Banned Terms (comma-separated)</label>
                  <input
                    type="text"
                    value={newBannedTerms}
                    onChange={(e) => setNewBannedTerms(e.target.value)}
                    placeholder="e.g. unbeatable, 100% bug-free"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Verified Fact (Ground Truth)</label>
                  <input
                    type="text"
                    value={newVerifiedFact}
                    onChange={(e) => setNewVerifiedFact(e.target.value)}
                    placeholder="e.g. Audited 99.95% uptime across 42 regions"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Guideline Citation</label>
                  <input
                    type="text"
                    value={newCitation}
                    onChange={(e) => setNewCitation(e.target.value)}
                    placeholder="e.g. Brand Book v2.1 §6.1, Page 32"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save & Activate Rule</span>
                </button>
              </div>
            </form>
          )}

          {/* Approved Brand Hex Palette Card */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Approved Brand Color Palette (Acme Cloud v2.1)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Enforced via Gemini Vision</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {brandKit.approvedColors.map((col, idx) => (
                <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded-md border border-slate-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: col.hex }}
                  ></div>
                  <div className="overflow-hidden">
                    <div className="text-[11px] font-bold text-slate-900 truncate">{col.name}</div>
                    <div className="text-[10px] font-mono text-slate-500">{col.hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Rules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
              <span>Active Governance Rules ({brandKit.rules.length})</span>
              <span>All rules strictly enforced across Creators & Leaders</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandKit.rules.map((rule) => (
                <div key={rule.id} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 text-slate-700">
                        {rule.category}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Approved & Active</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1">{rule.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                      {rule.guidelineText}
                    </p>

                    {rule.bannedTerms && rule.bannedTerms.length > 0 && (
                      <div className="mt-2 text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700">Banned Terms: </span>
                        {rule.bannedTerms.map((t, idx) => (
                          <span key={idx} className="inline-block bg-red-50 text-red-700 font-mono px-1 rounded mr-1 mb-1">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{rule.citation}</span>
                    <span className="text-emerald-700 font-semibold">Strict RAG Grounded</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: GOVERNANCE INSIGHTS & AUDIT FEED
         ========================================================================= */}
      {activeTab === "insights" && (
        <div className="space-y-6">
          
          {/* Top Analytics 4-Card Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Total Audits</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.stats.totalAuditsCount}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Across {analytics.stats.activeTeamCreators} creators</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Turnaround Time</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1">{analytics.stats.averageTurnaroundHours}h</div>
              <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">↓ {analytics.stats.turnaroundReductionPercent}% vs manual</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Leaks Prevented</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1">{analytics.stats.offBrandLeaksPrevented}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Caught pre-publication</div>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[11px] font-mono text-slate-500 uppercase font-bold">Explainability</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">100%</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Every flag cited to page</div>
            </div>
          </div>

          {/* Recurring Violations Heatmap / Breakdown */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Recurring Violations Breakdown (Spotting Ambiguous Rules)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identifies which guidelines creators fail most often so Managers can update rules proactively.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Past 30 Days</span>
            </div>

            <div className="space-y-3">
              {analytics.recurringViolations.map((violation, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{violation.rule}</span>
                    <span className="font-mono text-slate-600 font-bold">{violation.percentage}% of drafts ({violation.count} flags)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${violation.severity === "error" ? "bg-red-500" : "bg-amber-500"}`}
                      style={{ width: `${violation.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <span><strong>Manager Action Alert:</strong> 42% of drafts trigger "Unsupported Superlatives". Recommended: Push a simplified 1-page Fact Sheet update to all marketing teams.</span>
              <span className="font-mono text-emerald-700 font-bold text-[10px] shrink-0 pl-2">Rule Health: Good</span>
            </div>
          </div>

          {/* Enterprise Content Privacy Guarantee Card */}
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Zero-Knowledge Content Privacy Architecture</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 font-bold">
                POLICY GUARANTEE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Under BrandPulse AI enterprise governance principles, <strong>Managers cannot view or inspect individual content drafts created by creators</strong>. 
              Managers govern brand rules, manage verified facts in the Brand Vault, and inspect high-level telemetry. 
              Individual drafts remain strictly private to creators to maintain creative autonomy and internal confidentiality.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Zero Surveillance</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Creator drafts and pre-flight tests are never accessible or visible in the Manager console.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Aggregated Telemetry</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Managers observe rule performance percentages, not creator identities or draft content.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Policy-First Governance</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Managers update Brand Vault guidelines which Google Gemini enforces across all creators.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Upload Brand Book PDF Simulation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Upload & Vectorize Brand Guidelines</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Drop an updated company Brand Book (.pdf or .docx). The ingestion pipeline extracts section headers, terminology rules, and color palettes for Gemini RAG indexing.
            </p>

            <div 
              onClick={handleSimulateUpload}
              className="p-8 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all text-slate-500"
            >
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-800">
                {uploadSuccess ? "✓ Document Parsed & Vectorized!" : "Click to select Acme_Brand_Book_v2.2.pdf"}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">Simulates Supabase Storage & pgvector chunking</span>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
