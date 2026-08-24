import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminToken,
  getAdminPassword,
  isAdminAuthenticated,
} from "@/app/lib/adminAuth";
import { readPortfolioContent, writePortfolioContent } from "@/app/lib/content";
import type { PortfolioContent } from "@/app/types/portfolio";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const content = await readPortfolioContent();
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PortfolioContent;
    if (!body?.personal || !Array.isArray(body.projects) || !Array.isArray(body.experience)) {
      return NextResponse.json({ error: "Invalid portfolio payload" }, { status: 400 });
    }
    await writePortfolioContent(body);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const configured = getAdminPassword();
  if (!configured) {
    return NextResponse.json({ error: "ADMIN_PASSWORD is not configured" }, { status: 503 });
  }

  try {
    const { password } = (await request.json()) as { password?: string };
    if (!password || password !== configured) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const token = createAdminToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { ...adminCookieOptions(), maxAge: 0 });
  return response;
}
