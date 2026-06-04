import type { Metadata } from "next";
import Link from "next/link";
import { ChannelIcon, CHANNEL_COLORS } from "@/components/ui/ChannelIcon";
import { ChannelCard } from "@/components/landing/ChannelCard";

export const metadata: Metadata = {
  title: "Optic - AI Lead Intelligence Platform",
  description:
    "Every inquiry, instantly understood. AI-native lead management for founders who move fast.",
  icons: { icon: "/favicon.svg" },
};

function OpticLogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M10 4L15 10L10 16L5 10L10 4Z" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="10" cy="10" r="2" fill="white" />
    </svg>
  );
}

const channels = [
  { name: "Website", key: "website", desc: "Contact forms & landing pages" },
  { name: "WhatsApp", key: "whatsapp", desc: "Direct messages & groups" },
  { name: "Instagram", key: "instagram", desc: "DM inquiries & story replies" },
  { name: "Facebook", key: "facebook", desc: "Page messages & comments" },
  { name: "LinkedIn", key: "linkedin", desc: "InMail & connection requests" },
  { name: "Referral", key: "referral", desc: "Word of mouth & introductions" },
];

const features = [
  {
    title: "All your channels unified",
    desc: "Website, WhatsApp, Instagram, Facebook, LinkedIn, and referrals - all in one intelligent dashboard.",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9.5" stroke="#4B6EF5" strokeWidth="1.5" />
        <path d="M4 11H18M11 4C8.5 7 8.5 15 11 18M11 4C13.5 7 13.5 15 11 18" stroke="#4B6EF5" strokeWidth="1.3" strokeLinecap="round" />
        <line x1="4.5" y1="7.5" x2="17.5" y2="7.5" stroke="#4B6EF5" strokeWidth="1.2" />
        <line x1="4.5" y1="14.5" x2="17.5" y2="14.5" stroke="#4B6EF5" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: "AI that thinks before you do",
    desc: "Every new lead is instantly analyzed. Urgency, intent, score, and recommended action - in seconds.",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 3C7.13 3 4 6.13 4 10C4 12.38 5.19 14.47 7 15.74V18H15V15.74C16.81 14.47 18 12.38 18 10C18 6.13 14.87 3 11 3Z" stroke="#4B6EF5" strokeWidth="1.5" strokeLinejoin="round" />
        <line x1="8" y1="18" x2="14" y2="18" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9.5" y1="20" x2="12.5" y2="20" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="11" y1="8" x2="11" y2="12" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="11" cy="7" r="0.7" fill="#4B6EF5" />
      </svg>
    ),
  },
  {
    title: "Start every day with clarity",
    desc: "Press B for your morning briefing. Top high-priority leads, what to do next, right there.",
    icon: () => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="12" r="7" stroke="#4B6EF5" strokeWidth="1.5" />
        <polyline points="11,9 11,12 13,14" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 4L4 2M16 4L18 2" stroke="#4B6EF5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#06070B" }}>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 0%, rgba(88,40,180,0.35) 0%, rgba(75,110,245,0.12) 40%, transparent 70%), radial-gradient(ellipse at 10% 85%, rgba(75,110,245,0.1) 0%, transparent 60%)",
        }}
      />
      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "#4B6EF5" }}
          >
            <OpticLogoIcon />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
          >
            Optic
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ color: "#94A3B8" }}
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(180deg, #5C7CFA 0%, #4B6EF5 100%)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 20px rgba(75,110,245,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            Enter Dashboard
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5H10.5M7 3L10.5 6.5L7 10" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm mb-8"
            style={{
              background: "rgba(75,110,245,0.08)",
              border: "1px solid rgba(75,110,245,0.3)",
              boxShadow: "0 0 20px rgba(75,110,245,0.15)",
              color: "#A5B4FC",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-blue" style={{ background: "#818CF8", boxShadow: "0 0 10px #818CF8" }} />
            AI-Native Lead Intelligence
          </div>

          <h1
            className="text-5xl md:text-7xl font-light tracking-tight mb-6"
            style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.08 }}
          >
            <span style={{ color: "#FFFFFF" }}>Every inquiry,</span>
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #4B6EF5 0%, #818CF8 60%, rgba(255,255,255,0.9) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              instantly understood.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
            style={{ color: "#94A3B8" }}
          >
            Built for founders receiving leads from 5 different channels and mentally juggling which ones matter.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "linear-gradient(180deg, #5C7CFA 0%, #4B6EF5 100%)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 0 40px rgba(75,110,245,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              See Optic →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                color: "#9198A8",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Sign in
            </Link>
          </div>
        </section>

        {/* ── Channel Grid ─────────────────────────────────────────── */}
        <section className="px-6 py-20 max-w-4xl mx-auto">
          <p
            className="text-center text-xs font-semibold mb-10 uppercase tracking-widest"
            style={{ color: "#8B95A5" }}
          >
            All 6 channels, one dashboard
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {channels.map((ch) => {
              const color = CHANNEL_COLORS[ch.key] ?? "#4B6EF5";
              return (
                <ChannelCard
                  key={ch.key}
                  name={ch.name}
                  channelKey={ch.key}
                  desc={ch.desc}
                  color={color}
                />
              );
            })}
          </div>
        </section>

        {/* ── AI Showcase ───────────────────────────────────────────── */}
        <section className="px-6 py-20 max-w-2xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.03)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(75,110,245,0.2)",
              boxShadow: "0 0 60px rgba(75,110,245,0.08)",
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: "rgba(75,110,245,0.06)", borderBottom: "1px solid rgba(75,110,245,0.12)" }}
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2C5.24 2 3 4.24 3 7C3 8.53 3.68 9.9 4.75 10.84V12.5H11.25V10.84C12.32 9.9 13 8.53 13 7C13 4.24 10.76 2 8 2Z" stroke="#4B6EF5" strokeWidth="1.3" />
                  <line x1="5.5" y1="12.5" x2="10.5" y2="12.5" stroke="#4B6EF5" strokeWidth="1.3" strokeLinecap="round" />
                  <line x1="6.5" y1="14" x2="9.5" y2="14" stroke="#4B6EF5" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>AI Insight</span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(129,140,248,0.12)", color: "#818CF8", fontFamily: "JetBrains Mono, monospace" }}
                >
                  gemini/gemini-3.5-flash
                </span>
              </div>
              <span
                className="text-xs px-2.5 py-1 rounded-full"
                style={{ background: "rgba(248,113,113,0.12)", color: "#F87171" }}
              >
                High Urgency
              </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#8B95A5" }}>AI Summary</p>
                <p className="text-sm leading-relaxed" style={{ color: "#FFFFFF" }}>
                  Fintech startup seeking rapid MVP development for Series A fundraising. Requires mobile apps and admin dashboard within a 6-week deadline.
                </p>
              </div>
              <div
                className="p-4 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-xs uppercase tracking-wide mb-2" style={{ color: "#8B95A5" }}>Recommended Action</p>
                <p className="text-sm" style={{ color: "#34D399" }}>
                  Schedule a discovery call within 24 hours - Series A timeline creates genuine urgency.
                </p>
              </div>
              <div className="flex items-center justify-between text-xs" style={{ color: "#8B95A5" }}>
                <span>Score: <span style={{ color: "#818CF8", fontFamily: "JetBrains Mono, monospace" }}>92/100</span></span>
                <span>MVP Development · High Confidence · 1.2s</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────── */}
        <section className="px-6 py-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="rounded-xl p-6"
                style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="mb-4">
                  <feat.icon />
                </div>
                <h3 className="font-semibold mb-2 text-sm" style={{ color: "#FFFFFF", letterSpacing: "-0.01em" }}>
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA Strip ─────────────────────────────────────────────── */}
        <section className="px-6 py-24 text-center">
          <h2
            className="text-4xl md:text-5xl font-light mb-4 tracking-tight"
            style={{ color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}
          >
            Ready to see clearly?
          </h2>
          <p className="text-base mb-8" style={{ color: "#94A3B8" }}>
            Stop mentally juggling leads. Let Optic handle the intelligence.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: "linear-gradient(180deg, #5C7CFA 0%, #4B6EF5 100%)",
              color: "#FFFFFF",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 0 40px rgba(75,110,245,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            Try Optic →
          </Link>
        </section>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer
          className="text-center py-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#4B6EF5" }}>
              <OpticLogoIcon />
            </div>
            <span className="text-sm font-semibold" style={{ color: "#FFFFFF" }}>Optic</span>
          </div>
          <p className="text-xs" style={{ color: "#64748B" }}>
            Built for founders who move fast · Powered by Gemini AI
          </p>
        </footer>
      </main>
    </div>
  );
}
