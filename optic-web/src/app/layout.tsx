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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
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
