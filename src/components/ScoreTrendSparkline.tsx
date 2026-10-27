"use client";

import { useEffect, useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

interface HistoryPoint {
  id: string;
  domain: string;
  seoScore: number;
  grade: string;
  perfScore: number | null;
  responseTimeMs: number;
  createdAt: string;
}

interface ScoreTrendSparklineProps {
  domain: string;
  currentScore: number;
  variant?: "dark" | "light";
}

function buildSyntheticHistory(domain: string, currentScore: number): HistoryPoint[] {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash * 31 + domain.charCodeAt(i)) % 1000;
  }
  const offsets = [-8, -6, -4, -3, -1, 0];
  const now = Date.now();
  return offsets.map((baseOffset, idx) => {
    const jitter = idx === offsets.length - 1 ? 0 : ((hash + idx * 7) % 5) - 2;
    const clamped = Math.max(35, Math.min(100, currentScore + baseOffset + jitter));
    return {
      id: `baseline-${idx}`,
      domain,
      seoScore: idx === offsets.length - 1 ? currentScore : clamped,
      grade: clamped >= 90 ? "A+" : clamped >= 80 ? "A" : "B",
      perfScore: null,
      responseTimeMs: 180,
      createdAt: new Date(now - (offsets.length - 1 - idx) * 86400000 * 5).toISOString(),
    };
  });
}

export default function ScoreTrendSparkline({
  domain,
  currentScore,
  variant = "dark",
}: ScoreTrendSparklineProps) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [isLiveHistory, setIsLiveHistory] = useState(false);

  useEffect(() => {
    if (!domain) return;
    let cancelled = false;
    async function loadHistory() {
      try {
        const res = await fetch(`/api/history/domain?domain=${encodeURIComponent(domain)}`);
        const json = await res.json();
        if (!cancelled && json.success && Array.isArray(json.history) && json.history.length >= 2) {
          setHistory(json.history);
          setIsLiveHistory(true);
          return;
        }
      } catch {
        // Fallback
      }
      if (!cancelled) {
        setHistory(buildSyntheticHistory(domain, currentScore));
        setIsLiveHistory(false);
      }
    }
    loadHistory();
    return () => {
      cancelled = true;
    };
  }, [domain, currentScore]);

  const points = useMemo(() => {
    if (history.length >= 2) return history;
    return buildSyntheticHistory(domain || "example.com", currentScore);
  }, [history, domain, currentScore]);

  const scores = points.map((p) => p.seoScore);
  const firstScore = scores[0] ?? currentScore;
  const lastScore = scores[scores.length - 1] ?? currentScore;
  const delta = lastScore - firstScore;
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const floor = Math.max(0, minScore - 6);
  const ceiling = Math.min(100, maxScore + 6);
  const range = Math.max(8, ceiling - floor);

  const width = 148;
  const height = 36;
  const padX = 5;
  const padY = 5;
  const usableW = width - padX * 2;
  const usableH = height - padY * 2;

  const coords = points.map((pt, idx) => ({
    x: padX + (idx / Math.max(1, points.length - 1)) * usableW,
    y: padY + usableH - ((pt.seoScore - floor) / range) * usableH,
    score: pt.seoScore,
  }));

  const polylinePoints = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
  const areaPath =
    coords.length > 1
      ? `M ${coords[0].x.toFixed(1)} ${height - 2} L ` +
        coords.map((c) => `${c.x.toFixed(1)} ${c.y.toFixed(1)}`).join(" L ") +
        ` L ${coords[coords.length - 1].x.toFixed(1)} ${height - 2} Z`
      : "";

  const isDark = variant === "dark";
  const strokeColor = delta >= 0 ? "#34d399" : "#fb7185";
  const gradId = `spark-${domain.replace(/[^a-zA-Z0-9]/g, "")}-${variant}`;

  return (
    <div
      className={
        isDark
          ? "rounded-xl bg-white/5 border border-white/10 p-2.5 flex flex-col justify-between shrink-0"
          : "rounded-xl bg-slate-50 border border-slate-200 p-2.5 flex flex-col justify-between shrink-0"
      }
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
          <Activity className="w-3 h-3 text-sky-400" />
          {isLiveHistory ? `Verified History (${points.length})` : "Demo Trend Baseline"}
        </span>
        <span className={`inline-flex items-center gap-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${delta >= 0 ? (isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-50 text-emerald-700") : isDark ? "bg-rose-500/20 text-rose-300" : "bg-rose-50 text-rose-700"}`}>
          {delta > 0 ? <TrendingUp className="w-2.5 h-2.5" /> : delta < 0 ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
          {delta > 0 ? `+${delta}` : delta} pts
        </span>
      </div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible my-0.5">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={isDark ? 0.35 : 0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
        <polyline fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={polylinePoints} />
        {coords.map((c, idx) => {
          const isLast = idx === coords.length - 1;
          return (
            <circle key={idx} cx={c.x} cy={c.y} r={isLast ? 3 : 1.8} fill={isLast ? "#fff" : strokeColor} stroke={strokeColor} strokeWidth={isLast ? 2 : 1}>
              <title>{`Scan #${idx + 1}: ${c.score}/100`}</title>
            </circle>
          );
        })}
      </svg>
      <div className={`flex items-center justify-between text-[10px] font-mono ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <span>Start: {firstScore}</span>
        <span>Peak: {maxScore}</span>
        <span className={isDark ? "text-white font-bold" : "text-slate-900 font-bold"}>Now: {lastScore}</span>
      </div>
    </div>
  );
}
