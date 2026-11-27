import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const body = Geist({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shivani Rai — Software Developer · Product Designer",
  description:
    "Portfolio of Shivani Rai, software developer and product designer. Read the story, browse the work, and follow the road.",
};

export const viewport: Viewport = {
  themeColor: "#faf4ec",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={body.variable}>
      <body>{children}</body>
    </html>
  );
}
