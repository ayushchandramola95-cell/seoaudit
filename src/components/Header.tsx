"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, BarChart3, GitCompare, Info, FileText, ArrowRight, LayoutDashboard } from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Website Analyzer" },
    { href: "/compare", label: "Compare" },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/project-info", label: "Project Info", highlight: true, icon: Info },
    { href: "/worklog", label: "Dev Worklog", highlight: true, icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-none border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900 tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-none">
                <Globe className="w-4 h-4" />
              </div>
              <span className="flex items-center gap-1.5">
                SeoSeite
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Intel
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const IconComponent = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-3.5 h-3.5 text-slate-500" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Cloud Run & SQL Ready
            </div>

            <Link
              href="/analyze"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Start Analysis
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
