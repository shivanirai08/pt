import { NextResponse } from "next/server";
import { readPortfolioContent } from "@/app/lib/content";

export async function GET() {
  const content = await readPortfolioContent();
  return NextResponse.json(content);
}
