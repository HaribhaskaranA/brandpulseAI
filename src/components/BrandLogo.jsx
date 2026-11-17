import React from "react";

export default function BrandLogo({ size = "md", showTagline = true, className = "" }) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      
      {/* Precision Geometric Shield & Pulse Logomark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isSm ? "w-8 h-8" : isLg ? "w-11 h-11" : "w-9 h-9"} drop-shadow-xs`}
        >
          {/* Outer Rounded Shield Canvas */}
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="12"
            fill="#0F172A"
            stroke="#1E293B"
            strokeWidth="1.5"
          />

          {/* Concentric Subtle Governance Shield Arc */}
          <path
            d="M12 15C12 12.7909 13.7909 11 16 11H28C30.2091 11 32 12.7909 32 15V24C32 29.5 22 34 22 34C22 34 12 29.5 12 24V15Z"
            fill="#1E293B"
            fillOpacity="0.4"
            stroke="#334155"
            strokeWidth="1"
          />

          {/* Electric Emerald Pulse Waveform */}
          <path
            d="M9 23H15L18 16L22 28L26 20L28 23H35"
            stroke="#059669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Glowing Pulse Apex Dot */}
          <circle cx="26" cy="20" r="2.5" fill="#34D399" />
        </svg>

        {/* Ambient Emerald Live Pulse Glow */}
        <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
        </span>
      </div>

      {/* Typographic Wordmark */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-slate-900 ${
            isSm ? "text-base" : isLg ? "text-2xl" : "text-lg"
          }`}>
            Brand<span className="text-slate-800">Pulse</span>
          </span>
          <span className="bg-emerald-600 text-white font-mono font-bold text-[10px] tracking-wider px-1.5 py-0.5 rounded-md shadow-2xs">
            AI
          </span>
        </div>

        {showTagline && (
          <span className={`text-[10px] font-medium text-slate-500 tracking-tight leading-tight mt-0.5 ${
            isSm ? "hidden" : "block"
          }`}>
            Pre-Publication Brand Governance
          </span>
        )}
      </div>

    </div>
  );
}
