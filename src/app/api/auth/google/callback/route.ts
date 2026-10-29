import { NextRequest, NextResponse } from "next/server";

/**
 * Handles Google OAuth 2.0 redirect, token exchange, and site fetching
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/tools/google-hub?error=${encodeURIComponent(error || "access_denied")}`
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${origin}/tools/google-hub?error=missing_credentials&setup=google_oauth`
    );
  }

  try {
    // 1. Exchange code for access & refresh token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      return NextResponse.redirect(
        `${origin}/tools/google-hub?error=token_exchange_failed`
      );
    }

    // 2. Query Google Search Console verified sites
    const sitesRes = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const sitesData = await sitesRes.json();
    const siteCount = Array.isArray(sitesData.siteEntry) ? sitesData.siteEntry.length : 0;

    return NextResponse.redirect(
      `${origin}/tools/google-hub?connected=true&sites_count=${siteCount}`
    );
  } catch (err: unknown) {
    return NextResponse.redirect(
      `${origin}/tools/google-hub?error=${encodeURIComponent((err as Error)?.message || "oauth_failed")}`
    );
  }
}
