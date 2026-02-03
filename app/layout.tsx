import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sequence | AI-Powered RCM Insights",
  description: "Stop guessing. Start knowing. Get instant AI-powered insights into your healthcare practice's revenue cycle performance.",
  keywords: ["RCM", "revenue cycle management", "healthcare analytics", "AI insights", "medical billing"],
  openGraph: {
    title: "Sequence | AI-Powered RCM Insights",
    description: "Get instant AI-powered insights into your healthcare practice's revenue cycle performance.",
    url: "https://sequence-ai.com",
    siteName: "Sequence",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
