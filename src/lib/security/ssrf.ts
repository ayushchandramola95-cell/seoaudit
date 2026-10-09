import dns from "dns/promises";
import net from "net";

export class SsrfSecurityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SsrfSecurityError";
  }
}

/**
 * Checks whether an IPv4 address falls within private, loopback, or cloud-metadata ranges.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // malformed, treat as unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 10.0.0.0/8 (Private Class A)
  if (a === 10) return true;

  // 172.16.0.0/12 (Private Class B: 172.16.0.0 – 172.31.255.255)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private Class C)
  if (a === 192 && b === 168) return true;

  // 169.254.0.0/16 (Link-local & AWS/GCP/Azure instance metadata e.g. 169.254.169.254)
  if (a === 169 && b === 254) return true;

  // 224.0.0.0/4 (Multicast) & 240.0.0.0/4 (Reserved)
  if (a >= 224) return true;

  return false;
}

/**
 * Checks whether an IPv6 address falls within loopback, link-local, or private ranges.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();

  // ::1 loopback or unspecified ::
  if (normalized === "::1" || normalized === "::") return true;

  // Link-local: fe80:...
  if (normalized.startsWith("fe8") || normalized.startsWith("fe9") || normalized.startsWith("fea") || normalized.startsWith("feb")) {
    return true;
  }

  // Unique local addresses (fc00::/7 -> fc.. or fd..)
  if (normalized.startsWith("fc") || normalized.startsWith("fd")) {
    return true;
  }

  // IPv4-mapped IPv6 (::ffff:192.168.1.1)
  if (normalized.includes("::ffff:")) {
    const ipv4Part = normalized.split("::ffff:")[1];
    if (ipv4Part && net.isIPv4(ipv4Part)) {
      return isPrivateIPv4(ipv4Part);
    }
  }

  return false;
}

/**
 * Validates a target URL against SSRF attacks.
 * Throws SsrfSecurityError if the destination points to private, internal, or cloud metadata networks.
 */
export async function validateUrlForSsrf(rawUrl: string): Promise<{
  sanitizedUrl: string;
  hostname: string;
  resolvedIps: string[];
}> {
  let targetUrl = rawUrl.trim();
  if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
    targetUrl = `https://${targetUrl}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch {
    throw new SsrfSecurityError("The provided URL has an invalid format.");
  }

  // Scheme restriction: only HTTP/HTTPS
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new SsrfSecurityError(
      `Unsupported protocol '${parsed.protocol}'. Only 'http:' and 'https:' are permitted.`
    );
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block obvious localhost/internal hostnames directly
  const blockedHostnames = ["localhost", "127.0.0.1", "0.0.0.0", "metadata.google.internal"];
  if (
    blockedHostnames.includes(hostname) ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new SsrfSecurityError(
      `Access to internal or local hostname '${hostname}' is prohibited.`
    );
  }

  // If the hostname is an explicit raw IP address
  if (net.isIPv4(hostname)) {
    if (isPrivateIPv4(hostname)) {
      throw new SsrfSecurityError(`Access to private IP range '${hostname}' is prohibited.`);
    }
    return {
      sanitizedUrl: parsed.toString(),
      hostname,
      resolvedIps: [hostname],
    };
  }

  if (net.isIPv6(hostname)) {
    if (isPrivateIPv6(hostname)) {
      throw new SsrfSecurityError(`Access to private IPv6 range '${hostname}' is prohibited.`);
    }
    return {
      sanitizedUrl: parsed.toString(),
      hostname,
      resolvedIps: [hostname],
    };
  }

  // Resolve DNS to verify all destination IPs
  try {
    const lookupResults = await dns.lookup(hostname, { all: true });
    if (!lookupResults || lookupResults.length === 0) {
      throw new SsrfSecurityError(`Domain '${hostname}' could not be resolved.`);
    }

    const resolvedIps = lookupResults.map((r) => r.address);

    for (const res of lookupResults) {
      if (res.family === 4 && isPrivateIPv4(res.address)) {
        throw new SsrfSecurityError(
          `Domain '${hostname}' resolves to private/internal IP '${res.address}'. Request blocked.`
        );
      }
      if (res.family === 6 && isPrivateIPv6(res.address)) {
        throw new SsrfSecurityError(
          `Domain '${hostname}' resolves to private/internal IPv6 '${res.address}'. Request blocked.`
        );
      }
    }

    return {
      sanitizedUrl: parsed.toString(),
      hostname,
      resolvedIps,
    };
  } catch (err: unknown) {
    if (err instanceof SsrfSecurityError) {
      throw err;
    }
    throw new SsrfSecurityError(
      `DNS lookup failed for '${hostname}': ${(err as Error).message || "Unreachable host"}`
    );
  }
}
