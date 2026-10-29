import { Suspense } from "react";
import DatabaseManagerClient from "./DatabaseManagerClient";

export const metadata = {
  title: "Custom PostgreSQL Database Manager | SeoSeite",
  description: "Connect and manage custom PostgreSQL databases, run migrations, and inspect stored website audit records live in SeoSeite.",
};

export default function DatabaseManagerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">Loading Database Engine...</div>}>
      <DatabaseManagerClient />
    </Suspense>
  );
}
