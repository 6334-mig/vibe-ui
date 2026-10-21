import { createHmac, timingSafeEqual } from "crypto";

const GUEST_SECRET = process.env.GUEST_SECRET || "fallback_vibe_guest_secret_min_32_characters_long";

export interface GuestSession {
  guestId: string;
  timestamp: number;
}

/**
 * Creates an HMAC signed guest token string
 * Format: <guestId>.<timestamp>.<signature>
 */
export function signGuestToken(guestId: string): string {
  const timestamp = Date.now();
  const payload = `${guestId}.${timestamp}`;
  const hmac = createHmac("sha256", GUEST_SECRET);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
}

/**
 * Validates a guest token string and returns the payload if authentic
 */
export function verifyGuestToken(token: string | undefined | null): GuestSession | null {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [guestId, timestampStr, providedSig] = parts;
  const timestamp = parseInt(timestampStr, 10);

  // Validate format and expiry (e.g. 1 year)
  if (isNaN(timestamp) || !guestId) return null;
  const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
  if (Date.now() - timestamp > ONE_YEAR_MS) return null;

  const payload = `${guestId}.${timestampStr}`;
  const hmac = createHmac("sha256", GUEST_SECRET);
  hmac.update(payload);
  const expectedSig = hmac.digest("hex");

  try {
    const isMatch = timingSafeEqual(
      Buffer.from(providedSig, "hex"),
      Buffer.from(expectedSig, "hex")
    );
    if (!isMatch) return null;
  } catch {
    return null;
  }

  return { guestId, timestamp };
}
