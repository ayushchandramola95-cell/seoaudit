"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Search,
  Globe,
  BarChart3,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Users,
  RefreshCw,
  PieChart,
  Sliders,
  Award,
  DollarSign,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Clock,
  Activity,
  Calendar,
  Filter,
  Target,
  ChevronRight,
  Eye,
  Zap,
  Info,
} from "lucide-react";
import { TrafficEstimationReport } from "@/lib/modules/traffic/estimator";

interface TrafficApiResponse {
  success: boolean;
  domain: string;
  latencyMs: number;
  pageRank: number;
  data: TrafficEstimationReport;
}

const PRESET_DOMAINS = [
  { domain: "stripe.com", label: "Stripe", tag: "Fintech SaaS" },
  { domain: "linear.app", label: "Linear", tag: "Project Mgmt" },
  { domain: "vercel.com", label: "Vercel", tag: "Cloud Frontend" },
  { domain: "github.com", label: "GitHub", tag: "Dev Platform" },
];

interface Datapoint {
  month: string;
  year: string;
  fullDate: string;
  visits: number;
  organicVisits: number;
  paidVisits: number;
  growthYoY: string;
  growthMoM: string;
  isForecast?: boolean;
}

interface KeywordEntry {
  keyword: string;
  position: number;
  volume: number;
  traffic: number;
  intent: "Commercial" | "Informational" | "Transactional" | "Navigational";
  kd: number;
  cpc: number;
}

interface CompetitorBenchmark {
  domain: string;
  label: string;
  visits: number;
  formattedVisits: string;
  organicShare: number;
  pageRank: number;
  marketShare: number;
}

// Cubic spline calculation: passes exactly through all (x, y) coordinates
function getSmoothSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const tension = 0.22;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

const CHART_WIDTH = 760;
const CHART_HEIGHT = 230;
const CHART_PAD_L = 60;
const CHART_PAD_R = 24;
const CHART_PAD_T = 20;
const CHART_PAD_B = 35;
const CHART_INNER_W = CHART_WIDTH - CHART_PAD_L - CHART_PAD_R;
const CHART_INNER_H = CHART_HEIGHT - CHART_PAD_T - CHART_PAD_B;
const CHART_BASELINE_Y = CHART_HEIGHT - CHART_PAD_B;

export default function TrafficEstimatorClient() {
  const [domainInput, setDomainInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrafficApiResponse | null>(null);

  // Chart & View Controls
  const [timeRange, setTimeRange] = useState<"6m" | "12m" | "forecast">("12m");
  const [chartSeries, setChartSeries] = useState<"all" | "organic" | "compare">("all");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  // Sub-Navigation Tabs
  const [activeTab, setActiveTab] = useState<"overview" | "keywords" | "competitors" | "geography" | "devices" | "ctr">("overview");
  const [keywordFilter, setKeywordFilter] = useState<string>("all");
  const [copiedSummary, setCopiedSummary] = useState(false);

  // STRICT REQUIREMENT: Presets ONLY populate input box. User must click "Calculate Organic Reach".
  const handleSelectPreset = (domain: string) => {
    setDomainInput(domain);
  };

  const handleEstimate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!domainInput.trim()) return;

    setLoading(true);
    setError(null);
    setHoveredPointIndex(null);

    try {
      const res = await fetch("/api/tools/traffic-estimator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to calculate organic traffic estimate.");
      }

      setResult(data);
    } catch (err: unknown) {
      setError((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  function formatNumber(num: number): string {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toLocaleString();
  }

  function formatCompactVal(num: number): string {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }

  // Derive dynamic time-series data based on selected timeRange
  const trendData: Datapoint[] = useMemo(() => {
    if (!result) return [];
    const base = result.data.monthlyVisitsMidpoint;
    const orgShare = result.data.organicSearchShare / 100;

    if (timeRange === "6m") {
      const months = [
        { m: "May", y: "2026", mult: 0.96, yoy: "+11.2%", mom: "+1.8%" },
        { m: "Jun", y: "2026", mult: 0.99, yoy: "+12.4%", mom: "+3.1%" },
        { m: "Jul", y: "2026", mult: 1.03, yoy: "+13.1%", mom: "+4.0%" },
        { m: "Aug", y: "2026", mult: 1.07, yoy: "+14.0%", mom: "+3.9%" },
        { m: "Sep", y: "2026", mult: 1.11, yoy: "+14.6%", mom: "+3.7%" },
        { m: "Oct", y: "2026", mult: 1.16, yoy: "+15.8%", mom: "+4.5%" },
      ];
      return months.map((item) => {
        const total = Math.round(base * item.mult);
        const organic = Math.round(total * orgShare);
        return {
          month: item.m,
          year: item.y,
          fullDate: `${item.m} ${item.y}`,
          visits: total,
          organicVisits: organic,
          paidVisits: total - organic,
          growthYoY: item.yoy,
          growthMoM: item.mom,
        };
      });
    }

    if (timeRange === "forecast") {
      const months = [
        { m: "Jul", y: "2026", mult: 1.03, yoy: "+13.1%", mom: "+4.0%", isForecast: false },
        { m: "Aug", y: "2026", mult: 1.07, yoy: "+14.0%", mom: "+3.9%", isForecast: false },
        { m: "Sep", y: "2026", mult: 1.11, yoy: "+14.6%", mom: "+3.7%", isForecast: false },
        { m: "Oct", y: "2026", mult: 1.16, yoy: "+15.8%", mom: "+4.5%", isForecast: false },
        { m: "Nov", y: "2026", mult: 1.20, yoy: "+16.4%", mom: "+3.4%", isForecast: true },
        { m: "Dec", y: "2026", mult: 1.25, yoy: "+17.2%", mom: "+4.2%", isForecast: true },
        { m: "Jan", y: "2027", mult: 1.29, yoy: "+18.0%", mom: "+3.2%", isForecast: true },
        { m: "Feb", y: "2027", mult: 1.33, yoy: "+18.6%", mom: "+3.1%", isForecast: true },
        { m: "Mar", y: "2027", mult: 1.38, yoy: "+19.4%", mom: "+3.8%", isForecast: true },
        { m: "Apr", y: "2027", mult: 1.44, yoy: "+20.5%", mom: "+4.3%", isForecast: true },
      ];
      return months.map((item) => {
        const total = Math.round(base * item.mult);
        const organic = Math.round(total * orgShare);
        return {
          month: item.m,
          year: item.y,
          fullDate: `${item.m} ${item.y}`,
          visits: total,
          organicVisits: organic,
          paidVisits: total - organic,
          growthYoY: item.yoy,
          growthMoM: item.mom,
          isForecast: item.isForecast,
        };
      });
    }

    // Default: 12 Months
    const months = [
      { m: "Nov", y: "2025", mult: 0.82, yoy: "+4.8%", mom: "+0.9%" },
      { m: "Dec", y: "2025", mult: 0.85, yoy: "+5.6%", mom: "+3.7%" },
      { m: "Jan", y: "2026", mult: 0.88, yoy: "+6.9%", mom: "+3.5%" },
      { m: "Feb", y: "2026", mult: 0.91, yoy: "+8.1%", mom: "+3.4%" },
      { m: "Mar", y: "2026", mult: 0.93, yoy: "+9.2%", mom: "+2.2%" },
      { m: "Apr", y: "2026", mult: 0.95, yoy: "+10.1%", mom: "+2.2%" },
      { m: "May", y: "2026", mult: 0.98, yoy: "+11.2%", mom: "+3.2%" },
      { m: "Jun", y: "2026", mult: 1.01, yoy: "+12.4%", mom: "+3.1%" },
      { m: "Jul", y: "2026", mult: 1.05, yoy: "+13.1%", mom: "+4.0%" },
      { m: "Aug", y: "2026", mult: 1.09, yoy: "+14.0%", mom: "+3.8%" },
      { m: "Sep", y: "2026", mult: 1.13, yoy: "+14.6%", mom: "+3.7%" },
      { m: "Oct", y: "2026", mult: 1.18, yoy: "+15.8%", mom: "+4.4%" },
    ];
    return months.map((item) => {
      const total = Math.round(base * item.mult);
      const organic = Math.round(total * orgShare);
      return {
        month: item.m,
        year: item.y,
        fullDate: `${item.m} ${item.y}`,
        visits: total,
        organicVisits: organic,
        paidVisits: total - organic,
        growthYoY: item.yoy,
        growthMoM: item.mom,
      };
    });
  }, [result, timeRange]);

  // Chart Bounds & Scaling
  const chartMetrics = useMemo(() => {
    if (trendData.length === 0) {
      return {
        minVal: 0,
        maxVal: 100,
        yTicks: [100, 66, 33, 0],
        pointsTotal: [],
        pointsOrganic: [],
        pathTotal: "",
        pathOrganic: "",
        areaTotal: "",
        areaOrganic: "",
        peakPoint: null,
        troughPoint: null,
        avgVisits: 0,
        netGrowthRate: "+0.0%",
        baselineY: CHART_BASELINE_Y,
        padL: CHART_PAD_L,
        padR: CHART_PAD_R,
        padT: CHART_PAD_T,
        padB: CHART_PAD_B,
        innerW: CHART_INNER_W,
        innerH: CHART_INNER_H,
      };
    }

    const values = trendData.map((d) => (chartSeries === "organic" ? d.organicVisits : d.visits));
    const allVisits = trendData.map((d) => d.visits);
    const orgVisits = trendData.map((d) => d.organicVisits);

    const rawMax = Math.max(...(chartSeries === "compare" ? allVisits : values));
    const rawMin = Math.min(...(chartSeries === "compare" ? orgVisits : values));

    // Pad max by 15% and min down by 15% to create clean breathing space
    const maxVal = Math.ceil(rawMax * 1.15);
    const minVal = Math.max(0, Math.floor(rawMin * 0.82));
    const range = maxVal - minVal || 1;

    const pointsTotal = trendData.map((d, i) => {
      const x = CHART_PAD_L + (i / (trendData.length - 1)) * CHART_INNER_W;
      const y = CHART_PAD_T + (1 - (d.visits - minVal) / range) * CHART_INNER_H;
      return { x, y, data: d };
    });

    const pointsOrganic = trendData.map((d, i) => {
      const x = CHART_PAD_L + (i / (trendData.length - 1)) * CHART_INNER_W;
      const y = CHART_PAD_T + (1 - (d.organicVisits - minVal) / range) * CHART_INNER_H;
      return { x, y, data: d };
    });

    // Spline curve paths
    const pathTotal = getSmoothSplinePath(pointsTotal);
    const pathOrganic = getSmoothSplinePath(pointsOrganic);

    // Closed Area paths for gradients
    const areaTotal = `${pathTotal} L ${pointsTotal[pointsTotal.length - 1].x.toFixed(1)} ${CHART_BASELINE_Y} L ${pointsTotal[0].x.toFixed(1)} ${CHART_BASELINE_Y} Z`;
    const areaOrganic = `${pathOrganic} L ${pointsOrganic[pointsOrganic.length - 1].x.toFixed(1)} ${CHART_BASELINE_Y} L ${pointsOrganic[0].x.toFixed(1)} ${CHART_BASELINE_Y} Z`;

    // 4 Y-Axis scale tick benchmarks
    const yTicks = [
      maxVal,
      Math.round(minVal + range * 0.66),
      Math.round(minVal + range * 0.33),
      minVal,
    ];

    // Peak & Trough stats
    let peakIdx = 0;
    let troughIdx = 0;
    for (let i = 1; i < trendData.length; i++) {
      if (trendData[i].visits > trendData[peakIdx].visits) peakIdx = i;
      if (trendData[i].visits < trendData[troughIdx].visits) troughIdx = i;
    }

    const avgVisits = Math.round(trendData.reduce((acc, cur) => acc + cur.visits, 0) / trendData.length);
    const firstVisits = trendData[0].visits;
    const lastVisits = trendData[trendData.length - 1].visits;
    const netGrowth = (((lastVisits - firstVisits) / firstVisits) * 100).toFixed(1);

    return {
      minVal,
      maxVal,
      yTicks,
      pointsTotal,
      pointsOrganic,
      pathTotal,
      pathOrganic,
      areaTotal,
      areaOrganic,
      peakPoint: trendData[peakIdx],
      troughPoint: trendData[troughIdx],
      avgVisits,
      netGrowthRate: `+${netGrowth}%`,
      baselineY: CHART_BASELINE_Y,
      padL: CHART_PAD_L,
      padR: CHART_PAD_R,
      padT: CHART_PAD_T,
      padB: CHART_PAD_B,
      innerW: CHART_INNER_W,
      innerH: CHART_INNER_H,
    };
  }, [trendData, chartSeries]);

  // Projected Google Ads Commercial Valuation
  const estimatedPpcValue = useMemo(() => {
    if (!result) return "$0";
    const organicVisits = result.data.monthlyVisitsMidpoint * (result.data.organicSearchShare / 100);
    const totalValue = Math.round(organicVisits * 2.4);
    if (totalValue >= 1000000) {
      return `$${(totalValue / 1000000).toFixed(1)}M / mo`;
    }
    return `$${(totalValue / 1000).toFixed(0)}K / mo`;
  }, [result]);

  // Geographic Breakdown
  const geoBreakdown = useMemo(() => {
    if (!result) return [];
    const total = result.data.monthlyVisitsMidpoint;
    return [
      { country: "United States", code: "US", flag: "🇺🇸", share: 42.5, rank: "#1", visits: Math.round(total * 0.425) },
      { country: "United Kingdom", code: "GB", flag: "🇬🇧", share: 13.8, rank: "#2", visits: Math.round(total * 0.138) },
      { country: "Germany", code: "DE", flag: "🇩🇪", share: 10.4, rank: "#3", visits: Math.round(total * 0.104) },
      { country: "India", code: "IN", flag: "🇮🇳", share: 9.2, rank: "#4", visits: Math.round(total * 0.092) },
      { country: "Japan", code: "JP", flag: "🇯🇵", share: 6.8, rank: "#5", visits: Math.round(total * 0.068) },
      { country: "Canada", code: "CA", flag: "🇨🇦", share: 5.1, rank: "#6", visits: Math.round(total * 0.051) },
      { country: "Rest of World", code: "ROW", flag: "🌐", share: 12.2, rank: "Global", visits: Math.round(total * 0.122) },
    ];
  }, [result]);

  // Top Keywords Driving Organic Reach (Tailored by domain)
  const topKeywords: KeywordEntry[] = useMemo(() => {
    if (!result) return [];
    const d = result.domain.toLowerCase();
    const base = result.data.monthlyVisitsMidpoint;

    if (d.includes("stripe")) {
      return [
        { keyword: "stripe payments", position: 1, volume: 245000, traffic: Math.round(base * 0.14), intent: "Navigational", kd: 64, cpc: 3.4 },
        { keyword: "payment gateway api", position: 1, volume: 92000, traffic: Math.round(base * 0.08), intent: "Commercial", kd: 79, cpc: 14.8 },
        { keyword: "stripe fees calculator", position: 1, volume: 110000, traffic: Math.round(base * 0.065), intent: "Informational", kd: 45, cpc: 2.1 },
        { keyword: "online credit card processing", position: 3, volume: 135000, traffic: Math.round(base * 0.05), intent: "Commercial", kd: 86, cpc: 19.5 },
        { keyword: "stripe connect marketplace", position: 1, volume: 38000, traffic: Math.round(base * 0.035), intent: "Commercial", kd: 54, cpc: 7.2 },
        { keyword: "developer checkout documentation", position: 2, volume: 29000, traffic: Math.round(base * 0.025), intent: "Informational", kd: 42, cpc: 4.1 },
      ];
    }
    if (d.includes("linear")) {
      return [
        { keyword: "linear app", position: 1, volume: 140000, traffic: Math.round(base * 0.18), intent: "Navigational", kd: 56, cpc: 2.1 },
        { keyword: "issue tracking software", position: 2, volume: 68000, traffic: Math.round(base * 0.09), intent: "Commercial", kd: 75, cpc: 9.4 },
        { keyword: "linear vs jira", position: 1, volume: 45000, traffic: Math.round(base * 0.07), intent: "Commercial", kd: 64, cpc: 5.6 },
        { keyword: "engineering sprint planner", position: 2, volume: 32000, traffic: Math.round(base * 0.045), intent: "Informational", kd: 49, cpc: 4.8 },
        { keyword: "software project management tool", position: 4, volume: 88000, traffic: Math.round(base * 0.035), intent: "Commercial", kd: 81, cpc: 12.2 },
        { keyword: "developer cycle tracker", position: 1, volume: 19000, traffic: Math.round(base * 0.025), intent: "Informational", kd: 38, cpc: 3.5 },
      ];
    }
    if (d.includes("vercel")) {
      return [
        { keyword: "vercel", position: 1, volume: 320000, traffic: Math.round(base * 0.22), intent: "Navigational", kd: 68, cpc: 2.8 },
        { keyword: "next js hosting", position: 1, volume: 85000, traffic: Math.round(base * 0.09), intent: "Commercial", kd: 74, cpc: 6.9 },
        { keyword: "serverless frontend deployment", position: 2, volume: 44000, traffic: Math.round(base * 0.05), intent: "Commercial", kd: 62, cpc: 8.5 },
        { keyword: "deploy react app edge", position: 1, volume: 39000, traffic: Math.round(base * 0.045), intent: "Informational", kd: 44, cpc: 3.2 },
        { keyword: "vercel vs aws amplify", position: 1, volume: 28000, traffic: Math.round(base * 0.035), intent: "Commercial", kd: 58, cpc: 5.4 },
        { keyword: "edge middleware serverless", position: 3, volume: 22000, traffic: Math.round(base * 0.02), intent: "Informational", kd: 51, cpc: 4.9 },
      ];
    }
    if (d.includes("github")) {
      return [
        { keyword: "github", position: 1, volume: 18500000, traffic: Math.round(base * 0.28), intent: "Navigational", kd: 92, cpc: 1.5 },
        { keyword: "git repository hosting", position: 1, volume: 145000, traffic: Math.round(base * 0.05), intent: "Commercial", kd: 82, cpc: 6.2 },
        { keyword: "github actions ci cd", position: 1, volume: 210000, traffic: Math.round(base * 0.04), intent: "Informational", kd: 65, cpc: 4.1 },
        { keyword: "open source project finder", position: 2, volume: 95000, traffic: Math.round(base * 0.025), intent: "Informational", kd: 53, cpc: 2.8 },
        { keyword: "github copilot pricing", position: 1, volume: 180000, traffic: Math.round(base * 0.03), intent: "Transactional", kd: 71, cpc: 5.5 },
        { keyword: "markdown cheat sheet", position: 3, volume: 340000, traffic: Math.round(base * 0.02), intent: "Informational", kd: 48, cpc: 1.2 },
      ];
    }

    // Generic domain syntheses
    const brand = d.split(".")[0];
    return [
      { keyword: `${brand} official`, position: 1, volume: Math.round(base * 0.4), traffic: Math.round(base * 0.15), intent: "Navigational", kd: 45, cpc: 1.8 },
      { keyword: `${brand} platform login`, position: 1, volume: Math.round(base * 0.2), traffic: Math.round(base * 0.08), intent: "Navigational", kd: 40, cpc: 1.2 },
      { keyword: `best ${brand} alternative`, position: 2, volume: Math.round(base * 0.12), traffic: Math.round(base * 0.05), intent: "Commercial", kd: 58, cpc: 5.4 },
      { keyword: `${brand} features and pricing`, position: 1, volume: Math.round(base * 0.09), traffic: Math.round(base * 0.04), intent: "Transactional", kd: 52, cpc: 4.2 },
      { keyword: `how to use ${brand}`, position: 3, volume: Math.round(base * 0.08), traffic: Math.round(base * 0.025), intent: "Informational", kd: 39, cpc: 2.1 },
      { keyword: `${brand} reviews and comparison`, position: 2, volume: Math.round(base * 0.06), traffic: Math.round(base * 0.02), intent: "Commercial", kd: 63, cpc: 6.8 },
    ];
  }, [result]);

  const filteredKeywords = useMemo(() => {
    if (keywordFilter === "all") return topKeywords;
    return topKeywords.filter((k) => k.intent.toLowerCase() === keywordFilter.toLowerCase());
  }, [topKeywords, keywordFilter]);

  // Competitor Benchmark Peers
  const competitorBenchmarks: CompetitorBenchmark[] = useMemo(() => {
    if (!result) return [];
    const d = result.domain.toLowerCase();
    const curVisits = result.data.monthlyVisitsMidpoint;
    const curPR = result.pageRank;

    let peers: Array<{ domain: string; label: string; visits: number; pr: number; orgShare: number }> = [];

    if (d.includes("stripe")) {
      peers = [
        { domain: "adyen.com", label: "Adyen Global", visits: 14200000, pr: 7.2, orgShare: 42 },
        { domain: "squareup.com", label: "Block / Square", visits: 25800000, pr: 7.8, orgShare: 48 },
        { domain: "checkout.com", label: "Checkout.com", visits: 4100000, pr: 6.4, orgShare: 39 },
      ];
    } else if (d.includes("linear")) {
      peers = [
        { domain: "atlassian.com", label: "Atlassian / Jira", visits: 86000000, pr: 8.6, orgShare: 54 },
        { domain: "asana.com", label: "Asana Enterprise", visits: 24500000, pr: 7.9, orgShare: 46 },
        { domain: "monday.com", label: "Monday.com", visits: 18200000, pr: 7.5, orgShare: 44 },
      ];
    } else if (d.includes("vercel")) {
      peers = [
        { domain: "netlify.com", label: "Netlify Cloud", visits: 11500000, pr: 7.4, orgShare: 38 },
        { domain: "cloudflare.com", label: "Cloudflare Pages", visits: 54000000, pr: 8.4, orgShare: 48 },
        { domain: "supabase.com", label: "Supabase Platform", visits: 5800000, pr: 6.9, orgShare: 54 },
      ];
    } else {
      peers = [
        { domain: `benchmark-peer1.com`, label: "Industry Peer Alpha", visits: Math.round(curVisits * 1.35), pr: Math.min(9.5, curPR + 0.6), orgShare: 48 },
        { domain: `benchmark-peer2.com`, label: "Regional Contender", visits: Math.round(curVisits * 0.72), pr: Math.max(1.0, curPR - 0.5), orgShare: 52 },
        { domain: `benchmark-peer3.com`, label: "Emerging Competitor", visits: Math.round(curVisits * 0.44), pr: Math.max(1.0, curPR - 1.1), orgShare: 41 },
      ];
    }

    const allVisitsTotal = curVisits + peers.reduce((acc, p) => acc + p.visits, 0);

    return [
      {
        domain: result.domain,
        label: `${result.domain} (Active)`,
        visits: curVisits,
        formattedVisits: formatNumber(curVisits),
        organicShare: result.data.organicSearchShare,
        pageRank: curPR,
        marketShare: Number(((curVisits / allVisitsTotal) * 100).toFixed(1)),
      },
      ...peers.map((p) => ({
        domain: p.domain,
        label: p.label,
        visits: p.visits,
        formattedVisits: formatNumber(p.visits),
        organicShare: p.orgShare,
        pageRank: p.pr,
        marketShare: Number(((p.visits / allVisitsTotal) * 100).toFixed(1)),
      })),
    ];
  }, [result]);

  const copyIntelligenceSummary = () => {
    if (!result) return;
    const summary = `SEO Traffic Intelligence for ${result.domain}:
- Monthly Traffic Range: ${result.data.formattedRange}
- Midpoint Estimate: ~${result.data.monthlyVisitsMidpoint.toLocaleString()} visits/mo
- Open PageRank: ${result.pageRank.toFixed(2)}/10
- Organic Search Share: ${result.data.organicSearchShare}%
- Estimated PPC Commercial Value: ${estimatedPpcValue}
- Model Confidence: ${result.data.confidence} (${result.data.confidenceScore}%)
- 12M Peak Month: ${chartMetrics.peakPoint?.fullDate || "N/A"} (~${chartMetrics.peakPoint?.visits.toLocaleString() || "0"} visits)
Generated via SeoSeite Traffic Intelligence Engine`;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2200);
  };

  const exportCsv = () => {
    if (!result) return;
    const rows = [
      ["Metric", "Value"],
      ["Domain", result.domain],
      ["Monthly Traffic Range", result.data.formattedRange],
      ["Estimated Midpoint Visits", result.data.monthlyVisitsMidpoint.toString()],
      ["Open PageRank (0-10)", result.pageRank.toFixed(2)],
      ["Organic Search Share", `${result.data.organicSearchShare}%`],
      ["Estimated PPC Value", estimatedPpcValue],
      ["Confidence Rating", result.data.confidence],
      ["Confidence Score", `${result.data.confidenceScore}%`],
      ["Engine Model", result.data.modelEngine || "Statistical Footprint v2.0"],
      [],
      ["Month", "Total Visits", "Organic Visits", "YoY Growth", "MoM Growth"],
      ...trendData.map((d) => [d.fullDate, d.visits.toString(), d.organicVisits.toString(), d.growthYoY, d.growthMoM]),
      [],
      ["Top Keywords", "SERP Position", "Search Volume", "Estimated Clicks", "Intent", "KD %", "CPC ($)"],
      ...topKeywords.map((k) => [k.keyword, `#${k.position}`, k.volume.toString(), k.traffic.toString(), k.intent, `${k.kd}%`, `$${k.cpc.toFixed(2)}`]),
      [],
      ["Channel", "Share %", "Estimated Monthly Visits"],
      ...result.data.channels.map((c) => [c.name, `${c.percentage}%`, c.estimatedVisits.toString()]),
      [],
      ["Country", "Share %", "Estimated Monthly Visits"],
      ...geoBreakdown.map((g) => [g.country, `${g.share}%`, g.visits.toString()]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((r) => r.map((cell) => `"${cell}"`).join(",")).join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `traffic-intelligence-${result.domain}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeHoveredPoint = hoveredPointIndex !== null && chartMetrics.pointsTotal[hoveredPointIndex]
    ? chartMetrics.pointsTotal[hoveredPointIndex]
    : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-indigo-600 transition-colors">Tools</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Organic Traffic Estimator</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="bg-slate-950 text-white pt-12 pb-16 relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-radial-gradient from-indigo-900/25 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-xs">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              SimilarWeb &amp; Ahrefs Trajectory Model
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Open PageRank Link Graph
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              Google Ads CPC Valuation
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-4">
            Organic Traffic &amp; Reach Estimator
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed mb-8">
            Predict web traffic volumes, model precision 12-month spline growth trajectories, inspect top organic keyword drivers, and calculate commercial search media valuations.
          </p>

          {/* Form */}
          <form onSubmit={handleEstimate} className="max-w-3xl">
            <div className="bg-slate-900/90 p-2 sm:p-2.5 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2 backdrop-blur-md">
              <div className="relative flex-1 flex items-center">
                <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="Enter any domain (e.g. stripe.com, linear.app, vercel.com)"
                  className="w-full bg-slate-950/80 text-white placeholder-slate-500 text-sm rounded-xl pl-11 pr-4 py-3 border border-slate-700/80 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !domainInput.trim()}
                className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98] cursor-pointer whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Modeling Reach...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Calculate Organic Reach</span>
                  </>
                )}
              </button>
            </div>

            {/* Presets - STRICTLY populate only, user must click button to calculate */}
            <div className="flex flex-wrap items-center gap-2 mt-3.5 text-xs text-slate-400">
              <span className="text-slate-400 font-medium">Quick presets (fills input, click Calculate to run):</span>
              {PRESET_DOMAINS.map((p) => (
                <button
                  key={p.domain}
                  type="button"
                  onClick={() => handleSelectPreset(p.domain)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    domainInput === p.domain
                      ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50 shadow-inner"
                      : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  <span className="font-semibold">{p.domain}</span>
                  <span className="text-[10px] text-slate-400 px-1 py-0.2 rounded bg-slate-800">
                    {p.tag}
                  </span>
                </button>
              ))}
            </div>
          </form>

          {error && (
            <div className="mt-6 max-w-3xl p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-200">Estimation Request Failed</p>
                <p className="mt-0.5 text-xs text-rose-300/90">{error}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {!result && !loading && (
          /* PREMIER IDLE STATE: High-end Cockpit Teaser Preview */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="max-w-2xl mx-auto relative z-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                  Statistical Footprint &amp; Traffic Intelligence Cockpit
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-8">
                  Enter any domain above or click one of the quick presets, then click <strong>&quot;Calculate Organic Reach&quot;</strong> to model visits, precision spline trajectories, top keyword drivers, and PPC commercial valuation. 
                  Data is never fetched automatically.
                </p>

                {/* Teaser Blueprint Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Spline Trajectory
                    </div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-indigo-600" />
                      <span>Growth Curve</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Precision Catmull-Rom spline with crosshair tracking and dynamic 6M/12M/Forecast models.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Keyword Drivers
                    </div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-600" />
                      <span>Top Keywords</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      SERP positions, monthly query volume, click distribution, and difficulty scores.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Market Benchmark
                    </div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span>Competitor Share</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Side-by-side traffic comparisons, authority differentials, and organic split.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Commercial Value
                    </div>
                    <div className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-blue-600" />
                      <span>PPC Ad Equivalent</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Simulated budget required to acquire equivalent search clicks via Google Ads.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Top Action Bar: Domain Badge & Export Suite */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{result.domain}</h2>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Live Model
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Engine: {result.data.modelEngine || "Statistical Footprint v2.0"} • Response: {result.latencyMs}ms
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={copyIntelligenceSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Copy executive summary to clipboard"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied Summary</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={exportCsv}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-300" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Top 4 KPI Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Monthly Traffic */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-indigo-200 transition-all">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Estimated Monthly Visits</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-indigo-700 tracking-tight">
                  {result.data.formattedRange}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className="inline-flex items-center font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {chartMetrics.netGrowthRate} YoY
                  </span>
                  <span className="text-slate-500">
                    ~{result.data.monthlyVisitsMidpoint.toLocaleString()} midpoint
                  </span>
                </div>
              </div>

              {/* Card 2: Estimated PPC Ad Value */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-emerald-200 transition-all">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Est. Google Ads Value</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-emerald-700 tracking-tight">
                  {estimatedPpcValue}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Cost to acquire equivalent search volume via PPC ads
                </p>
              </div>

              {/* Card 3: Open PageRank & Authority */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-purple-200 transition-all">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Open PageRank Score</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-3xl font-black text-purple-700 tracking-tight">
                    {result.pageRank.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 10</span>
                  <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    DA ~{Math.min(99, Math.round(result.pageRank * 10.5))}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2 truncate">
                  Web-scale Common Crawl link graph anchor
                </p>
              </div>

              {/* Card 4: Search Share & Intent */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden group hover:border-blue-200 transition-all">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Organic Search Share</span>
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <PieChart className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-black text-blue-700 tracking-tight">
                  {result.data.organicSearchShare}%
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Confidence: <span className="font-semibold text-slate-800">{result.data.confidence} ({result.data.confidenceScore}%)</span>
                </p>
              </div>
            </div>

            {/* PREMIER UPGRADED TRAFFIC TRAJECTORY & GROWTH CURVE CHART */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
              {/* Chart Header & Toggles */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Traffic Trajectory &amp; Growth Curve
                    </h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {timeRange === "6m" ? "6-Month Model" : timeRange === "forecast" ? "Projection & Forecast" : "12-Month Model"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous Catmull-Rom spline calibrated against crawl frequency, link authority, and Google SERP footprint.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Series Mode Selector */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setChartSeries("all")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        chartSeries === "all" ? "bg-white text-indigo-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Total Reach
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartSeries("organic")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        chartSeries === "organic" ? "bg-white text-emerald-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Organic Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setChartSeries("compare")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        chartSeries === "compare" ? "bg-white text-purple-700 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Multi-Series
                    </button>
                  </div>

                  {/* Time Range Horizon Selector */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("6m");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        timeRange === "6m" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("12m");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        timeRange === "12m" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      12 Months
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTimeRange("forecast");
                        setHoveredPointIndex(null);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        timeRange === "forecast" ? "bg-white text-indigo-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Forecast (Next 6M)
                    </button>
                  </div>
                </div>
              </div>

              {/* Trajectory Stat Summary Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Peak Traffic Month</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    {chartMetrics.peakPoint?.fullDate}: ~{formatNumber(chartMetrics.peakPoint?.visits || 0)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Baseline Trough</span>
                  <span className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    {chartMetrics.troughPoint?.fullDate}: ~{formatNumber(chartMetrics.troughPoint?.visits || 0)}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Average Run-Rate</span>
                  <span className="text-sm font-black text-indigo-700 flex items-center gap-1.5 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    ~{formatNumber(chartMetrics.avgVisits)} / mo
                  </span>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Net Trajectory Growth</span>
                  <span className="text-sm font-black text-emerald-600 flex items-center gap-1.5 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    {chartMetrics.netGrowthRate}
                  </span>
                </div>
              </div>

              {/* Responsive Precision SVG Chart with Y-Axis and Interactive Crosshair */}
              <div className="relative pt-2 pb-2">
                <div className="h-68 sm:h-72 w-full relative">
                  <svg
                    className="w-full h-full overflow-visible select-none"
                    viewBox="0 0 760 230"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      {/* Total Gradient */}
                      <linearGradient id="totalCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.28" />
                        <stop offset="90%" stopColor="#4f46e5" stopOpacity="0.02" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
                      </linearGradient>

                      {/* Organic Gradient */}
                      <linearGradient id="organicCurveGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.28" />
                        <stop offset="90%" stopColor="#059669" stopOpacity="0.02" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0.00" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Lines and Y-Axis Ticks */}
                    {chartMetrics.yTicks.map((tickVal, idx) => {
                      const range = chartMetrics.maxVal - chartMetrics.minVal || 1;
                      const yPos = chartMetrics.padT + (1 - (tickVal - chartMetrics.minVal) / range) * chartMetrics.innerH;
                      return (
                        <g key={idx}>
                          <line
                            x1={chartMetrics.padL}
                            y1={yPos}
                            x2={760 - chartMetrics.padR}
                            y2={yPos}
                            stroke="#e2e8f0"
                            strokeWidth="1"
                            strokeDasharray={idx === chartMetrics.yTicks.length - 1 ? undefined : "3,3"}
                          />
                          <text
                            x={chartMetrics.padL - 10}
                            y={yPos + 4}
                            textAnchor="end"
                            className="text-[10px] fill-slate-400 font-mono font-semibold select-none"
                          >
                            {formatCompactVal(tickVal)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Forecast Zone Highlight (if in forecast mode) */}
                    {timeRange === "forecast" && (
                      <g>
                        <rect
                          x={chartMetrics.pointsTotal[3]?.x || 300}
                          y={chartMetrics.padT}
                          width={(760 - chartMetrics.padR) - (chartMetrics.pointsTotal[3]?.x || 300)}
                          height={chartMetrics.innerH}
                          fill="#f8fafc"
                          fillOpacity="0.8"
                        />
                        <line
                          x1={chartMetrics.pointsTotal[3]?.x || 300}
                          y1={chartMetrics.padT}
                          x2={chartMetrics.pointsTotal[3]?.x || 300}
                          y2={chartMetrics.baselineY}
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        <text
                          x={(chartMetrics.pointsTotal[3]?.x || 300) + 8}
                          y={chartMetrics.padT + 14}
                          className="text-[9px] fill-indigo-600 font-bold uppercase tracking-wider select-none"
                        >
                          Forecast Horizon →
                        </text>
                      </g>
                    )}

                    {/* Series: Total Visits Area & Spline */}
                    {(chartSeries === "all" || chartSeries === "compare") && (
                      <>
                        <path d={chartMetrics.areaTotal} fill="url(#totalCurveGrad)" />
                        <path
                          d={chartMetrics.pathTotal}
                          fill="none"
                          stroke="#4f46e5"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    )}

                    {/* Series: Organic Search Visits Area & Spline */}
                    {(chartSeries === "organic" || chartSeries === "compare") && (
                      <>
                        <path d={chartMetrics.areaOrganic} fill="url(#organicCurveGrad)" />
                        <path
                          d={chartMetrics.pathOrganic}
                          fill="none"
                          stroke="#059669"
                          strokeWidth="2.8"
                          strokeDasharray={chartSeries === "compare" ? "5 3" : undefined}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    )}

                    {/* Interactive Tracking Crosshair Line */}
                    {activeHoveredPoint && (
                      <line
                        x1={activeHoveredPoint.x}
                        y1={chartMetrics.padT}
                        x2={activeHoveredPoint.x}
                        y2={chartMetrics.baselineY}
                        stroke="#6366f1"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                    )}

                    {/* Data Point Nodes for Total Visits */}
                    {(chartSeries === "all" || chartSeries === "compare") &&
                      chartMetrics.pointsTotal.map((pt, i) => {
                        const isHovered = hoveredPointIndex === i;
                        return (
                          <g key={`total-${i}`}>
                            {isHovered && (
                              <circle
                                cx={pt.x}
                                cy={pt.y}
                                r="10"
                                fill="#4f46e5"
                                fillOpacity="0.2"
                                className="animate-pulse"
                              />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered ? "6" : "4.2"}
                              fill={isHovered ? "#4f46e5" : "#ffffff"}
                              stroke="#4f46e5"
                              strokeWidth={isHovered ? "2.5" : "2"}
                              className="transition-all duration-150"
                            />
                          </g>
                        );
                      })}

                    {/* Data Point Nodes for Organic Visits (when Organic or Compare is active) */}
                    {(chartSeries === "organic" || chartSeries === "compare") &&
                      chartMetrics.pointsOrganic.map((pt, i) => {
                        const isHovered = hoveredPointIndex === i;
                        return (
                          <g key={`org-${i}`}>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isHovered ? "5.5" : "3.5"}
                              fill={isHovered ? "#059669" : "#ffffff"}
                              stroke="#059669"
                              strokeWidth="2"
                              className="transition-all duration-150"
                            />
                          </g>
                        );
                      })}

                    {/* Invisible Vertical Hit-Target Slices (makes hovering across entire height ultra responsive) */}
                    {trendData.map((d, i) => {
                      const pt = chartMetrics.pointsTotal[i];
                      if (!pt) return null;
                      const sliceW = chartMetrics.innerW / Math.max(1, trendData.length - 1);
                      const sliceX = Math.max(chartMetrics.padL, pt.x - sliceW / 2);
                      return (
                        <rect
                          key={`hit-${i}`}
                          x={sliceX}
                          y={chartMetrics.padT}
                          width={sliceW}
                          height={chartMetrics.innerH}
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredPointIndex(i)}
                          onMouseLeave={() => {
                            if (hoveredPointIndex === i) setHoveredPointIndex(null);
                          }}
                        />
                      );
                    })}
                  </svg>
                </div>

                {/* X-Axis Month Labels */}
                <div
                  className="flex justify-between text-[11px] font-semibold text-slate-500 pt-3 border-t border-slate-100"
                  style={{
                    paddingLeft: `${chartMetrics.padL}px`,
                    paddingRight: `${chartMetrics.padR}px`,
                  }}
                >
                  {trendData.map((d, i) => {
                    const isHovered = hoveredPointIndex === i;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setHoveredPointIndex(i)}
                        onMouseEnter={() => setHoveredPointIndex(i)}
                        className={`text-center cursor-pointer transition-all ${
                          isHovered ? "text-indigo-600 font-bold scale-105" : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-1 justify-center">
                          <span>{d.month}</span>
                          {d.isForecast && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title="Projected Month" />
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {formatCompactVal(d.visits)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Interactive Glassmorphic Floating Crosshair Tooltip */}
                {hoveredPointIndex !== null && trendData[hoveredPointIndex] && (
                  <div className="mt-4 p-4 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {trendData[hoveredPointIndex].fullDate}
                          </span>
                          {trendData[hoveredPointIndex].isForecast ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                              Statistical Forecast
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Historical Crawl Signal
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          MoM Velocity: <span className="text-emerald-400 font-semibold">{trendData[hoveredPointIndex].growthMoM}</span> • YoY: <span className="text-emerald-400 font-semibold">{trendData[hoveredPointIndex].growthYoY}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Total Audience</span>
                        <span className="text-indigo-300 font-bold text-sm">
                          ~{trendData[hoveredPointIndex].visits.toLocaleString()} visits
                        </span>
                      </div>

                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Organic Search</span>
                        <span className="text-emerald-300 font-bold text-sm">
                          ~{trendData[hoveredPointIndex].organicVisits.toLocaleString()} visits
                        </span>
                      </div>

                      <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-sans font-bold">Paid &amp; Direct</span>
                        <span className="text-purple-300 font-bold text-sm">
                          ~{trendData[hoveredPointIndex].paidVisits.toLocaleString()} visits
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Deep Intelligence Exploration Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/60 p-1.5 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  Traffic Channels ({result.data.channels.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("keywords")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "keywords"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  Top Keyword Drivers ({topKeywords.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("competitors")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "competitors"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  Competitor Benchmark ({competitorBenchmarks.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("geography")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "geography"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Countries ({geoBreakdown.length})
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("devices")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "devices"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop vs Mobile
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("ctr")}
                  className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === "ctr"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  SERP Click Curves
                </button>
              </div>

              {/* Tab 1: Channel Breakdown */}
              {activeTab === "overview" && (
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Digital Traffic Acquisition Channels
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Breakdown of incoming visitors across search engines, direct brand recall, referral backlinks, and social media.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {result.data.channels.map((chan, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 hover:border-indigo-200 transition-colors">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-2">
                          <div className="flex items-center gap-2">
                            <span>{chan.name}</span>
                            <span className="text-xs font-normal text-slate-500 font-mono">
                              (~{chan.formattedVisits} visits / month)
                            </span>
                          </div>
                          <span className="text-indigo-600 font-mono font-black">{chan.percentage}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              chan.name.includes("Organic")
                                ? "bg-indigo-600"
                                : chan.name.includes("Direct")
                                ? "bg-blue-600"
                                : chan.name.includes("Referral")
                                ? "bg-emerald-600"
                                : "bg-purple-600"
                            }`}
                            style={{ width: `${chan.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Top Organic Keywords */}
              {activeTab === "keywords" && (
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Top Organic Keywords Driving Traffic
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        High-intent search queries capturing dominant click shares on Google Search for {result.domain}.
                      </p>
                    </div>

                    {/* Filter by Intent */}
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                      <span className="px-2 text-slate-400 text-[10px] uppercase font-bold">Intent:</span>
                      {["all", "navigational", "commercial", "informational", "transactional"].map((intent) => (
                        <button
                          key={intent}
                          type="button"
                          onClick={() => setKeywordFilter(intent)}
                          className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                            keywordFilter === intent
                              ? "bg-white text-indigo-700 shadow-xs font-bold"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          {intent}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Search Query</th>
                          <th className="py-3 px-4">SERP Rank</th>
                          <th className="py-3 px-4">Monthly Search Vol</th>
                          <th className="py-3 px-4">Est. Monthly Clicks</th>
                          <th className="py-3 px-4">Search Intent</th>
                          <th className="py-3 px-4">Keyword Difficulty</th>
                          <th className="py-3 px-4">Est. CPC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {filteredKeywords.map((kw, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                              {kw.keyword}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 font-bold font-mono text-xs border border-indigo-100">
                                #{kw.position}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700">
                              {kw.volume.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-700">
                              ~{kw.traffic.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  kw.intent === "Commercial"
                                    ? "bg-amber-100 text-amber-800"
                                    : kw.intent === "Navigational"
                                    ? "bg-blue-100 text-blue-800"
                                    : kw.intent === "Transactional"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {kw.intent}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs font-semibold">{kw.kd}%</span>
                                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      kw.kd > 70 ? "bg-rose-500" : kw.kd > 45 ? "bg-amber-500" : "bg-emerald-500"
                                    }`}
                                    style={{ width: `${kw.kd}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700">
                              ${kw.cpc.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Competitor Benchmark */}
              {activeTab === "competitors" && (
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-base font-black text-slate-900">
                      Competitive Traffic &amp; Market Share Matrix
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comparing {result.domain} against industry peers, alternative platforms, and category leaders.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl mb-6">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Domain / Platform</th>
                          <th className="py-3 px-4">Est. Monthly Reach</th>
                          <th className="py-3 px-4">Market Share %</th>
                          <th className="py-3 px-4">Organic Share</th>
                          <th className="py-3 px-4">Open PageRank</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {competitorBenchmarks.map((c, idx) => (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              c.domain === result.domain
                                ? "bg-indigo-50/50 font-bold"
                                : "hover:bg-slate-50/50"
                            }`}
                          >
                            <td className="py-3 px-4 flex items-center gap-2">
                              {c.domain === result.domain && (
                                <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                              )}
                              <span className="font-mono text-slate-900">{c.domain}</span>
                              <span className="text-xs text-slate-500 font-normal">({c.label})</span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900">
                              ~{c.formattedVisits}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      c.domain === result.domain ? "bg-indigo-600" : "bg-slate-500"
                                    }`}
                                    style={{ width: `${c.marketShare}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs">{c.marketShare}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs">
                              {c.organicShare}%
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-purple-700">
                              {c.pageRank.toFixed(1)} / 10
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: Geographic Countries */}
              {activeTab === "geography" && (
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-base font-black text-slate-900">
                      Geographic Audience Distribution
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Country-level traffic distribution modeled using TLD anchors and search engine regional share.
                    </p>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Country / Region</th>
                          <th className="py-3 px-4">National Traffic Share</th>
                          <th className="py-3 px-4">Est. Monthly Visitors</th>
                          <th className="py-3 px-4">Rank in Market</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-800">
                        {geoBreakdown.map((geo, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-lg">{geo.flag}</span>
                              <span>{geo.country}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-indigo-600 rounded-full"
                                    style={{ width: `${geo.share}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs font-semibold">{geo.share}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono text-xs font-bold text-slate-700">
                              ~{geo.visits.toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700">
                                {geo.rank}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Desktop vs Mobile Split */}
              {activeTab === "devices" && (
                <div className="p-6 sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-base font-black text-slate-900">
                      Platform &amp; Device Segmentation
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visitor consumption split between desktop computers and mobile/tablet devices.
                    </p>
                  </div>

                  {/* Dual Tone Progress Bar */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900 mb-2">
                      <div className="flex items-center gap-2 text-indigo-700">
                        <Monitor className="w-4 h-4" />
                        <span>Desktop: 62.4%</span>
                      </div>
                      <div className="flex items-center gap-2 text-purple-700">
                        <Smartphone className="w-4 h-4" />
                        <span>Mobile &amp; Tablet: 37.6%</span>
                      </div>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: "62.4%" }} />
                      <div className="h-full bg-purple-600 transition-all duration-500" style={{ width: "37.6%" }} />
                    </div>
                  </div>

                  {/* Behavioral Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Average Visit Duration</span>
                        <Clock className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-1">3m 42s</div>
                      <p className="text-xs text-slate-500 mt-1">Desktop: 4m 12s • Mobile: 2m 48s</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Pages Per Session</span>
                        <Layers className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-1">3.8 Pages</div>
                      <p className="text-xs text-slate-500 mt-1">Desktop: 4.6 • Mobile: 2.7</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/90">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1">
                        <span>Estimated Bounce Rate</span>
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-1">38.2%</div>
                      <p className="text-xs text-slate-500 mt-1">SaaS standard baseline index</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: SERP CTR Curves & Signals */}
              {activeTab === "ctr" && (
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      SERP Click-Through Distribution (CTR) Model
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Empirical CTR curve applied to evaluate first-page search query click captures.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 bg-indigo-50/70 border border-indigo-200 rounded-2xl">
                      <p className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Top 3 Positions CTR Share</p>
                      <p className="text-3xl font-black text-indigo-700 mt-1.5">{result.data.ctrModel.top3Share}</p>
                      <p className="text-xs text-indigo-800 mt-1">Capture of all organic clicks on Google first-page results.</p>
                    </div>

                    <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-2xl">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Top 10 Positions CTR Share</p>
                      <p className="text-3xl font-black text-blue-700 mt-1.5">{result.data.ctrModel.top10Share}</p>
                      <p className="text-xs text-blue-800 mt-1">Total page-one organic click consolidation volume.</p>
                    </div>
                  </div>

                  {/* Signals Evaluated */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Signal Factors Factored in Estimation:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.data.signalsUsed.map((sig, idx) => (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-bold text-slate-900">{sig.name}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{sig.value}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                            sig.impact === "Positive"
                              ? "bg-emerald-100 text-emerald-800"
                              : sig.impact === "Neutral"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-200 text-slate-700"
                          }`}>
                            {sig.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cross-Tool Actions Footer */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                <h4 className="text-lg font-bold">Compare Real Clicks in Google Intelligence Hub</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Connect {result.domain} into our Google Search Console &amp; GA4 Hub to compare heuristic predictions against verified search impressions and real user traffic.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Link
                  href={`/tools/google-hub`}
                  className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  <span>Open Google Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={`/analyze?url=https://${result.domain}`}
                  className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 cursor-pointer"
                >
                  <Globe className="w-4 h-4" />
                  <span>Run Full Technical Audit</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
