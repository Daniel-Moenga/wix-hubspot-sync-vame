import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wix ↔ HubSpot Sync | Bi-directional Contact Integration",
  description:
    "Real-time bi-directional contact sync between Wix and HubSpot CRM. Form capture with UTM attribution, configurable field mapping, and OAuth 2.0 security.",
  openGraph: {
    title: "Wix ↔ HubSpot Sync",
    description:
      "Sync contacts between Wix and HubSpot in real-time. No Zapier required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
