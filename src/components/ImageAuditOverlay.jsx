import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { runFullImageAudit } from "../utils/imageAudit";

/**
 * ImageAuditOverlay
 * Props:
 *   imageUrl         — URL of the image to analyze
 *   imageAuditResult — pre-computed audit result (or null to compute lazily)
 *   show             — whether overlays are currently visible
 *   onToggle         — callback to toggle show state
 */
export default function ImageAuditOverlay({ imageUrl, imageAuditResult, show, onToggle }) {
  const [localResult, setLocalResult] = useState(imageAuditResult || null);
  const [analyzing, setAnalyzing] = useState(false);
  const imgRef = useRef(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  // When show becomes true or imageUrl changes, trigger analysis if no result yet
  useEffect(() => {
    if (!imageUrl) return;
    if (imageAuditResult) {
      setLocalResult(imageAuditResult);
      return;
    }
    if (show && !localResult && !analyzing) {
      setAnalyzing(true);
      runFullImageAudit(imageUrl, false)
        .then((result) => {
          setLocalResult(result);
          setAnalyzing(false);
        })
        .catch(() => setAnalyzing(false));
    }
  }, [show, imageUrl, imageAuditResult, localResult, analyzing]);

  // Track rendered image dimensions for overlay positioning
  useEffect(() => {
    if (!imgRef.current) return;
    const updateSize = () => {
      if (imgRef.current) {
        setImgSize({
          width: imgRef.current.offsetWidth,
          height: imgRef.current.offsetHeight
        });
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [imageUrl]);

  // Sync external result into local state
  useEffect(() => {
    if (imageAuditResult) setLocalResult(imageAuditResult);
  }, [imageAuditResult]);

  if (!imageUrl) return null;

  // Build overlay boxes for each quadrant
  const overlays = [];
  if (show && localResult) {
    const { wcagResults = [], quadrantAnalysis = [], offBrandColors = [], dominantColors = [] } = localResult;

    // WCAG contrast overlays — per quadrant region (map text regions to position)
    const textRegionPositions = [
      // top 15%
      { name: "Top Banner (15%)", top: "0%", left: "0%", width: "100%", height: "15%", type: "contrast" },
      // bottom 20%
      { name: "Bottom Footer (20%)", top: "80%", left: "0%", width: "100%", height: "20%", type: "contrast" },
      // center band 40-60%
      { name: "Center Band (40–60%)", top: "40%", left: "0%", width: "100%", height: "20%", type: "contrast" },
      // subtitle overlay (synthetic fallback)
      { name: "Subtitle Overlay", top: "75%", left: "5%", width: "60%", height: "12%", type: "contrast" }
    ];

    for (const region of wcagResults) {
      if (!region.passesWcagAA) {
        const pos = textRegionPositions.find((p) => p.name === region.name) || {
          top: "60%", left: "5%", width: "60%", height: "12%", type: "contrast"
        };
        overlays.push({
          type: "contrast",
          style: {
            top: pos.top, left: pos.left, width: pos.width, height: pos.height
          },
          tooltip: `⚠️ Low Contrast: ${region.estimatedContrast}:1 (needs 4.5:1)\nFG: ${region.fgHex} → BG: ${region.bgHex}`,
          label: `${region.estimatedContrast}:1`
        });
      }
    }

    // Off-brand color overlays — per quadrant
    const quadrantPositions = [
      { name: "Top-Left", top: "0%", left: "0%", width: "50%", height: "50%" },
      { name: "Top-Right", top: "0%", left: "50%", width: "50%", height: "50%" },
      { name: "Bottom-Left", top: "50%", left: "0%", width: "50%", height: "50%" },
      { name: "Bottom-Right", top: "50%", left: "50%", width: "50%", height: "50%" }
    ];

    for (const color of dominantColors) {
      if (!color.isApproved) {
        const pos = quadrantPositions.find((p) => p.name === color.regionName);
        if (pos) {
          overlays.push({
            type: "offbrand",
            style: { top: pos.top, left: pos.left, width: pos.width, height: pos.height },
            tooltip: `🟡 Off-Brand Color\nDetected: ${color.hex}\nNearest approved: ${color.nearestApproved} (${color.nearestApprovedHex})\nΔ ${color.euclideanDistance} RGB distance`,
            label: color.hex
          });
        }
      }
    }
  }

  const hasIssues = localResult && (!localResult.overallPass || (localResult.wcagResults || []).some((r) => !r.passesWcagAA));

  return (
    <div className="space-y-2">
      {/* Image + Overlay Container */}
      <div className="relative rounded-lg overflow-hidden border border-slate-300">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Creative Preview with Audit Overlay"
          className="w-full h-36 object-cover block"
          onLoad={() => {
            if (imgRef.current) {
              setImgSize({
                width: imgRef.current.offsetWidth,
                height: imgRef.current.offsetHeight
              });
            }
          }}
        />

        {/* Audit Overlays */}
        {show && overlays.map((ov, i) => (
          <div
            key={i}
            title={ov.tooltip}
            className={`absolute pointer-events-auto cursor-help border-2 flex items-end justify-start p-1 ${
              ov.type === "contrast"
                ? "bg-red-500/20 border-red-500"
                : "bg-amber-400/20 border-amber-500"
            }`}
            style={{ ...ov.style, zIndex: 10 }}
          >
            <span className={`text-[9px] font-mono font-bold px-1 rounded ${
              ov.type === "contrast"
                ? "bg-red-600 text-white"
                : "bg-amber-500 text-white"
            }`}>
              {ov.label}
            </span>
          </div>
        ))}

        {/* Loading spinner */}
        {analyzing && (
          <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center z-20">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-lg">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">Analyzing pixels…</span>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          title={show ? "Hide audit overlay" : "Show WCAG audit overlay"}
          className={`absolute top-2 right-2 z-30 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold shadow-md transition-all ${
            show
              ? "bg-emerald-600 text-white"
              : "bg-white/90 text-slate-700 border border-emerald-500"
          }`}
        >
          {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {show ? "Hide Overlay" : "Audit Overlay"}
        </button>

        {/* Status badge */}
        {localResult && !analyzing && (
          <div className={`absolute top-2 left-2 z-20 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
            localResult.overallPass
              ? "bg-emerald-600/90 text-white"
              : "bg-red-600/90 text-white"
          }`}>
            {localResult.overallPass ? "✓ PASS" : "✗ ISSUES"}
          </div>
        )}
      </div>

      {/* Legend */}
      {show && (
        <div className="flex items-center gap-4 text-[10px] text-slate-600 font-mono px-1">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-red-500/70 border border-red-600"></span>
            🔴 Low Contrast (WCAG AA Fail)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-sm bg-amber-400/70 border border-amber-500"></span>
            🟡 Off-Brand Color
          </span>
        </div>
      )}

      {/* Audit summary line */}
      {localResult && !analyzing && (
        <p className={`text-[10px] font-mono px-1 ${
          localResult.overallPass ? "text-emerald-700" : "text-red-700"
        }`}>
          {localResult.summary}
        </p>
      )}
    </div>
  );
}
