"use client";

import { useState } from "react";
import { Terminal, Copy, Check, Sparkles, Bot, Code2 } from "lucide-react";

export default function McpTerminalCard() {
  const [copied, setCopied] = useState(false);

  const configJson = `{
  "mcpServers": {
    "seoseite": {
      "command": "node",
      "args": ["scripts/seoseite-mcp.mjs"],
      "env": {
        "SEOSEITE_API_URL": "https://seoseite.com"
      }
    }
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(configJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {/* Background Soft Glow Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-indigo-500/20 to-purple-600/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 -z-10" />

      {/* Terminal Window Frame */}
      <div className="bg-slate-950 text-slate-100 rounded-3xl border-2 border-slate-800 shadow-2xl overflow-hidden text-left font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
            </div>

            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>claude-desktop-config.json</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              MCP JSON-RPC 2.0
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px]"
              title="Copy JSON configuration"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Syntax Highlighted Code Body */}
        <div className="p-6 bg-slate-950/95 space-y-4">
          <pre className="text-slate-200 leading-relaxed whitespace-pre-wrap break-words text-xs font-mono">
            <code>
              <span className="text-slate-500">{"{\n"}</span>
              <span className="text-blue-400 font-bold">{'  "mcpServers"'}</span>
              <span className="text-slate-500">{": {\n"}</span>
              <span className="text-purple-400 font-bold">{'    "seoseite"'}</span>
              <span className="text-slate-500">{": {\n"}</span>
              <span className="text-emerald-400">{'      "command"'}</span>
              <span className="text-slate-500">{": "}</span>
              <span className="text-amber-300">{'"node"'}</span>
              <span className="text-slate-500">{",\n"}</span>
              <span className="text-emerald-400">{'      "args"'}</span>
              <span className="text-slate-500">{": ["}</span>
              <span className="text-amber-300">{'"scripts/seoseite-mcp.mjs"'}</span>
              <span className="text-slate-500">{"],\n"}</span>
              <span className="text-emerald-400">{'      "env"'}</span>
              <span className="text-slate-500">{": {\n"}</span>
              <span className="text-cyan-300">{'        "SEOSEITE_API_URL"'}</span>
              <span className="text-slate-500">{": "}</span>
              <span className="text-amber-300">{'"https://seoseite.com"'}</span>
              <span className="text-slate-500">{"\n      }\n    }\n  }\n}"}</span>
            </code>
          </pre>

          {/* Interactive Simulated Prompt Banner */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5" />
                User prompt in Claude / Cursor IDE:
              </span>
              <span className="text-slate-500 font-mono">stdio bridge</span>
            </div>

            <div className="text-slate-300 pl-4 border-l-2 border-amber-400/60 font-sans italic">
              &quot;Run seoseite_audit_url on https://stripe.com and diagnose slow Web Vitals.&quot;
            </div>

            <div className="text-emerald-400 pt-1 flex items-center gap-2 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Claude executes tool → Receives verified deterministic JSON audit in 68ms.</span>
            </div>
          </div>
        </div>

        {/* Terminal Bottom Status Bar */}
        <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              stdio connection active
            </span>
            <span>•</span>
            <span>3 tools exposed</span>
          </div>
          <span className="text-slate-500">UTF-8 • LF</span>
        </div>
      </div>
    </div>
  );
}
