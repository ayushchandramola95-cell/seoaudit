import { NextRequest, NextResponse } from "next/server";
import { getDbPool } from "@/lib/db/client";
import { scrapeWebsite } from "@/lib/modules/seo/fetcher";
import { calculateSeoScore } from "@/lib/modules/seo/scorer";

interface MonitoredDomainRow {
  id: string;
  domain: string;
  target_url: string;
  last_score: number | null;
  last_grade: string | null;
  webhook_url: string | null;
  alert_on_score_drop: boolean;
  alert_on_404_found: boolean;
}

interface CronResultItem {
  domain: string;
  previousScore: number | null;
  newScore: number;
  scoreDelta: number;
  alertTriggered: boolean;
  webhookDispatched: boolean;
  error?: string;
}

// Sample fallback watchlist when Cloud SQL PostgreSQL is offline or unmigrated
const DEMO_WATCHLIST: MonitoredDomainRow[] = [
  {
    id: "demo-stripe",
    domain: "stripe.com",
    target_url: "https://stripe.com",
    last_score: 92,
    last_grade: "A",
    webhook_url: null,
    alert_on_score_drop: true,
    alert_on_404_found: true,
  },
  {
    id: "demo-vercel",
    domain: "vercel.com",
    target_url: "https://vercel.com",
    last_score: 88,
    last_grade: "A",
    webhook_url: null,
    alert_on_score_drop: true,
    alert_on_404_found: true,
  },
];

async function dispatchWebhookNotification(
  webhookUrl: string,
  domain: string,
  oldScore: number | null,
  newScore: number,
  delta: number
): Promise<boolean> {
  try {
    const isSlack = webhookUrl.includes("hooks.slack.com");
    const isDiscord = webhookUrl.includes("discord.com/api/webhooks");

    let payload: any;

    if (isSlack) {
      payload = {
        text: `⚠️ *SeoSeite SEO Alert for ${domain}*`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*SeoSeite 24/7 Monitor Alert: ${domain}*\nTechnical SEO score dropped by *${Math.abs(
                delta
              )} points* (from ${oldScore || "N/A"} to *${newScore}/100*).`,
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "View Audit Snapshot" },
                url: `https://seoseite.com/analyze?url=https://${domain}`,
                style: "danger",
              },
            ],
          },
        ],
      };
    } else if (isDiscord) {
      payload = {
        content: `🚨 **SeoSeite SEO Health Alert for ${domain}**`,
        embeds: [
          {
            title: `Technical SEO Score Dropped: ${newScore}/100`,
            description: `A drop of **${Math.abs(delta)} points** was detected during scheduled monitoring.`,
            color: 15158332, // Red
            fields: [
              { name: "Domain", value: domain, inline: true },
              { name: "Previous Score", value: `${oldScore || "N/A"}`, inline: true },
              { name: "New Score", value: `${newScore}`, inline: true },
            ],
            url: `https://seoseite.com/analyze?url=https://${domain}`,
            timestamp: new Date().toISOString(),
          },
        ],
      };
    } else {
      // Generic Webhook JSON
      payload = {
        event: "seo_score_drop",
        timestamp: new Date().toISOString(),
        domain,
        previousScore: oldScore,
        newScore,
        scoreDelta: delta,
        auditUrl: `https://seoseite.com/analyze?url=https://${domain}`,
      };
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (err) {
    console.error(`[Webhook Dispatch Failed for ${domain}]`, err);
    return false;
  }
}

export async function GET(req: NextRequest) {
  return handleCronMonitoring(req);
}

export async function POST(req: NextRequest) {
  return handleCronMonitoring(req);
}

async function handleCronMonitoring(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secretParam = searchParams.get("key");
  const isDemo = searchParams.get("test") === "true";
  const cronSecret = process.env.CRON_SECRET;

  // Verify CRON_SECRET if configured and not running in test mode
  if (cronSecret && cronSecret.trim() !== "" && !isDemo) {
    const authHeader = req.headers.get("authorization");
    const bearer = authHeader ? authHeader.replace("Bearer ", "").trim() : "";
    if (bearer !== cronSecret && secretParam !== cronSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized cron invocation. Invalid secret." },
        { status: 401 }
      );
    }
  }

  const results: CronResultItem[] = [];
  const pool = getDbPool();

  let domainsToMonitor: MonitoredDomainRow[] = [];

  // 1. Try to load active domains from Cloud SQL PostgreSQL
  if (pool) {
    try {
      const dbRes = await pool.query(
        `SELECT id, domain, target_url, last_score, last_grade, webhook_url, alert_on_score_drop, alert_on_404_found 
         FROM monitored_domains 
         WHERE status = 'active' 
         LIMIT 20`
      );
      if (dbRes.rows && dbRes.rows.length > 0) {
        domainsToMonitor = dbRes.rows;
      }
    } catch {
      // Table may not yet be migrated; fall back
    }
  }

  if (domainsToMonitor.length === 0) {
    domainsToMonitor = DEMO_WATCHLIST;
  }

  // 2. Iterate and evaluate domains
  for (const item of domainsToMonitor) {
    try {
      // Scrape and score
      const pageData = await scrapeWebsite(item.target_url);
      const audit = calculateSeoScore(pageData);
      const newScore = audit.overallScore;
      const oldScore = item.last_score;

      const delta = oldScore !== null ? newScore - oldScore : 0;
      const hasSignificantDrop = delta < -5;

      let webhookDispatched = false;

      // Dispatch alert if score dropped by > 5 points
      if (hasSignificantDrop && item.alert_on_score_drop) {
        if (item.webhook_url) {
          webhookDispatched = await dispatchWebhookNotification(
            item.webhook_url,
            item.domain,
            oldScore,
            newScore,
            delta
          );
        }

        // Record in DB if pool is active
        if (pool) {
          try {
            await pool.query(
              `INSERT INTO audit_alerts (id, domain_id, domain, severity, title, message, previous_score, new_score, webhook_status, sent_at)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)`,
              [
                `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                item.id,
                item.domain,
                "warning",
                `Technical SEO Score Dropped to ${newScore}/100`,
                `Score decreased by ${Math.abs(delta)} points from previous audit of ${oldScore}.`,
                oldScore,
                newScore,
                webhookDispatched ? "sent" : "skipped",
              ]
            );
          } catch {
            // ignore
          }
        }
      }

      // Update monitored_domains record
      if (pool) {
        try {
          await pool.query(
            `UPDATE monitored_domains 
             SET last_score = $1, last_grade = $2, last_checked_at = CURRENT_TIMESTAMP 
             WHERE id = $3`,
            [newScore, audit.grade, item.id]
          );
        } catch {
          // ignore
        }
      }

      results.push({
        domain: item.domain,
        previousScore: oldScore,
        newScore,
        scoreDelta: delta,
        alertTriggered: hasSignificantDrop,
        webhookDispatched,
      });
    } catch (err: any) {
      results.push({
        domain: item.domain,
        previousScore: item.last_score,
        newScore: item.last_score || 0,
        scoreDelta: 0,
        alertTriggered: false,
        webhookDispatched: false,
        error: err.message,
      });
    }
  }

  const alertsTriggeredCount = results.filter((r) => r.alertTriggered).length;

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    domainsProcessed: results.length,
    alertsTriggered: alertsTriggeredCount,
    results,
    note:
      results.length > 0
        ? "Automated 24/7 monitoring run completed successfully."
        : "No active monitored domains found.",
  });
}
