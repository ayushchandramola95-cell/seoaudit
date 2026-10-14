import { Metadata } from "next";
import McpClient from "./McpClient";

export const metadata: Metadata = {
  title: "Model Context Protocol (MCP) Server | SEO Audit Developer Ecosystem",
  description:
    "Connect Anthropic Claude Desktop, Cursor IDE, Windsurf, and custom AI agents to SEO Audit's deterministic SEO audit, Core Web Vitals, and competitor comparison engines.",
  keywords: [
    "SEO MCP server",
    "Model Context Protocol SEO",
    "Claude Desktop SEO tool",
    "Cursor IDE SEO plugin",
    "website audit MCP",
    "Ahrefs MCP alternative",
  ],
};

export default function McpPage() {
  return <McpClient />;
}
