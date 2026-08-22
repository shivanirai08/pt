import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivani Rai",
  description: "Terminal-themed portfolio with a unified command layer and fullscreen CLI mode.",
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
