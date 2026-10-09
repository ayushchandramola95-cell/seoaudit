import * as cheerio from "cheerio";

export type TechCategory =
  | "CMS"
  | "Frontend Framework"
  | "CSS Framework"
  | "CDN & Infrastructure"
  | "Analytics & Telemetry"
  | "E-Commerce & Payments"
  | "Web Server"
  | "JavaScript Library";

export interface DetectedTechnology {
  name: string;
  category: TechCategory;
  version: string | null;
  confidence: "High" | "Medium";
  evidence: string;
  website?: string;
}

interface TechSignature {
  name: string;
  category: TechCategory;
  website?: string;
  headers?: Array<{ name: string; pattern?: RegExp }>;
  meta?: Array<{ name?: string; property?: string; pattern: RegExp; versionCapture?: RegExp }>;
  scripts?: RegExp[];
  htmlPatterns?: RegExp[];
  domSelectors?: string[];
}

const TECH_SIGNATURES: TechSignature[] = [
  // --------------------------------------------------------------------------
  // CMS & Site Builders
  // --------------------------------------------------------------------------
  {
    name: "WordPress",
    category: "CMS",
    website: "https://wordpress.org",
    meta: [
      { name: "generator", pattern: /wordpress/i, versionCapture: /wordpress\s+([\d.]+)/i },
    ],
    scripts: [/wp-content\//i, /wp-includes\//i],
    htmlPatterns: [/wp-content\//i, /class="[^"]*wp-block-/i],
  },
  {
    name: "Shopify",
    category: "CMS",
    website: "https://shopify.com",
    headers: [{ name: "x-shopify-stage" }, { name: "x-shopid" }],
    scripts: [/cdn\.shopify\.com/i, /shopify\.com\/s\/files/i],
    htmlPatterns: [/Shopify\.theme/i, /cdn\.shopify\.com/i],
  },
  {
    name: "Webflow",
    category: "CMS",
    website: "https://webflow.com",
    meta: [{ name: "generator", pattern: /webflow/i }],
    htmlPatterns: [/data-wf-page/i, /assets\.website-files\.com/i],
  },
  {
    name: "Ghost",
    category: "CMS",
    website: "https://ghost.org",
    meta: [{ name: "generator", pattern: /ghost\s*([\d.]+)?/i, versionCapture: /ghost\s+([\d.]+)/i }],
    htmlPatterns: [/ghost-foot/i, /class="[^"]*ghost-/i],
  },
  {
    name: "Drupal",
    category: "CMS",
    website: "https://drupal.org",
    headers: [{ name: "x-drupal-cache" }, { name: "x-generator", pattern: /drupal/i }],
    meta: [{ name: "generator", pattern: /drupal\s*([\d.]+)?/i, versionCapture: /drupal\s+([\d.]+)/i }],
    scripts: [/drupal\.js/i, /sites\/default\/files/i],
  },
  {
    name: "Wix",
    category: "CMS",
    website: "https://wix.com",
    scripts: [/static\.parastorage\.com/i, /wix-code/i],
    htmlPatterns: [/static\.wixstatic\.com/i],
  },
  {
    name: "Squarespace",
    category: "CMS",
    website: "https://squarespace.com",
    scripts: [/static1\.squarespace\.com/i],
    htmlPatterns: [/static1\.squarespace\.com/i],
  },
  {
    name: "HubSpot CMS",
    category: "CMS",
    website: "https://hubspot.com",
    scripts: [/js\.hs-scripts\.com/i, /hs-analytics/i],
    htmlPatterns: [/hubspot-messages-iframe-container/i],
  },

  // --------------------------------------------------------------------------
  // Frontend Frameworks
  // --------------------------------------------------------------------------
  {
    name: "Next.js",
    category: "Frontend Framework",
    website: "https://nextjs.org",
    headers: [{ name: "x-powered-by", pattern: /next\.js/i }],
    scripts: [/_next\/static\//i],
    domSelectors: ["#__next", "script#__NEXT_DATA__"],
    htmlPatterns: [/__next/i, /_next\/static/i],
  },
  {
    name: "React",
    category: "Frontend Framework",
    website: "https://react.dev",
    domSelectors: ["[data-reactroot]", "[data-reactid]"],
    scripts: [/react(\.production|\.development)?(\.min)?\.js/i],
    htmlPatterns: [/data-reactroot/i, /__reactFiber/i, /_reactListening/i],
  },
  {
    name: "Vue.js",
    category: "Frontend Framework",
    website: "https://vuejs.org",
    domSelectors: ["[data-v-]", "[v-cloak]"],
    scripts: [/vue(\.runtime)?(\.min)?\.js/i],
    htmlPatterns: [/data-v-[a-f0-9]{6,8}/i],
  },
  {
    name: "Nuxt.js",
    category: "Frontend Framework",
    website: "https://nuxt.com",
    headers: [{ name: "x-powered-by", pattern: /nuxt/i }],
    domSelectors: ["#__nuxt"],
    scripts: [/_nuxt\//i],
    htmlPatterns: [/__NUXT__/i],
  },
  {
    name: "Angular",
    category: "Frontend Framework",
    website: "https://angular.dev",
    domSelectors: ["[ng-version]", "[ng-app]"],
    htmlPatterns: [/ng-version="([\d.]+)"/i],
  },
  {
    name: "Svelte / SvelteKit",
    category: "Frontend Framework",
    website: "https://svelte.dev",
    htmlPatterns: [/class="[^"]*svelte-[a-z0-9]+/i, /__sveltekit/i],
  },
  {
    name: "Remix",
    category: "Frontend Framework",
    website: "https://remix.run",
    htmlPatterns: [/window\.__remixContext/i],
  },
  {
    name: "Astro",
    category: "Frontend Framework",
    website: "https://astro.build",
    meta: [{ name: "generator", pattern: /astro/i, versionCapture: /astro\s+v?([\d.]+)/i }],
    htmlPatterns: [/astro-island/i],
  },
  {
    name: "Gatsby",
    category: "Frontend Framework",
    website: "https://gatsbyjs.com",
    meta: [{ name: "generator", pattern: /gatsby/i, versionCapture: /gatsby\s+([\d.]+)/i }],
    domSelectors: ["#___gatsby"],
  },

  // --------------------------------------------------------------------------
  // CSS Frameworks
  // --------------------------------------------------------------------------
  {
    name: "Tailwind CSS",
    category: "CSS Framework",
    website: "https://tailwindcss.com",
    scripts: [/cdn\.tailwindcss\.com/i],
    htmlPatterns: [/class="[^"]*(flex|grid|items-center|justify-between|text-slate-|bg-slate-|rounded-xl)/i],
  },
  {
    name: "Bootstrap",
    category: "CSS Framework",
    website: "https://getbootstrap.com",
    scripts: [/bootstrap(\.bundle)?(\.min)?\.js/i],
    htmlPatterns: [/class="[^"]*(container-fluid|navbar-toggler|btn-primary|col-md-)/i],
  },

  // --------------------------------------------------------------------------
  // CDN & Hosting Infrastructure
  // --------------------------------------------------------------------------
  {
    name: "Cloudflare",
    category: "CDN & Infrastructure",
    website: "https://cloudflare.com",
    headers: [
      { name: "cf-ray" },
      { name: "server", pattern: /cloudflare/i },
      { name: "cf-cache-status" },
    ],
  },
  {
    name: "Vercel",
    category: "CDN & Infrastructure",
    website: "https://vercel.com",
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
    headers: [{ name: "x-amz-cf-id" }, { name: "x-amz-cf-pop" }, { name: "via", pattern: /cloudfront/i }],
  },
  {
    name: "Fastly",
    category: "CDN & Infrastructure",
    website: "https://fastly.com",
    headers: [{ name: "x-fastly-request-id" }, { name: "fastly-debug-digest" }],
  },
  {
    name: "Netlify",
    category: "CDN & Infrastructure",
    website: "https://netlify.com",
    headers: [{ name: "x-nf-request-id" }, { name: "server", pattern: /netlify/i }],
  },

  // --------------------------------------------------------------------------
  // Analytics, Telemetry & Marketing
  // --------------------------------------------------------------------------
  {
    name: "Google Analytics 4 (GA4)",
    category: "Analytics & Telemetry",
    website: "https://analytics.google.com",
    scripts: [/googletagmanager\.com\/gtag\/js\?id=G-/i, /google-analytics\.com\/analytics\.js/i],
    htmlPatterns: [/gtag\('config',\s*'G-[A-Z0-9]+'\)/i],
  },
  {
    name: "Google Tag Manager",
    category: "Analytics & Telemetry",
    website: "https://tagmanager.google.com",
    scripts: [/googletagmanager\.com\/gtm\.js/i],
    htmlPatterns: [/googletagmanager\.com\/ns\.html\?id=GTM-/i],
  },
  {
    name: "Hotjar",
    category: "Analytics & Telemetry",
    website: "https://hotjar.com",
    scripts: [/static\.hotjar\.com\/c\/hotjar-/i],
    htmlPatterns: [/_hjSettings/i],
  },
  {
    name: "Segment",
    category: "Analytics & Telemetry",
    website: "https://segment.com",
    scripts: [/cdn\.segment\.com\/analytics\.js/i],
    htmlPatterns: [/analytics\.load\(/i],
  },
  {
    name: "PostHog",
    category: "Analytics & Telemetry",
    website: "https://posthog.com",
    scripts: [/app\.posthog\.com\/static\/array\.js/i],
    htmlPatterns: [/posthog\.init\(/i],
  },
  {
    name: "Intercom",
    category: "Analytics & Telemetry",
    website: "https://intercom.com",
    scripts: [/widget\.intercom\.io/i],
    htmlPatterns: [/window\.Intercom\(/i],
  },

  // --------------------------------------------------------------------------
  // E-Commerce & Payments
  // --------------------------------------------------------------------------
  {
    name: "Stripe",
    category: "E-Commerce & Payments",
    website: "https://stripe.com",
    scripts: [/js\.stripe\.com\/v3/i],
    htmlPatterns: [/Stripe\('pk_/i],
  },
  {
    name: "PayPal",
    category: "E-Commerce & Payments",
    website: "https://paypal.com",
    scripts: [/paypal\.com\/sdk\/js/i],
  },
  {
    name: "WooCommerce",
    category: "E-Commerce & Payments",
    website: "https://woocommerce.com",
    meta: [{ name: "generator", pattern: /woocommerce/i, versionCapture: /woocommerce\s+([\d.]+)/i }],
    htmlPatterns: [/woocommerce/i, /class="[^"]*woocommerce/i],
  },

  // --------------------------------------------------------------------------
  // Web Server
  // --------------------------------------------------------------------------
  {
    name: "Nginx",
    category: "Web Server",
    website: "https://nginx.org",
    headers: [{ name: "server", pattern: /nginx/i }],
  },
  {
    name: "Apache",
    category: "Web Server",
    website: "https://httpd.apache.org",
    headers: [{ name: "server", pattern: /apache/i }],
  },
  {
    name: "LiteSpeed",
    category: "Web Server",
    website: "https://litespeedtech.com",
    headers: [{ name: "server", pattern: /litespeed/i }],
  },
  {
    name: "Caddy",
    category: "Web Server",
    website: "https://caddyserver.com",
    headers: [{ name: "server", pattern: /caddy/i }],
  },
];

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
          evidence = `DOM element matching selector "${sel}"`;
          break;
        }
      }
    }

    // 5. Check HTML Patterns
    if (!matched && sig.htmlPatterns) {
      for (const pat of sig.htmlPatterns) {
        if (pat.test(fullScriptsJoined) || pat.test(rawHtml)) {
          matched = true;
          evidence = `Matched HTML signature pattern ${pat}`;
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
      });
    }
  }

  // Deduplicate and return as sorted array (high confidence first, then alphabetical)
  return Array.from(detected.values()).sort((a, b) => {
    if (a.confidence === "High" && b.confidence !== "High") return -1;
    if (b.confidence === "High" && a.confidence !== "High") return 1;
    return a.name.localeCompare(b.name);
  });
}
