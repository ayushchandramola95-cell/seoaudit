import type { Metadata } from "next";
import SchemaValidatorClient from "./SchemaValidatorClient";

export const metadata: Metadata = {
  title: "Schema JSON-LD & Structured Data Validator | SEO Audit",
  description:
    "Test, validate, and inspect your website's Schema.org JSON-LD structured data, OpenGraph tags, and Twitter Card metadata in real-time.",
};

export default function SchemaValidatorPage() {
  return <SchemaValidatorClient />;
}
