import { Suspense, use } from "react";
import { Metadata } from "next";
import ReportContent from "./ReportContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Permanent Audit Snapshot ${id} — SEO Audit Platform`,
    description: `Verified website intelligence, performance, and SEO diagnostic report snapshot for ID ${id}.`,
  };
}

function ReportWrapper({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ReportContent id={id} />;
}

export default function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ReportWrapper params={params} />
    </Suspense>
  );
}
