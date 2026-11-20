import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, Palette } from "lucide-react";
import { runFullImageAudit } from "../utils/imageAudit";

/**
 * ImageAuditOverlay
 * Renders an aspect-ratio locked visual overlay with percentage bounding boxes
 * anchored to the rendered creative bounds so boxes never drift across viewports.
 * 
 * Props:
 *   imageUrl         — URL of the creative banner
 *   imageAuditResult — Pre-calculated audit result (or null to compute automatically)
 *   show             — Whether overlay boxes are visible
 *   onToggle         — Toggle overlay visibility
 *   hasContrastIssue — Optional manual flag for sample violation banner
 */
export default function ImageAuditOverlay({ 
  imageUrl, 
  imageAuditResult, 
  show, 
  onToggle,
  hasContrastIssue = false 
}) {
  const [localResult, setLocalResult] = useState(imageAuditResult || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const imgRef = useRef(null);

  // Sync external result into local state
  useEffect(() => {
    if (imageAuditResult) {
      setLocalResult(imageAuditResult);
    }
  }, [imageAuditResult]);

  // Run audit if result missing or when imageUrl / contrast flag changes
  useEffect(() => {
    if (!imageUrl) return;

    let isMounted = true;
    setAnalyzing(true);

    runFullImageAudit(imageUrl, hasContrastIssue)
      .then((res) => {
        if (isMounted) {
          setLocalResult(res);
          setAnalyzing(false);
        }
      })
      .catch((err) => {
        console.warn("[ImageAuditOverlay] Analysis error:", err);
        if (isMounted) {
          setAnalyzing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [imageUrl, hasContrastIssue]);

  if (!imageUrl) return null;

  // Extract percentage bounding boxes directly from audit result
  const boxes = localResult?.boundingBoxes || [];
  const failingWcagCount = localResult?.failingRegions?.length || 0;
  const offBrandCount = localResult?.offBrandColors?.length || 0;
  const isOverallPass = localResult?.overallPass ?? (failingWcagCount === 0 && offBrandCount === 0);

  return (
    <div className="space-y-2 select-none">
      {/* Aspect-Ratio Locked Container: anchors percentage coordinates accurately */}
      <div className="relative w-full aspect-[16/6] min-h-[140px] max-h-[260px] rounded-xl overflow-hidden border border-slate-300 bg-slate-950 shadow-inner">
        {/* Rendered Creative Image */}
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Audited Visual Creative"
          crossOrigin="anonymous"
          className="w-full h-full object-cover block"
        />

        {/* Bounding Box Overlays (Percentage-Anchored) */}
        {show && boxes.map((box, idx) => {
          const isContrastFail = box.type === "contrast";
          const isOffBrand = box.type === "offbrand";
          const isHovered = activeTooltip === box.id;

          const borderColor = isContrastFail 
            ? "border-red-500 bg-red-500/25 shadow-[0_0_12px_rgba(239,68,68,0.4)]" 
            : isOffBrand 
              ? "border-amber-400 bg-amber-400/25 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
              : "border-emerald-400 bg-emerald-500/15";

          const badgeBg = isContrastFail 
            ? "bg-red-600 text-white" 
            : isOffBrand 
              ? "bg-amber-500 text-slate-950 font-black" 
              : "bg-emerald-600 text-white";

          return (
            <div
              key={box.id || idx}
              onClick={() => setActiveTooltip(isHovered ? null : box.id)}
              onMouseEnter={() => setActiveTooltip(box.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              className={`absolute border-2 transition-all cursor-pointer pointer-events-auto z-10 flex flex-col justify-between p-1 rounded-sm ${borderColor}`}
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                height: box.height
              }}
            >
              {/* Region Label Tag */}
              <div className="flex items-center justify-between gap-1">
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold tracking-tight shadow-xs ${badgeBg}`}>
                  {box.label || (isContrastFail ? "WCAG Fail" : "Off-Brand")}
                </span>
                {isContrastFail && (
                  <span className="text-[8px] font-mono font-bold text-red-200 bg-red-950/80 px-1 rounded">
                    &lt;4.5:1
                  </span>
                )}
              </div>

              {/* Interactive Tooltip Card */}
              {isHovered && (
                <div 
                  className="absolute bottom-full left-0 mb-1.5 w-64 p-2.5 bg-slate-900/95 backdrop-blur-md text-white text-[11px] rounded-lg shadow-xl border border-slate-700 z-50 pointer-events-none animate-fadeIn"
                  style={{ minWidth: "220px" }}
                >
                  <div className="flex items-center gap-1.5 font-bold pb-1 mb-1 border-b border-slate-700">
                    {isContrastFail ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span className="text-red-300">WCAG 2.1 AA Contrast Deficit</span>
                      </>
                    ) : isOffBrand ? (
                      <>
                        <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-amber-300">Unapproved Brand Palette Color</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-emerald-300">Brand & WCAG Verified</span>
                      </>
                    )}
                  </div>

                  <p className="font-mono text-[10px] text-slate-300 leading-snug whitespace-pre-line">
                    {box.tooltip}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner */}
        {analyzing && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-30">
            <div className="flex items-center gap-2 bg-slate-900/90 text-white border border-slate-700 px-3 py-1.5 rounded-lg shadow-lg text-xs font-mono">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>Scanning Canvas Pixels & Luminance...</span>
            </div>
          </div>
        )}

        {/* Top-Right Toggle Overlay Button */}
        <button
          type="button"
          onClick={onToggle}
          className={`absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-md text-[10px] font-bold font-mono tracking-wide shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
            show
              ? "bg-emerald-600 text-white ring-2 ring-emerald-400/50"
              : "bg-slate-900/85 hover:bg-slate-900 text-slate-200 border border-slate-700"
          }`}
          title={show ? "Hide visual audit bounding boxes" : "Show pixel-level WCAG & brand color overlay"}
        >
          {show ? <EyeOff className="w-3 h-3 text-emerald-200" /> : <Eye className="w-3 h-3 text-emerald-400" />}
          <span>{show ? "Hide Overlay" : "Toggle Audit Overlay"}</span>
        </button>

        {/* Top-Left Status Badge */}
        {!analyzing && (
          <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${
              isOverallPass 
                ? "bg-emerald-600 text-white" 
                : "bg-red-600 text-white"
            }`}>
              {isOverallPass ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>WCAG & Brand Compliant</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  <span>{failingWcagCount > 0 ? "WCAG AA Deficit" : "Off-Palette Colors"}</span>
                </>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Audit Legend & Summary Row */}
      {show && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-1 text-[11px] font-mono text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-red-500 border border-red-600 inline-block"></span>
              <strong className="text-red-700">Coral Red:</strong> Low Contrast (&lt; 4.5:1 AA)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 border border-amber-500 inline-block"></span>
              <strong className="text-amber-700">Amber:</strong> Off-Palette Hex
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 border border-emerald-600 inline-block"></span>
              <strong className="text-emerald-700">Emerald:</strong> Verified
            </span>
          </div>

          <span className="text-[10px] text-slate-500">
            Hover boxes for exact contrast & hex coordinates
          </span>
        </div>
      )}
    </div>
  );
}
