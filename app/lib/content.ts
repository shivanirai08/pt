import fs from "fs/promises";
import path from "path";
import { defaultPortfolioContent, type PortfolioContent } from "../types/portfolio";

const CONTENT_PATH =
  process.env.PORTFOLIO_CONTENT_PATH ??
  path.join(/* turbopackIgnore: true */ process.cwd(), "content", "portfolio.json");

export async function readPortfolioContent(): Promise<PortfolioContent> {
  try {
    const raw = await fs.readFile(CONTENT_PATH, "utf-8");
    return JSON.parse(raw) as PortfolioContent;
  } catch {
    await writePortfolioContent(defaultPortfolioContent);
    return defaultPortfolioContent;
  }
}

export async function writePortfolioContent(data: PortfolioContent): Promise<void> {
  await fs.mkdir(path.dirname(CONTENT_PATH), { recursive: true });
  await fs.writeFile(CONTENT_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}
