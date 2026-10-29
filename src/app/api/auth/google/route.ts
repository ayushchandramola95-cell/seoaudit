import { NextRequest, NextResponse } from "next/server";

/**
 * Initiates Google OAuth 2.0 flow for Google Search Console API access
 */
export async function GET(req: NextRequest) {
  const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
  const clientId = process.env.GOOGLE_CLIENT_ID;

  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  if (!clientId) {
    // If no client ID configured yet, redirect to Google Hub with setup guidance
    return NextResponse.redirect(
      `${origin}/tools/google-hub?error=missing_credentials&setup=google_oauth`
    );
  }

  const scopes = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "openid",
    "email",
    "profile",
  ].join(" ");

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(
    scopes
  )}&access_type=offline&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
