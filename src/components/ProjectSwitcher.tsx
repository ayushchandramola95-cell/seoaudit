"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  ChevronDown,
  Plus,
  RefreshCw,
  Check,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";
import { useProject } from "@/context/ProjectContext";

export default function ProjectSwitcher() {
  const {
    activeDomain,
    setActiveDomain,
    savedProjects,
    addProject,
    removeProject,
    syncFromGsc,
    isSyncing,
  } = useProject();

  const [isOpen, setIsOpen] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;
    addProject(newDomainInput.trim(), newDomainInput.trim(), "Custom Site");
    setNewDomainInput("");
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      {/* Switcher Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
          isOpen
            ? "bg-slate-100 text-slate-900 border-indigo-300 shadow-xs ring-2 ring-indigo-500/10"
            : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 shadow-2xs"
        }`}
        title="Active Workspace Project (pre-fills all engines)"
      >
        <div className="relative flex items-center justify-center">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full ring-1 ring-white" />
        </div>
        <span className="font-mono font-bold text-slate-900 max-w-[110px] sm:max-w-[140px] truncate">
          {activeDomain || "Select Site"}
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header */}
          <div className="p-3.5 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                Active Workspace Site
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Auto Pre-fills
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Selecting a site sets the target domain across all 21 engines. Audits execute strictly on click.
            </p>
          </div>

          {/* Quick Add Custom Domain Input */}
          <form onSubmit={handleAddCustom} className="p-3 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newDomainInput}
                onChange={(e) => setNewDomainInput(e.target.value)}
                placeholder="Add custom domain (e.g. mysite.com)"
                className="flex-1 bg-slate-50 text-slate-900 text-xs rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="submit"
                disabled={!newDomainInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white p-1.5 rounded-lg transition-colors cursor-pointer"
                title="Add Domain"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Saved Projects List */}
          <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar divide-y divide-slate-50">
            {savedProjects.map((proj) => {
              const isActive = activeDomain.toLowerCase() === proj.domain.toLowerCase();
              return (
                <div
                  key={proj.domain}
                  className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors group ${
                    isActive ? "bg-indigo-50/70" : "hover:bg-slate-50"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDomain(proj.domain);
                      setIsOpen(false);
                    }}
                    className="flex-1 flex items-center gap-2 text-left cursor-pointer truncate"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    }`}>
                      <Globe className="w-3 h-3" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-mono font-bold truncate ${isActive ? "text-indigo-950 font-black" : "text-slate-800"}`}>
                          {proj.domain}
                        </span>
                        {isActive && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {proj.tag}
                      </span>
                    </div>
                  </button>

                  {proj.source === "manual" && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(proj.domain);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-all cursor-pointer ml-1"
                      title="Remove from saved projects"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={syncFromGsc}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-indigo-600" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Sync GSC Sites"}</span>
            </button>

            <Link
              href={`/analyze?url=https://${activeDomain}`}
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-700"
            >
              <span>Run Full Audit</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

