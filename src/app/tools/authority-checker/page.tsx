import type { Metadata } from "next";
import AuthorityCheckerClient from "./AuthorityCheckerClient";

export const metadata: Metadata = {
  title: "Website Authority & Open PageRank Checker | SEO Audit",
  description:
    "Check any domain's authority score, global ranking, and Open PageRank decimal rating powered by Common Crawl web data.",
};

export default function AuthorityCheckerPage() {
  return <AuthorityCheckerClient />;
}
