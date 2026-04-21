import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivani — Frontend Developer & Designer",
  description: "Dual-mode portfolio: GUI + CLI. Bridging design and engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
