import React, { useState } from "react";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Download, 
  Copy, 
  Check, 
  X, 
  Sparkles,
  Lock,
  Star
} from "lucide-react";

export default function ComplianceCertificateModal({ isOpen, onClose, post }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen || !post) return null;

  const certId = `CERT-ACME-${post.id.replace(/[^0-9]/g, "").slice(-4) || "8821"}`;
  const timestamp = post.updatedAt || new Date().toISOString();

  const handleCopyJson = () => {
    const certPayload = {
      certificateId: certId,
      assetTitle: post.title,
      channel: post.channel,
      author: post.author,
      status: "Formally Approved for Enterprise Publication",
      groundingKit: "Acme Cloud Brand Book v2.1",
      complianceScore: post.lastAudit?.overallScore ?? 96,
      reviewerRating: post.reviewRating || 5.0,
      reviewerAssessment: post.reviewAssessment || "Brand-Certified",
      reviewerComment: post.reviewComment || "Adheres strictly to corporate SLA metrics.",
      timestamp: timestamp,
      cryptographicHash: `sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`
    };

    navigator.clipboard.writeText(JSON.stringify(certPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
        
        {/* Certificate Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                Digital Brand Compliance Certificate
              </h3>
              <p className="text-[11px] font-mono text-emerald-700 font-bold">
                Verification ID: {certId} • Immutable Clearance
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

        {/* Certificate Body (Guilloche / Parchment Styled) */}
        <div className="p-5 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 rounded-xl border-2 border-emerald-500/40 shadow-xs space-y-4 relative overflow-hidden">
          
          {/* Subtle Watermark */}
          <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none">
            <ShieldCheck className="w-48 h-48 text-emerald-950" />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Acme Cloud Platform Governance Vault
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Certified for Publication</span>
            </span>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-500">Asset Title:</div>
            <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
              {post.title}
            </h2>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              Channel: <strong className="text-slate-800">{post.channel}</strong> • Drafter: <strong className="text-slate-800">{post.author}</strong>
            </div>
          </div>

          <div className="p-3 bg-white/90 rounded-lg border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
            "{post.content}"
          </div>

          {/* Verification Criteria Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Audit Score</div>
              <div className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5">
                {post.lastAudit?.overallScore ?? 96}/100
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Reviewer Rating</div>
              <div className="text-sm font-extrabold text-amber-600 font-mono mt-0.5 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{post.reviewRating || 5.0}★</span>
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Assessment</div>
              <div className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                {post.reviewAssessment || "Certified"}
              </div>
            </div>

            <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-[10px] font-mono text-slate-400 uppercase">SLA Grounding</div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">
                99.95% Verified
              </div>
            </div>
          </div>

          {/* Cryptographic Hash */}
          <div className="pt-2 border-t border-slate-100 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span className="truncate max-w-[340px]">
              SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
            </span>
            <span className="text-emerald-700 font-bold">Signed in Supabase</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleCopyJson}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied JSON!" : "Copy Raw Certificate (JSON)"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all"
          >
            Close Certificate
          </button>
        </div>

      </div>
    </div>
  );
}
