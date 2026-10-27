"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export default function AuthGuard({
  children,
  fallbackTitle = "Authentication Required",
  fallbackMessage = "Please sign in or create an account to access technical audits, telemetry, and intelligence tools.",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const fullUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
      router.push(`/login?redirect=${encodeURIComponent(fullUrl)}`);
    }
  }, [isAuthenticated, isLoading, pathname, searchParams, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <div className="text-sm font-bold text-slate-700">Verifying security session...</div>
        <div className="text-xs text-slate-400 mt-1">Checking account access permissions</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const fullUrl = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">{fallbackTitle}</h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{fallbackMessage}</p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(fullUrl)}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/signup?redirect=${encodeURIComponent(fullUrl)}`}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all cursor-pointer"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
