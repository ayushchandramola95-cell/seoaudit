import * as cheerio from "cheerio";
import dns from "dns/promises";

export type TechCategory =
  | "Frontend Framework"
  | "CMS & Site Builder"
  | "CMS"
  | "CSS & UI Framework"
  | "CSS Framework"
  | "CDN & Infrastructure"
  | "Analytics & Telemetry"
  | "E-Commerce & Payments"
  | "Web Server & Gateway"
  | "Web Server"
  | "Marketing & Communication"
  | "Security & Performance"
  | "DNS & Cloud Services"
  | "JavaScript Library";

export interface DetectedTechnology {
  name: string;
  category: TechCategory;
  version: string | null;
  confidence: "High" | "Medium";
  evidence: string;
  website?: string;
  description?: string;
}

export interface TechSignature {
  name: string;
  category: TechCategory;
  website?: string;
  description?: string;
  headers?: Array<{ name: string; pattern?: RegExp; versionCapture?: RegExp }>;
  meta?: Array<{ name?: string; property?: string; pattern: RegExp; versionCapture?: RegExp }>;
  scripts?: RegExp[];
  htmlPatterns?: RegExp[];
  domSelectors?: string[];
}

export interface StackRisk {
  severity: "high" | "medium" | "low" | "good";
  title: string;
  description: string;
  recommendation: string;
}

export interface StackOptimization {
  title: string;
  category: string;
  impact: "High" | "Medium" | "Quick Win";
  description: string;
}

export interface SecurityHeaderCheck {
  header: string;
  value: string | null;
  status: "pass" | "warn" | "fail";
  description: string;
}

export const TECH_SIGNATURES: TechSignature[] = [
  // --------------------------------------------------------------------------
  // Frontend Frameworks & Libraries
  // --------------------------------------------------------------------------
  {
    name: "Next.js",
    category: "Frontend Framework",
    website: "https://nextjs.org",
    description: "React framework for high-performance server-side rendering and static web apps.",
    headers: [{ name: "x-powered-by", pattern: /next\.js/i }, { name: "x-nextjs-cache" }],
    scripts: [/_next\/static\//i],
    domSelectors: ["#__next", "script#__NEXT_DATA__"],
    htmlPatterns: [/__next/i, /_next\/static/i, /window\.__NEXT_DATA__/i],
  },
  {
    name: "React",
    category: "Frontend Framework",
    website: "https://react.dev",
    description: "The core JavaScript library for building component-driven user interfaces.",
    domSelectors: ["[data-reactroot]", "[data-reactid]"],
    scripts: [/react(\.production|\.development)?(\.min)?\.js/i, /react-dom/i],
    htmlPatterns: [/data-reactroot/i, /__reactFiber/i, /_reactListening/i, /react\.development\.js/i],
  },
  {
    name: "Vue.js",
    category: "Frontend Framework",
    website: "https://vuejs.org",
    description: "Progressive JavaScript framework for building user interfaces.",
    domSelectors: ["[data-v-]", "[v-cloak]"],
    scripts: [/vue(\.runtime)?(\.min)?\.js/i],
    htmlPatterns: [/data-v-[a-f0-9]{6,8}/i, /Vue\.config/i],
  },
  {
    name: "Nuxt.js",
    category: "Frontend Framework",
    website: "https://nuxt.com",
    description: "The intuitive Vue framework for building universal & static web applications.",
    headers: [{ name: "x-powered-by", pattern: /nuxt/i }],
    domSelectors: ["#__nuxt"],
    scripts: [/_nuxt\//i],
    htmlPatterns: [/__NUXT__/i, /window\.__NUXT__/i],
  },
  {
    name: "Angular",
    category: "Frontend Framework",
    website: "https://angular.dev",
    description: "Google's TypeScript-based web application framework.",
    domSelectors: ["[ng-version]", "[ng-app]"],
    htmlPatterns: [/ng-version="([\d.]+)"/i, /ng-binding/i],
    scripts: [/angular(\.min)?\.js/i],
  },
  {
    name: "Svelte / SvelteKit",
    category: "Frontend Framework",
    website: "https://svelte.dev",
    description: "Cybernetically enhanced web framework that compiles components into vanilla JS.",
    htmlPatterns: [/class="[^"]*svelte-[a-z0-9]+/i, /__sveltekit/i, /svelte-announcer/i],
    scripts: [/svelte/i],
  },
  {
    name: "Remix",
    category: "Frontend Framework",
    website: "https://remix.run",
    description: "Full-stack React framework focused on web standards and modern UX.",
    htmlPatterns: [/window\.__remixContext/i, /__remix/i],
  },
  {
    name: "Astro",
    category: "Frontend Framework",
    website: "https://astro.build",
    description: "Content-focused web framework with zero-JS by default island architecture.",
    meta: [{ name: "generator", pattern: /astro/i, versionCapture: /astro\s+v?([\d.]+)/i }],
    htmlPatterns: [/astro-island/i, /<style astro/i],
  },
  {
    name: "Gatsby",
    category: "Frontend Framework",
    website: "https://gatsbyjs.com",
    description: "Static site generator built on React and GraphQL.",
    meta: [{ name: "generator", pattern: /gatsby/i, versionCapture: /gatsby\s+([\d.]+)/i }],
    domSelectors: ["#___gatsby"],
  },
  {
    name: "HTMX",
    category: "Frontend Framework",
    website: "https://htmx.org",
    description: "Access modern browser features directly from HTML without writing JavaScript.",
    htmlPatterns: [/hx-get=/i, /hx-post=/i, /hx-target=/i, /hx-swap=/i],
    scripts: [/htmx(\.min)?\.js/i],
  },
  {
    name: "Alpine.js",
    category: "Frontend Framework",
    website: "https://alpinejs.dev",
    description: "Lightweight reactive JavaScript framework for declaring behavior right in markup.",
    htmlPatterns: [/x-data=/i, /x-init=/i, /x-show=/i, /x-bind=/i],
    scripts: [/alpine(\.min)?\.js/i],
  },
  {
    name: "jQuery",
    category: "JavaScript Library",
    website: "https://jquery.com",
    description: "Legacy JavaScript DOM manipulation and event handling library.",
    scripts: [/jquery(-[\d.]+)?(\.min)?\.js/i, /code\.jquery\.com/i],
    htmlPatterns: [/jQuery\s+v([\d.]+)/i, /\$\.fn\.jquery/i],
  },

  // --------------------------------------------------------------------------
  // CMS & Site Builders
  // --------------------------------------------------------------------------
  {
    name: "WordPress",
    category: "CMS & Site Builder",
    website: "https://wordpress.org",
    description: "Open-source CMS powering over 40% of the web.",
    meta: [{ name: "generator", pattern: /wordpress/i, versionCapture: /wordpress\s+([\d.]+)/i }],
    scripts: [/wp-content\//i, /wp-includes\//i],
    htmlPatterns: [/wp-content\//i, /class="[^"]*wp-block-/i, /wp-json\//i],
  },
  {
    name: "Shopify",
    category: "CMS & Site Builder",
    website: "https://shopify.com",
    description: "Global cloud commerce platform for direct-to-consumer online stores.",
    headers: [{ name: "x-shopify-stage" }, { name: "x-shopid" }],
    scripts: [/cdn\.shopify\.com/i, /shopify\.com\/s\/files/i],
    htmlPatterns: [/Shopify\.theme/i, /cdn\.shopify\.com/i, /ShopifyAnalytics/i],
  },
  {
    name: "Webflow",
    category: "CMS & Site Builder",
    website: "https://webflow.com",
    description: "Visual web design CMS and hosting platform for modern marketing sites.",
    meta: [{ name: "generator", pattern: /webflow/i }],
    htmlPatterns: [/data-wf-page/i, /assets\.website-files\.com/i, /data-wf-site/i],
  },
  {
    name: "Framer",
    category: "CMS & Site Builder",
    website: "https://framer.com",
    description: "Design-first website builder with responsive layout engine and edge publishing.",
    meta: [{ name: "generator", pattern: /framer/i }],
    htmlPatterns: [/framer-motion/i, /__framer__/i, /events\.framer\.com/i],
    scripts: [/framerusercontent\.com/i],
  },
  {
    name: "Ghost",
    category: "CMS & Site Builder",
    website: "https://ghost.org",
    description: "Independent modern publishing platform for creators and journalism.",
    meta: [{ name: "generator", pattern: /ghost\s*([\d.]+)?/i, versionCapture: /ghost\s+([\d.]+)/i }],
    htmlPatterns: [/ghost-foot/i, /class="[^"]*ghost-/i],
  },
  {
    name: "Drupal",
    category: "CMS & Site Builder",
    website: "https://drupal.org",
    description: "Enterprise open-source content management system.",
    headers: [{ name: "x-drupal-cache" }, { name: "x-generator", pattern: /drupal/i }],
    meta: [{ name: "generator", pattern: /drupal\s*([\d.]+)?/i, versionCapture: /drupal\s+([\d.]+)/i }],
    scripts: [/drupal\.js/i, /sites\/default\/files/i],
  },
  {
    name: "Wix",
    category: "CMS & Site Builder",
    website: "https://wix.com",
    description: "Cloud-based website creation and business management platform.",
    scripts: [/static\.parastorage\.com/i, /wix-code/i, /wix-warmup-data/i],
    htmlPatterns: [/static\.wixstatic\.com/i, /_wixCID/i],
  },
  {
    name: "Squarespace",
    category: "CMS & Site Builder",
    website: "https://squarespace.com",
    description: "All-in-one website building and e-commerce platform.",
    scripts: [/static1\.squarespace\.com/i],
    htmlPatterns: [/static1\.squarespace\.com/i, /Squarespace\.Constants/i],
  },
  {
    name: "HubSpot CMS",
    category: "CMS & Site Builder",
    website: "https://hubspot.com",
    description: "CRM-powered CMS designed for inbound marketing and enterprise lead generation.",
    scripts: [/js\.hs-scripts\.com/i, /hs-analytics/i],
    htmlPatterns: [/hubspot-messages-iframe-container/i, /hs-banner/i],
  },
  {
    name: "Sanity.io",
    category: "CMS & Site Builder",
    website: "https://sanity.io",
    description: "Composable content cloud with structured real-time content studio.",
    scripts: [/cdn\.sanity\.io/i],
    htmlPatterns: [/cdn\.sanity\.io\/images/i],
  },
  {
    name: "Contentful",
    category: "CMS & Site Builder",
    website: "https://contentful.com",
    description: "Enterprise headless content platform with omnichannel API delivery.",
    scripts: [/cdn\.contentful\.com/i],
    htmlPatterns: [/images\.ctfassets\.net/i],
  },

  // --------------------------------------------------------------------------
  // CSS & UI Frameworks
  // --------------------------------------------------------------------------
  {
    name: "Tailwind CSS",
    category: "CSS & UI Framework",
    website: "https://tailwindcss.com",
    description: "Utility-first CSS framework for rapid modern UI development.",
    scripts: [/cdn\.tailwindcss\.com/i],
    htmlPatterns: [/class="[^"]*(flex|grid|items-center|justify-between|text-slate-|bg-slate-|rounded-xl)/i],
  },
  {
    name: "Bootstrap",
    category: "CSS & UI Framework",
    website: "https://getbootstrap.com",
    description: "Popular responsive CSS and JavaScript UI toolkit.",
    scripts: [/bootstrap(\.bundle)?(\.min)?\.js/i],
    htmlPatterns: [/class="[^"]*(container-fluid|navbar-toggler|btn-primary|col-md-)/i],
  },
  {
    name: "Radix UI",
    category: "CSS & UI Framework",
    website: "https://radix-ui.com",
    description: "Unstyled, accessible UI components for React and modern design systems.",
    htmlPatterns: [/data-radix-/i, /radix-ui/i],
  },
  {
    name: "Material UI (MUI)",
    category: "CSS & UI Framework",
    website: "https://mui.com",
    description: "React component library implementing Google's Material Design.",
    htmlPatterns: [/class="[^"]*Mui[A-Z][a-zA-Z]+-root/i, /mui-style/i],
  },

  // --------------------------------------------------------------------------
  // CDN & Cloud Infrastructure
  // --------------------------------------------------------------------------
  {
    name: "Cloudflare",
    category: "CDN & Infrastructure",
    website: "https://cloudflare.com",
    description: "Global edge network offering DDoS mitigation, CDN caching, and edge workers.",
    headers: [
      { name: "cf-ray" },
      { name: "server", pattern: /cloudflare/i },
      { name: "cf-cache-status" },
      { name: "cf-mitigated" },
    ],
  },
  {
    name: "Vercel",
    category: "CDN & Infrastructure",
    website: "https://vercel.com",
    description: "Frontend cloud platform providing fast global serverless and edge deployment.",
    headers: [
      { name: "x-vercel-id" },
      { name: "x-vercel-cache" },
      { name: "server", pattern: /vercel/i },
    ],
  },
  {
    name: "Amazon CloudFront",
    category: "CDN & Infrastructure",
    website: "https://aws.amazon.com/cloudfront",
    description: "AWS content delivery network for secure, low-latency asset distribution.",
    headers: [{ name: "x-amz-cf-id" }, { name: "x-amz-cf-pop" }, { name: "via", pattern: /cloudfront/i }],
  },
  {
    name: "Fastly",
    category: "CDN & Infrastructure",
    website: "https://fastly.com",
    description: "Edge cloud platform with programmable Varnish caching and compute.",
    headers: [{ name: "x-fastly-request-id" }, { name: "fastly-debug-digest" }, { name: "x-served-by", pattern: /cache-/i }],
  },
  {
    name: "Netlify",
    category: "CDN & Infrastructure",
    website: "https://netlify.com",
    description: "Composable web platform for serverless websites and Jamstack applications.",
    headers: [{ name: "x-nf-request-id" }, { name: "server", pattern: /netlify/i }],
  },
  {
    name: "Akamai",
    category: "CDN & Infrastructure",
    website: "https://akamai.com",
    description: "Enterprise content delivery network and cybersecurity cloud platform.",
    headers: [{ name: "x-akamai-transformed" }, { name: "x-cache", pattern: /akamai/i }, { name: "server", pattern: /akamaighost/i }],
  },
  {
    name: "Google Cloud",
    category: "CDN & Infrastructure",
    website: "https://cloud.google.com",
    description: "Google Cloud Platform infrastructure and load balancing.",
    headers: [{ name: "via", pattern: /google/i }, { name: "x-goog-stored-content-encoding" }],
  },

  // --------------------------------------------------------------------------
  // Analytics, Telemetry & Marketing Pixels
  // --------------------------------------------------------------------------
  {
    name: "Google Analytics 4 (GA4)",
    category: "Analytics & Telemetry",
    website: "https://analytics.google.com",
    description: "Google's next-generation event-based web and app analytics platform.",
    scripts: [/googletagmanager\.com\/gtag\/js\?id=G-/i, /google-analytics\.com\/analytics\.js/i],
    htmlPatterns: [/gtag\('config',\s*'G-[A-Z0-9]+'\)/i, /ga\('create'/i],
  },
  {
    name: "Google Tag Manager",
    category: "Analytics & Telemetry",
    website: "https://tagmanager.google.com",
    description: "Tag management system allowing rapid deployment of measurement tags.",
    scripts: [/googletagmanager\.com\/gtm\.js/i],
    htmlPatterns: [/googletagmanager\.com\/ns\.html\?id=GTM-/i],
  },
  {
    name: "Meta Pixel (Facebook)",
    category: "Analytics & Telemetry",
    website: "https://facebook.com/business",
    description: "Tracking pixel for measuring and optimizing Facebook & Instagram advertising.",
    scripts: [/connect\.facebook\.net\/[a-zA-Z_]+\/fbevents\.js/i],
    htmlPatterns: [/fbq\('init'/i],
  },
  {
    name: "LinkedIn Insight Tag",
    category: "Analytics & Telemetry",
    website: "https://business.linkedin.com",
    description: "Conversion tracking, retargeting, and audience demographics for B2B campaigns.",
    scripts: [/snap\.licdn\.com\/li\.lms-analytics\/insight\.min\.js/i],
    htmlPatterns: [/_linkedin_partner_id/i],
  },
  {
    name: "PostHog",
    category: "Analytics & Telemetry",
    website: "https://posthog.com",
    description: "Open-source product analytics, session replay, and feature flag suite.",
    scripts: [/app\.posthog\.com\/static\/array\.js/i, /us\.i\.posthog\.com/i],
    htmlPatterns: [/posthog\.init\(/i],
  },
  {
    name: "Hotjar",
    category: "Analytics & Telemetry",
    website: "https://hotjar.com",
    description: "Behavior analytics, user heatmaps, and feedback recording tool.",
    scripts: [/static\.hotjar\.com\/c\/hotjar-/i],
    htmlPatterns: [/_hjSettings/i],
  },
  {
    name: "Microsoft Clarity",
    category: "Analytics & Telemetry",
    website: "https://clarity.microsoft.com",
    description: "Free user behavior analytics with clickmaps, scrollmaps, and session replays.",
    scripts: [/www\.clarity\.ms\/tag\//i],
    htmlPatterns: [/clarity\("set"/i],
  },
  {
    name: "Segment",
    category: "Analytics & Telemetry",
    website: "https://segment.com",
    description: "Customer data platform for collecting and routing event telemetry.",
    scripts: [/cdn\.segment\.com\/analytics\.js/i],
    htmlPatterns: [/analytics\.load\(/i],
  },
  {
    name: "Sentry",
    category: "Analytics & Telemetry",
    website: "https://sentry.io",
    description: "Application performance monitoring and real-time crash error tracking.",
    scripts: [/browser\.sentry-cdn\.com/i],
    htmlPatterns: [/Sentry\.init\(/i, /sentry\.io\/api\//i],
  },

  // --------------------------------------------------------------------------
  // E-Commerce & Payments
  // --------------------------------------------------------------------------
  {
    name: "Stripe",
    category: "E-Commerce & Payments",
    website: "https://stripe.com",
    description: "Global financial infrastructure for online payments, billing, and payouts.",
    scripts: [/js\.stripe\.com\/v3/i],
    htmlPatterns: [/Stripe\('pk_/i, /js\.stripe\.com/i],
  },
  {
    name: "PayPal",
    category: "E-Commerce & Payments",
    website: "https://paypal.com",
    description: "Online payment processor supporting digital wallets and credit card transactions.",
    scripts: [/paypal\.com\/sdk\/js/i],
    htmlPatterns: [/paypal-button/i],
  },
  {
    name: "WooCommerce",
    category: "E-Commerce & Payments",
    website: "https://woocommerce.com",
    description: "Customizable open-source eCommerce platform built on WordPress.",
    meta: [{ name: "generator", pattern: /woocommerce/i, versionCapture: /woocommerce\s+([\d.]+)/i }],
    htmlPatterns: [/woocommerce/i, /class="[^"]*woocommerce/i],
  },

  // --------------------------------------------------------------------------
  // Web Server & Gateways
  // --------------------------------------------------------------------------
  {
    name: "Nginx",
    category: "Web Server & Gateway",
    website: "https://nginx.org",
    description: "High-performance HTTP server, reverse proxy, and load balancer.",
    headers: [{ name: "server", pattern: /nginx/i, versionCapture: /nginx\/([\d.]+)/i }],
  },
  {
    name: "Apache HTTP Server",
    category: "Web Server & Gateway",
    website: "https://httpd.apache.org",
    description: "Long-standing open-source HTTP web server software.",
    headers: [{ name: "server", pattern: /apache/i, versionCapture: /apache\/([\d.]+)/i }],
  },
  {
    name: "LiteSpeed",
    category: "Web Server & Gateway",
    website: "https://litespeedtech.com",
    description: "High-performance Apache replacement server optimized for PHP caching.",
    headers: [{ name: "server", pattern: /litespeed/i }],
  },
  {
    name: "Caddy",
    category: "Web Server & Gateway",
    website: "https://caddyserver.com",
    description: "Fast, modern web server written in Go with automatic HTTPS by default.",
    headers: [{ name: "server", pattern: /caddy/i }],
  },

  // --------------------------------------------------------------------------
  // Marketing & Customer Communication
  // --------------------------------------------------------------------------
  {
    name: "Intercom",
    category: "Marketing & Communication",
    website: "https://intercom.com",
    description: "AI-first customer service platform, messenger, and support helpdesk.",
    scripts: [/widget\.intercom\.io/i],
    htmlPatterns: [/window\.Intercom\(/i],
  },
  {
    name: "Zendesk",
    category: "Marketing & Communication",
    website: "https://zendesk.com",
    description: "Enterprise customer service and ticketing software.",
    scripts: [/static\.zdassets\.com/i],
    htmlPatterns: [/zE\('webWidget'/i],
  },
  {
    name: "Crisp",
    category: "Marketing & Communication",
    website: "https://crisp.chat",
    description: "All-in-one customer messaging platform with live chat and knowledge base.",
    scripts: [/client\.crisp\.chat/i],
    htmlPatterns: [/\$crisp\.push/i],
  },

  // --------------------------------------------------------------------------
  // Security & Performance Shields
  // --------------------------------------------------------------------------
  {
    name: "Cloudflare Turnstile",
    category: "Security & Performance",
    website: "https://cloudflare.com/products/turnstile",
    description: "Privacy-preserving CAPTCHA replacement providing seamless bot verification.",
    scripts: [/challenges\.cloudflare\.com\/turnstile/i],
    htmlPatterns: [/class="[^"]*cf-turnstile/i],
  },
  {
    name: "Google reCAPTCHA",
    category: "Security & Performance",
    website: "https://google.com/recaptcha",
    description: "Fraud prevention and bot protection service by Google.",
    scripts: [/google\.com\/recaptcha/i, /gstatic\.com\/recaptcha/i],
    htmlPatterns: [/g-recaptcha/i],
  },
  {
    name: "HSTS Enforced",
    category: "Security & Performance",
    website: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security",
    description: "HTTP Strict Transport Security header forcing browsers to use HTTPS.",
    headers: [{ name: "strict-transport-security" }],
  },
  {
    name: "Content Security Policy (CSP)",
    category: "Security & Performance",
    website: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP",
    description: "Header restricting script sources to protect against cross-site scripting (XSS).",
    headers: [{ name: "content-security-policy" }],
  },
];

/**
 * Inspects public DNS records (NS, MX, TXT) to discover enterprise infrastructure.
 * Returns both detected technologies and the raw record lists.
 */
export async function inspectDnsInfrastructure(domain: string): Promise<{
  detected: DetectedTechnology[];
  rawRecords: { ns: string[]; mx: string[]; txt: string[] };
}> {
  const detected: DetectedTechnology[] = [];
  const cleanDomain = domain.replace(/^www\./, "").toLowerCase();
  let nsRecords: string[] = [];
  let mxRecords: { exchange: string; priority: number }[] = [];
  let txtRecords: string[][] = [];

  try {
    const nsPromise = dns.resolveNs(cleanDomain).catch(() => []);
    const mxPromise = dns.resolveMx(cleanDomain).catch(() => []);
    const txtPromise = dns.resolveTxt(cleanDomain).catch(() => []);

    [nsRecords, mxRecords, txtRecords] = await Promise.all([nsPromise, mxPromise, txtPromise]);

    const nsJoined = nsRecords.join(" ").toLowerCase();
    const mxJoined = mxRecords.map((m) => m.exchange).join(" ").toLowerCase();
    const txtJoined = txtRecords.map((t) => (Array.isArray(t) ? t.join(" ") : t)).join(" ").toLowerCase();

    // DNS: Cloudflare Nameservers
    if (nsJoined.includes("cloudflare.com")) {
      detected.push({
        name: "Cloudflare DNS",
        category: "DNS & Cloud Services",
        version: null,
        confidence: "High",
        evidence: `NS record: ${nsRecords[0]}`,
        website: "https://cloudflare.com",
        description: "Fast Anycast authoritative DNS service managed by Cloudflare.",
      });
    }

    // DNS: AWS Route 53
    if (nsJoined.includes("awsdns-") || nsJoined.includes("amazon.com")) {
      detected.push({
        name: "AWS Route 53",
        category: "DNS & Cloud Services",
        version: null,
        confidence: "High",
        evidence: `NS record: ${nsRecords[0]}`,
        website: "https://aws.amazon.com/route53",
        description: "Scalable and highly available Cloud DNS service by Amazon Web Services.",
      });
    }

    // Email: Google Workspace
    if (mxJoined.includes("google.com") || mxJoined.includes("googlemail.com") || txtJoined.includes("_spf.google.com")) {
      detected.push({
        name: "Google Workspace (Gmail)",
        category: "DNS & Cloud Services",
        version: null,
        confidence: "High",
        evidence: "MX/TXT record points to Google Mail servers",
        website: "https://workspace.google.com",
        description: "Enterprise email and productivity suite hosted by Google.",
      });
    }

    // Email: Microsoft 365
    if (mxJoined.includes("outlook.com") || txtJoined.includes("spf.protection.outlook.com")) {
      detected.push({
        name: "Microsoft 365 (Exchange)",
        category: "DNS & Cloud Services",
        version: null,
        confidence: "High",
        evidence: "MX record points to Outlook Protection server",
        website: "https://microsoft.com/microsoft-365",
        description: "Microsoft cloud email hosting and security services.",
      });
    }

    // Transactional Email: SendGrid
    if (txtJoined.includes("sendgrid.net") || txtJoined.includes("sendgrid")) {
      detected.push({
        name: "Twilio SendGrid",
        category: "Marketing & Communication",
        version: null,
        confidence: "High",
        evidence: "TXT record contains SendGrid SPF authorization",
        website: "https://sendgrid.com",
        description: "Cloud-based customer communication platform for transactional email.",
      });
    }

    // Domain Verification: Stripe
    if (txtJoined.includes("stripe-verification") || txtJoined.includes("stripe")) {
      detected.push({
        name: "Stripe Domain Verification",
        category: "E-Commerce & Payments",
        version: null,
        confidence: "High",
        evidence: "TXT record verifies merchant ownership on Stripe",
        website: "https://stripe.com",
        description: "Stripe merchant domain authentication for Apple Pay & financial gateways.",
      });
    }
  } catch {
    // Non-blocking DNS inspection failure
  }

  const flattenedTxt = txtRecords.map((t) => (Array.isArray(t) ? t.join(" ") : String(t)));

  return {
    detected,
    rawRecords: {
      ns: nsRecords,
      mx: mxRecords.map((m) => `${m.exchange} (Priority: ${m.priority})`),
      txt: flattenedTxt.slice(0, 10),
    },
  };
}

/**
 * Main detection engine scanning raw HTML, headers, and DOM patterns.
 */
export function detectTechnologies(
  rawHtml: string,
  headers: Record<string, string>
): DetectedTechnology[] {
  const detected: Map<string, DetectedTechnology> = new Map();
  const $ = cheerio.load(rawHtml);

  // Collect script sources and inline script contents
  const scriptSources: string[] = [];
  const scriptContents: string[] = [];
  $("script").each((_, el) => {
    const src = $(el).attr("src");
    if (src) scriptSources.push(src);
    const content = $(el).html();
    if (content) scriptContents.push(content);
  });

  const fullScriptsJoined = scriptSources.join("\n") + "\n" + scriptContents.join("\n");

  for (const sig of TECH_SIGNATURES) {
    let matched = false;
    let evidence = "";
    let version: string | null = null;
    let confidence: "High" | "Medium" = "Medium";

    // 1. Check HTTP Headers
    if (sig.headers) {
      for (const h of sig.headers) {
        const headerVal = headers[h.name.toLowerCase()];
        if (headerVal !== undefined) {
          if (!h.pattern || h.pattern.test(headerVal)) {
            matched = true;
            confidence = "High";
            evidence = `HTTP header "${h.name}: ${headerVal}"`;
            if (h.versionCapture) {
              const vMatch = headerVal.match(h.versionCapture);
              if (vMatch && vMatch[1]) version = vMatch[1];
            }
            break;
          }
        }
      }
    }

    // 2. Check Meta tags
    if (!matched && sig.meta) {
      for (const m of sig.meta) {
        let metaVal = "";
        if (m.name) {
          metaVal = $(`meta[name="${m.name}" i]`).attr("content") || "";
        } else if (m.property) {
          metaVal = $(`meta[property="${m.property}" i]`).attr("content") || "";
        }

        if (metaVal && m.pattern.test(metaVal)) {
          matched = true;
          confidence = "High";
          evidence = `<meta name="${m.name || m.property}" content="${metaVal}">`;
          if (m.versionCapture) {
            const vMatch = metaVal.match(m.versionCapture);
            if (vMatch && vMatch[1]) {
              version = vMatch[1];
            }
          }
          break;
        }
      }
    }

    // 3. Check Scripts
    if (!matched && sig.scripts) {
      for (const scriptPat of sig.scripts) {
        for (const src of scriptSources) {
          if (scriptPat.test(src)) {
            matched = true;
            confidence = "High";
            evidence = `Script source: "${src.slice(0, 80)}"`;
            break;
          }
        }
        if (matched) break;
      }
    }

    // 4. Check DOM Selectors
    if (!matched && sig.domSelectors) {
      for (const sel of sig.domSelectors) {
        if ($(sel).length > 0) {
          matched = true;
          confidence = "High";
          evidence = `DOM selector match: "${sel}"`;
          break;
        }
      }
    }

    // 5. Check HTML Patterns
    if (!matched && sig.htmlPatterns) {
      for (const pat of sig.htmlPatterns) {
        if (pat.test(fullScriptsJoined) || pat.test(rawHtml)) {
          matched = true;
          evidence = `Matched HTML signature pattern: ${pat}`;
          break;
        }
      }
    }

    if (matched) {
      detected.set(sig.name, {
        name: sig.name,
        category: sig.category,
        version,
        confidence,
        evidence,
        website: sig.website,
        description: sig.description,
      });
    }
  }

  return Array.from(detected.values());
}

/**
 * Classifies the high-level architecture archetype and computes stack modernness.
 */
export function analyzeArchitecture(
  techs: DetectedTechnology[],
  headers: Record<string, string>,
  statusCode: number
) {
  const names = new Set(techs.map((t) => t.name.toLowerCase()));

  // Determine Archetype
  let archetype = "Hybrid Cloud Infrastructure";
  if (names.has("next.js") || names.has("nuxt.js") || names.has("remix") || names.has("astro") || names.has("svelte / sveltekit")) {
    archetype = "Modern Jamstack / Edge-Rendered";
  } else if (names.has("shopify") || names.has("webflow") || names.has("framer")) {
    archetype = "Composable Headless / Cloud CMS";
  } else if (names.has("wordpress") || names.has("drupal") || names.has("woocommerce")) {
    archetype = "Monolithic CMS & Dynamic SSR";
  } else if (names.has("react") || names.has("vue.js") || names.has("angular")) {
    archetype = "Single Page Application (SPA)";
  }

  // Calculate Modernness Score (0 - 100)
  let score = 55;
  if (archetype === "Modern Jamstack / Edge-Rendered") score += 25;
  if (names.has("tailwind css") || names.has("radix ui")) score += 10;
  if (names.has("vercel") || names.has("cloudflare") || names.has("fastly")) score += 10;
  if (names.has("google analytics 4 (ga4)") || names.has("posthog")) score += 5;
  if (names.has("hsts enforced")) score += 5;

  // Deductions for legacy indicators
  if (names.has("jquery") && !names.has("next.js") && !names.has("react")) score -= 15;
  if (headers["server"] && /apache|microsoft-iis/i.test(headers["server"])) score -= 10;

  const modernnessScore = Math.min(100, Math.max(35, score));

  // Performance Rating
  let performanceTier = "Fast Cloud Delivery";
  if (names.has("vercel") || names.has("cloudflare") || names.has("fastly")) {
    performanceTier = "Elite (Edge Anycast Accelerated)";
  } else if (names.has("amazon cloudfront") || names.has("netlify")) {
    performanceTier = "Global CDN Optimized";
  }

  // Security Posture
  let securityPosture = "Standard Security Shield";
  if (names.has("hsts enforced") && (names.has("cloudflare") || names.has("content security policy (csp)"))) {
    securityPosture = "Enterprise Hardened (HSTS & WAF)";
  } else if (headers["x-powered-by"] || headers["server"]) {
    securityPosture = "Fingerprint Exposed (Server Leaked)";
  }

  return {
    archetype,
    modernnessScore,
    performanceTier,
    securityPosture,
    hasWaf: names.has("cloudflare") || names.has("akamai") || names.has("fastly"),
  };
}

/**
 * Generates security vulnerability risks, optimization opportunities, and security header evaluations.
 */
export function generateStackInsights(
  techs: DetectedTechnology[],
  headers: Record<string, string>
): {
  risks: StackRisk[];
  optimizations: StackOptimization[];
  headerChecks: SecurityHeaderCheck[];
} {
  const risks: StackRisk[] = [];
  const optimizations: StackOptimization[] = [];
  const headerChecks: SecurityHeaderCheck[] = [];

  const names = new Set(techs.map((t) => t.name.toLowerCase()));

  // 1. Server Header Information Disclosure Check
  const serverHeader = headers["server"];
  if (serverHeader) {
    if (/\d+\.\d+/.test(serverHeader)) {
      risks.push({
        severity: "high",
        title: "Exact Server Version Leaked in HTTP Header",
        description: `Header 'server: ${serverHeader}' exposes exact server daemon version, facilitating automated CVE exploit discovery.`,
        recommendation: "Disable server tokens in web server config (e.g. server_tokens off in Nginx, ServerSignature Off in Apache).",
      });
      headerChecks.push({
        header: "Server",
        value: serverHeader,
        status: "fail",
        description: "Reveals exact daemon and version build.",
      });
    } else {
      headerChecks.push({
        header: "Server",
        value: serverHeader,
        status: "warn",
        description: "Generic server header present.",
      });
    }
  } else {
    headerChecks.push({
      header: "Server",
      value: null,
      status: "pass",
      description: "Server header hidden or stripped by reverse proxy.",
    });
  }

  // 2. X-Powered-By Check
  const xpb = headers["x-powered-by"];
  if (xpb) {
    risks.push({
      severity: "medium",
      title: "Backend Technology Disclosed via X-Powered-By",
      description: `Header 'x-powered-by: ${xpb}' reveals application runtime framework to scanners.`,
      recommendation: "Remove X-Powered-By header in application middleware (e.g. app.disable('x-powered-by') in Express).",
    });
    headerChecks.push({
      header: "X-Powered-By",
      value: xpb,
      status: "fail",
      description: "Leaks backend runtime technology.",
    });
  } else {
    headerChecks.push({
      header: "X-Powered-By",
      value: null,
      status: "pass",
      description: "No backend framework disclosure detected.",
    });
  }

  // 3. Strict-Transport-Security (HSTS)
  const hsts = headers["strict-transport-security"];
  if (hsts) {
    headerChecks.push({
      header: "Strict-Transport-Security",
      value: hsts,
      status: "pass",
      description: "Forces HTTPS connections and mitigates SSL-stripping.",
    });
  } else {
    risks.push({
      severity: "medium",
      title: "Missing HTTP Strict Transport Security (HSTS)",
      description: "Browsers may attempt unencrypted HTTP connections before redirecting to HTTPS.",
      recommendation: "Add 'Strict-Transport-Security: max-age=31536000; includeSubDomains; preload' header.",
    });
    headerChecks.push({
      header: "Strict-Transport-Security",
      value: null,
      status: "fail",
      description: "Missing HSTS encryption policy.",
    });
  }

  // 4. Content-Security-Policy (CSP)
  const csp = headers["content-security-policy"];
  if (csp) {
    headerChecks.push({
      header: "Content-Security-Policy",
      value: csp.slice(0, 50) + "...",
      status: "pass",
      description: "Restricts unauthorized script injection and XSS.",
    });
  } else {
    headerChecks.push({
      header: "Content-Security-Policy",
      value: null,
      status: "warn",
      description: "No CSP defined; consider adding nonce-based script policy.",
    });
  }

  // 5. Outdated jQuery Check
  const jquery = techs.find((t) => t.name === "jQuery");
  if (jquery && jquery.version && (jquery.version.startsWith("1.") || jquery.version.startsWith("2."))) {
    risks.push({
      severity: "high",
      title: `Legacy jQuery ${jquery.version} In Use`,
      description: `jQuery v${jquery.version} has documented Cross-Site Scripting (XSS) and prototype pollution vulnerabilities.`,
      recommendation: "Upgrade to jQuery 3.7+ or replace with native modern DOM APIs.",
    });
  }

  // 6. Optimization Opportunities
  if (!names.has("cloudflare") && !names.has("vercel") && !names.has("fastly") && !names.has("amazon cloudfront")) {
    optimizations.push({
      title: "Adopt an Anycast Edge CDN",
      category: "Performance & Latency",
      impact: "High",
      description: "Routing through Cloudflare, Fastly, or CloudFront delivers assets from global edge caches under 30ms.",
    });
  }

  if (names.has("next.js") || names.has("nuxt.js")) {
    optimizations.push({
      title: "Leverage Incremental Static Regeneration (ISR)",
      category: "Framework Architecture",
      impact: "High",
      description: "Combines static edge caching speed with dynamic server revalidation on demand.",
    });
  }

  if (!names.has("cloudflare turnstile") && !names.has("google recaptcha")) {
    optimizations.push({
      title: "Implement Invisible Bot Verification",
      category: "Security & Anti-Scraping",
      impact: "Quick Win",
      description: "Deploy Cloudflare Turnstile to block automated credential stuffing without user friction.",
    });
  }

  if (names.has("google tag manager") && names.has("meta pixel (facebook)")) {
    optimizations.push({
      title: "Consolidate Marketing Pixels via Server-Side GTM",
      category: "Web Vitals / TBT",
      impact: "Medium",
      description: "Move third-party trackers off the main browser thread to reduce Total Blocking Time (TBT).",
    });
  }

  return { risks, optimizations, headerChecks };
}
