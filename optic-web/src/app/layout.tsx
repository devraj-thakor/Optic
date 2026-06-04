import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Optic - AI Lead Intelligence",
  description:
    "Every inquiry, instantly understood. AI-native lead management for founders who move fast.",
  keywords: ["lead management", "AI", "CRM", "startup", "dashboard"],
  openGraph: {
    title: "Optic - AI Lead Intelligence",
    description: "Every inquiry, instantly understood.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      {/* Inline SVG data URI favicon — no network request, no caching issues,
          works on every page including /login and / regardless of rendering mode */}
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32' fill='none'%3E%3Crect width='32' height='32' rx='8' fill='%234B6EF5'/%3E%3Ccircle cx='16' cy='16' r='8' stroke='white' stroke-width='1.5' fill='none'/%3E%3Cpath d='M16 9L22 16L16 23L10 16L16 9Z' stroke='white' stroke-width='1.5' fill='none' stroke-linejoin='round'/%3E%3Ccircle cx='16' cy='16' r='2.5' fill='white'/%3E%3Cline x1='16' y1='5' x2='16' y2='7.5' stroke='white' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E"
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased"
        style={{ background: "#06070B", color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: {
              background: "#12141F",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#FFFFFF",
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
