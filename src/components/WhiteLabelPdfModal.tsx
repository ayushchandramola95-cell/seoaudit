"use client";

import { useState } from "react";
import { X, Printer, Sparkles, Building, User, FileText, Check, Lock } from "lucide-react";
import { usePlan } from "@/lib/auth/PlanContext";
import { formatTierName } from "@/lib/auth/tierLimits";

interface WhiteLabelPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  score: number;
  grade: string;
}

export default function WhiteLabelPdfModal({
  isOpen,
  onClose,
  domain,
  score,
  grade,
}: WhiteLabelPdfModalProps) {
  const { tier, canAccess, triggerUpgradeModal } = usePlan();
  const hasWhiteLabelAccess = canAccess("allowWhiteLabelPDF");

  const [agencyName, setAgencyName] = useState("SEO Audit Intelligence Partner");
  const [clientName, setClientName] = useState(domain);
  const [consultantName, setConsultantName] = useState("Lead Technical SEO Analyst");
  const [executiveNotes, setExecutiveNotes] = useState(
    "Overall technical architecture is sound. High-priority focus areas include Core Web Vitals optimization, JSON-LD Schema implementation, and robots.txt crawler access."
  );

  if (!isOpen) return null;

  const handlePrint = () => {
    if (!hasWhiteLabelAccess) {
      triggerUpgradeModal({
        requiredTier: "enterprise",
        featureTitle: "White-Label Agency Client PDF Export",
        description:
          "Custom agency branding, consultant signatures, client notes, and white-label client PDF generation is an Agency & Enterprise feature.",
      });
      return;
    }

    // Inject printable banner into window print session
    const printHeaderId = "whitelabel-print-header";
    let printEl = document.getElementById(printHeaderId);
    if (!printEl) {
      printEl = document.createElement("div");
      printEl.id = printHeaderId;
      document.body.prepend(printEl);
    }

    printEl.innerHTML = `
      <div style="border-bottom: 2px solid #0f172a; padding: 24px 0 16px 0; margin-bottom: 24px; font-family: sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; color: #2563eb;">
              ${agencyName}
            </div>
            <h1 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 4px 0;">
              Executive Website Audit & Technical Intelligence
            </h1>
            <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
              Prepared for: <strong style="color: #0f172a;">${clientName}</strong> &bull; Lead Auditor: ${consultantName} &bull; ${new Date().toLocaleDateString()}
            </div>
          </div>
          <div style="text-align: right; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; background: #f8fafc;">
            <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b;">Health Score</div>
            <div style="font-size: 28px; font-weight: 900; color: #0f172a;">${score}/100</div>
            <div style="font-size: 11px; font-weight: bold; color: #2563eb;">Grade ${grade}</div>
          </div>
        </div>
        ${
          executiveNotes
            ? `<div style="margin-top: 14px; padding: 12px; background: #f1f5f9; border-radius: 6px; font-size: 12px; color: #334155; line-height: 1.5;">
                <strong style="color: #0f172a;">Consultant Executive Summary:</strong> ${executiveNotes}
              </div>`
            : ""
        }
      </div>
    `;

    window.print();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                White-Label Client PDF Report
              </h3>
              <p className="text-[11px] text-slate-500">
                Brand this technical audit with your agency credentials.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Your Agency / Consultancy Name
            </label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white focus-within:border-blue-600">
              <Building className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="e.g. Apex Digital SEO Advisory"
                className="w-full text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Client Company Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Lead Auditor / Consultant
              </label>
              <input
                type="text"
                value={consultantName}
                onChange={(e) => setConsultantName(e.target.value)}
                placeholder="e.g. Ayush C."
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Custom Consultant Summary & Strategic Notes
            </label>
            <textarea
              rows={3}
              value={executiveNotes}
              onChange={(e) => setExecutiveNotes(e.target.value)}
              placeholder="Highlight top 3 takeaways for the client..."
              className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed"
            />
          </div>

          {/* Preview Pill */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] text-blue-900 font-medium">
                Report Scope: 0–100 SEO Score, Core Web Vitals, Tech Stack & Action Items
              </span>
            </div>
            <span className="text-[11px] font-mono font-bold text-blue-700">
              {score}/100 Grade {grade}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate & Print Client PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
