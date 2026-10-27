"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  FileText,
  User,
} from "lucide-react";

interface EmailReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
  score: number;
  grade: string;
  summary?: string;
  reportUrl?: string;
  topFixes?: Array<{ title: string; priority?: string }>;
}

export default function EmailReportModal({
  isOpen,
  onClose,
  domain,
  score,
  grade,
  summary,
  reportUrl,
  topFixes = [],
}: EmailReportModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [customNote, setCustomNote] = useState(
    `Here is the latest technical SEO & Core Web Vitals executive audit snapshot for ${domain}.`
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentResult, setSentResult] = useState<{
    deliveryId: string;
    timestamp: string;
    subject: string;
    textDigest: string;
    recipientEmail: string;
  } | null>(null);
  const [copiedDigest, setCopiedDigest] = useState(false);

  if (!isOpen) return null;

  const resolvedReportUrl =
    reportUrl || (typeof window !== "undefined" ? window.location.href : `https://seoseite.app/analyze?url=${domain}`);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSending(true);

    try {
      const res = await fetch("/api/report/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          domain,
          score,
          grade,
          summary,
          customNote,
          reportUrl: resolvedReportUrl,
          topFixes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unable to send email report.");
      }

      setSentResult({
        deliveryId: data.deliveryId,
        timestamp: data.timestamp,
        subject: data.subject,
        textDigest: data.textDigest,
        recipientEmail: data.recipientEmail,
      });
    } catch (err: unknown) {
      setError((err as Error)?.message || "Unexpected error while sending report.");
    } finally {
      setSending(false);
    }
  };

  const handleCopyDigest = () => {
    if (!sentResult) return;
    navigator.clipboard.writeText(sentResult.textDigest);
    setCopiedDigest(true);
    setTimeout(() => setCopiedDigest(false), 2000);
  };

  const handleOpenMailto = () => {
    const subject = encodeURIComponent(
      `Executive SEO Audit Report: ${domain} (${score}/100 • Grade ${grade})`
    );
    const body = encodeURIComponent(
      sentResult?.textDigest ||
        `${customNote}\n\nDomain: ${domain}\nOverall SEO Score: ${score}/100 (Grade ${grade})\n${
          summary ? `\nSummary: ${summary}\n` : ""
        }\nView Full Interactive Report: ${resolvedReportUrl}`
    );
    window.location.href = `mailto:${encodeURIComponent(recipientEmail)}?subject=${subject}&body=${body}`;
  };

  const handleResetAndClose = () => {
    setSentResult(null);
    setError(null);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150"
      onClick={handleResetAndClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Email Executive Audit Report</h3>
              <p className="text-[11px] text-slate-400">Send executive summary &amp; permanent snapshot link</p>
            </div>
          </div>
          <button type="button" onClick={handleResetAndClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentResult ? (
          <div className="p-6 space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-950 text-sm">Executive Report Dispatched!</div>
                <p className="text-emerald-800 mt-0.5">
                  Queued for <span className="font-mono font-bold">{sentResult.recipientEmail}</span> • ID{" "}
                  <span className="font-mono">{sentResult.deliveryId}</span>
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Dispatched Executive Digest Preview
                </span>
                <button
                  type="button"
                  onClick={handleCopyDigest}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  {copiedDigest ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copiedDigest ? "Copied!" : "Copy Digest"}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-52 whitespace-pre-wrap border border-slate-800">
                {sentResult.textDigest}
              </pre>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleOpenMailto}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Mail App
              </button>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendEmail} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Domain Snapshot
                </div>
                <div className="text-sm font-extrabold text-slate-900 font-mono mt-0.5">{domain}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold text-xs">
                  {score}/100
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs">
                  Grade {grade}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Recipient Email <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600 bg-white">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="email"
                    required
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="client@company.com"
                    className="w-full text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recipient / Client Name</label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 focus-within:border-blue-600 bg-white">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g. Marketing Lead"
                    className="w-full text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Executive Note</label>
              <textarea
                rows={3}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Add a personalized note..."
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-600 leading-relaxed"
              />
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Included in Executive Email Digest:</span>
              </div>
              <ul className="text-[11px] text-blue-800/90 space-y-0.5 pl-5 list-disc">
                <li>Deterministic 0–100 SEO Health Score &amp; Grade ({score}/100)</li>
                <li>AI Executive Diagnostic Summary &amp; Top Action Items</li>
                <li>Permanent shareable snapshot URL for interactive inspection</li>
              </ul>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-200">
              <button
                type="button"
                onClick={handleOpenMailto}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Open in Mail Client
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sending ? "Dispatching..." : "Send Executive Report"}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
