import { useState } from "react";

function WindowIllustration({
  percentage,
  windowOpen,
}: {
  percentage: number;
  windowOpen: boolean;
}) {
  const darknessOpacity = 1 - percentage / 100;
  const slatCount = 9;

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height: 180 }}>
      <svg
        viewBox="0 0 300 180"
        width="100%"
        height="180"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="60%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <clipPath id="windowClip">
            <rect x="16" y="16" width="268" height="152" rx="4" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="300" height="180" fill="#e2e8f0" />

        <g clipPath="url(#windowClip)">
          <rect x="16" y="16" width="268" height="152" fill="url(#skyGrad)" />

          <ellipse cx="220" cy="38" rx="28" ry="28" fill="white" opacity="0.85" />
          <ellipse cx="245" cy="32" rx="20" ry="20" fill="white" opacity="0.85" />
          <ellipse cx="195" cy="40" rx="16" ry="16" fill="white" opacity="0.7" />

          <ellipse cx="80" cy="50" rx="18" ry="18" fill="white" opacity="0.6" />
          <ellipse cx="98" cy="44" rx="14" ry="14" fill="white" opacity="0.6" />

          <rect x="16" y="130" width="268" height="38" fill="url(#groundGrad)" />

          <rect x="16" y="118" width="268" height="16" fill="#86efac" opacity="0.5" />
        </g>

        {windowOpen && (
          <g clipPath="url(#windowClip)">
            <g transform="translate(150, 16) rotate(-35, 0, 0) translate(0, 0)">
              <rect x="0" y="0" width="114" height="152" fill="#bfdbfe" opacity="0.25" rx="2" />
              <rect x="0" y="0" width="4" height="152" fill="#94a3b8" opacity="0.6" />
              <rect x="110" y="0" width="4" height="152" fill="#94a3b8" opacity="0.6" />
              <rect x="0" y="0" width="114" height="4" fill="#94a3b8" opacity="0.6" />
              <rect x="0" y="74" width="114" height="4" fill="#94a3b8" opacity="0.6" />
              <rect x="55" y="0" width="4" height="152" fill="#94a3b8" opacity="0.4" />
              <rect x="50" y="72" width="14" height="10" rx="2" fill="#64748b" opacity="0.7" />
            </g>
            <rect x="150" y="16" width="4" height="152" fill="#64748b" opacity="0.4" />
          </g>
        )}

        <rect x="8" y="8" width="4" height="164" rx="2" fill="#64748b" />
        <rect x="288" y="8" width="4" height="164" rx="2" fill="#64748b" />
        <rect x="8" y="8" width="284" height="4" rx="2" fill="#64748b" />
        <rect x="8" y="168" width="284" height="4" rx="2" fill="#64748b" />

        {!windowOpen && (
          <>
            <rect x="16" y="16" width="132" height="152" fill="none" stroke="#64748b" strokeWidth="3" />
            <rect x="148" y="16" width="136" height="152" fill="none" stroke="#64748b" strokeWidth="3" />
            <rect x="16" y="88" width="132" height="3" fill="#64748b" opacity="0.5" />
            <rect x="148" y="88" width="136" height="3" fill="#64748b" opacity="0.5" />
            <rect x="79" y="16" width="3" height="152" fill="#64748b" opacity="0.5" />
            <rect x="214" y="16" width="3" height="152" fill="#64748b" opacity="0.5" />
            <rect x="68" y="85" width="26" height="12" rx="3" fill="#94a3b8" />
            <rect x="206" y="85" width="26" height="12" rx="3" fill="#94a3b8" />
          </>
        )}

        {Array.from({ length: slatCount }).map((_, i) => {
          const slatHeight = 152 / slatCount;
          const y = 16 + i * slatHeight;
          const openFactor = percentage / 100;
          const slatThickness = Math.max(1, slatHeight * (1 - openFactor * 0.82));
          const slatOpacity = 0.55 + (1 - openFactor) * 0.35;

          return (
            <rect
              key={i}
              x="8"
              y={y}
              width="284"
              height={slatThickness}
              fill="#94a3b8"
              opacity={slatOpacity}
            />
          );
        })}

        <rect
          x="16"
          y="16"
          width="268"
          height="152"
          fill={`rgba(15, 23, 42, ${darknessOpacity * 0.82})`}
          style={{ transition: "fill 0.3s ease" }}
        />

        <rect x="8" y="8" width="284" height="8" rx="3" fill="#475569" />
        <rect x="140" y="2" width="20" height="12" rx="2" fill="#334155" />
      </svg>
    </div>
  );
}

function BlindIcon({ percentage }: { percentage: number }) {
  const slats = 6;
  const openFactor = percentage / 100;

  return (
    <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
      <rect x="4" y="2" width="56" height="6" rx="2" fill="#94a3b8" />
      {Array.from({ length: slats }).map((_, i) => {
        const y = 12 + i * 8;
        const height = Math.max(1.5, 6 - openFactor * 4);
        return (
          <rect key={i} x="4" y={y} width="56" height={height} rx="1" fill="#cbd5e1" />
        );
      })}
      <line x1="32" y1="8" x2="32" y2="60" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="3 3" />
    </svg>
  );
}

export default function TapparellaCard() {
  const [percentage, setPercentage] = useState(60);
  const [windowOpen, setWindowOpen] = useState(false);

  const getStatusColor = () => {
    if (percentage === 0) return "text-slate-600";
    if (percentage === 100) return "text-orange-500";
    return "text-emerald-600";
  };

  const getStatusText = () => {
    if (percentage === 0) return "Chiusa";
    if (percentage === 100) return "Aperta";
    return "Parziale";
  };

  const getBarColor = () => {
    if (percentage === 0) return "bg-slate-400";
    if (percentage < 50) return "bg-emerald-400";
    if (percentage < 100) return "bg-amber-400";
    return "bg-orange-400";
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-80 overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Tapparella</p>
            <h2 className="text-white font-semibold text-lg leading-tight">Soggiorno</h2>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <BlindIcon percentage={percentage} />
          </div>
        </div>

        <div className="px-4 pt-4">
          <WindowIllustration percentage={percentage} windowOpen={windowOpen} />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  percentage === 0
                    ? "bg-slate-400"
                    : percentage === 100
                    ? "bg-orange-400"
                    : "bg-emerald-400"
                }`}
              />
              <span className={`text-sm font-semibold ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <span className="text-3xl font-bold text-slate-800">
              {percentage}
              <span className="text-lg text-slate-400 font-medium">%</span>
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1.5">
              <span>Chiusa</span>
              <span>Apertura</span>
              <span>Aperta</span>
            </div>
            <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getBarColor()}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full mt-2 accent-slate-700 cursor-pointer"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPercentage(0)}
              className="flex-1 text-xs py-2 px-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Chiudi
            </button>
            <button
              onClick={() => setPercentage(50)}
              className="flex-1 text-xs py-2 px-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              50%
            </button>
            <button
              onClick={() => setPercentage(100)}
              className="flex-1 text-xs py-2 px-3 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Apri
            </button>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${windowOpen ? "bg-blue-100" : "bg-slate-100"}`}>
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <rect x="1" y="1" width="20" height="20" rx="2" stroke={windowOpen ? "#3b82f6" : "#94a3b8"} strokeWidth="1.5" fill={windowOpen ? "#dbeafe" : "#f1f5f9"} />
                    <line x1="11" y1="1" x2="11" y2="21" stroke={windowOpen ? "#3b82f6" : "#94a3b8"} strokeWidth="1.2" />
                    <line x1="1" y1="11" x2="21" y2="11" stroke={windowOpen ? "#3b82f6" : "#94a3b8"} strokeWidth="1.2" />
                    {windowOpen && (
                      <path d="M2 2 L9 9" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
                    )}
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Finestra</p>
                  <p className={`text-xs font-semibold ${windowOpen ? "text-blue-500" : "text-slate-400"}`}>
                    {windowOpen ? "Aperta" : "Chiusa"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWindowOpen((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                  windowOpen ? "bg-blue-500" : "bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300 ${
                    windowOpen ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {windowOpen && percentage < 20 && (
              <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs text-amber-700 font-medium">
                  Attenzione: finestra aperta con tapparella quasi chiusa!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-50 px-5 py-3 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs text-slate-400">Ultimo aggiornamento</span>
          <span className="text-xs text-slate-500 font-medium">Adesso</span>
        </div>
      </div>
    </div>
  );
}
