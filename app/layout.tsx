import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shivani Rai",
  description: "Software developer portfolio — design, build, and ship complete products.",
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
