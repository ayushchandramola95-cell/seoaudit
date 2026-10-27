"use client";

import {
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Code2,
  Wrench,
} from "lucide-react";
import { SeoAuditReport } from "@/lib/modules/seo/scorer";
import { AiDiagnosticReport } from "@/lib/modules/ai/service";

interface AnalyzePriorityIssuesProps {
  audit: SeoAuditReport;
  ai: AiDiagnosticReport;
  onInspectDiagnostics: (statusFilter: "all" | "warning" | "error") => void;
  onOpenAiFixes: () => void;
}

export default function AnalyzePriorityIssues({
  audit,
  ai,
  onInspectDiagnostics,
  onOpenAiFixes,
}: AnalyzePriorityIssuesProps) {
  const nonPassing = audit.diagnostics.filter((d) => d.status !== "passed");
  const topFixes = ai.prioritizedFixes.slice(0, 3);

  return (
    <div className="flat-card bg-white p-5 sm:p-6 shadow-xs border-l-4 border-l-blue-600">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Wrench className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
              Priority Findings &amp; Actionable Remediations
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {nonPassing.length > 0
                ? `${nonPassing.length} Detected Issue${nonPassing.length > 1 ? "s" : ""}`
                : `${topFixes.length} Optimization Opportunities`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            What needs attention on this URL, how serious it is, and how to fix it based on verified HTML &amp; header evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {nonPassing.length > 0 && (
            <button
              type="button"
              onClick={() => onInspectDiagnostics(audit.errorCount > 0 ? "error" : "warning")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Filter Checklist ({nonPassing.length})
            </button>
          )}
          <button
            type="button"
            onClick={onOpenAiFixes}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>View Code Fixes ({ai.prioritizedFixes.length})</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topFixes.map((fix) => {
          const isHigh = fix.priority === "High";
          const isMed = fix.priority === "Medium";
          return (
            <div
              key={fix.id}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between hover:border-blue-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                      isHigh
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : isMed
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`}
                  >
                    {isHigh ? <XCircle className="w-3 h-3" /> : isMed ? <AlertTriangle className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                    {fix.priority} Priority
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-slate-400">{fix.category}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">{fix.title}</h4>

                <div className="text-[11px] font-mono text-slate-600 bg-white px-2.5 py-1.5 rounded border border-slate-200/80 mb-2 line-clamp-2">
                  <span className="font-sans font-semibold text-slate-400 mr-1">Observed:</span>
                  {fix.evidence}
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-3">
                  <strong className="text-slate-800">Fix:</strong> {fix.actionableStep}
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenAiFixes}
                className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <span>Inspect Remediation &amp; Code</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {topFixes.length === 0 && (
          <div className="md:col-span-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3 text-xs text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              All primary technical SEO checks passed! Explore the category tabs below for granular DOM, Schema, and link telemetry.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
