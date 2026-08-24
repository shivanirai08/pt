import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "portfolio_admin_token";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function createAdminToken(): string {
  const secret = getAdminPassword();
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update("portfolio-admin").digest("hex");
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = createAdminToken();
  if (!expected) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminToken(cookieStore.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}
