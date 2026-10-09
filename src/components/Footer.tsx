import Link from "next/link";
import { Globe, ShieldCheck, Cpu, Database, Sparkles, BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center text-white text-xs">
                <Globe className="w-3.5 h-3.5" />
              </div>
              SeoSeite Intel
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Open website intelligence platform for technical SEO, technology detection, and traffic estimation. Grounded metrics, zero hallucinations.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              SSRF & Safe Crawling Protected
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Core Tools</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/analyze" className="hover:text-blue-600 transition-colors">
                  Website SEO Analyzer
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600 transition-colors">
                  Competitor Comparison
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 transition-colors">
                  SaaS Dashboard & Cloud Status
                </Link>
              </li>
              <li>
                <Link href="/traffic-estimator" className="hover:text-blue-600 transition-colors">
                  Traffic Heuristics Estimator
                </Link>
              </li>
              <li>
                <Link href="/tech-stack" className="hover:text-blue-600 transition-colors">
                  Technology Stack Detector
                </Link>
              </li>
            </ul>
          </div>

          {/* Documentation & Transparency */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">Project & Transparency</h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/project-info" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium text-slate-900">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Project Quick Info
                </Link>
              </li>
              <li>
                <Link href="/worklog" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors font-medium text-slate-900">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  Day-by-Day Dev Worklog
                </Link>
              </li>
              <li>
                <span className="text-xs text-slate-500">Architecture: Next.js 16 + React 19</span>
              </li>
              <li>
                <span className="text-xs text-slate-500">BCA Final-Year Capstone Project</span>
              </li>
            </ul>
          </div>

          {/* Ethics statement */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Our Core Promise
            </div>
            <p className="text-xs text-slate-600 leading-normal">
              We never fabricate traffic or backlink numbers. When exact data cannot be measured from public sources, we document our confidence level and methodology transparently.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SeoSeite Platform. Built with Next.js, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center gap-4">
            <Link href="/project-info" className="hover:text-slate-800">
              Architecture Spec
            </Link>
            <Link href="/worklog" className="hover:text-slate-800">
              Development Log
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
